"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  hashAccessCode,
  accessCodeLookup,
  verifyAccessCode,
  createResultsToken,
  verifyResultsToken,
  COOKIE_NAME,
} from "@/lib/auth";
import { generateSlug, generateAccessCode } from "@/lib/slug";
import { expiryToDate, TERMS_VERSION, type ExpiryValue } from "@/lib/constants";
import { createLinkSchema, accessCodeSchema, consentSchema } from "@/lib/validations";
import { getClientIp, getUserAgent } from "@/lib/request";
import { ConsentStatus, ExpiryOption } from "@prisma/client";

export type CreateLinkState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createLink(
  _prev: CreateLinkState,
  formData: FormData
): Promise<CreateLinkState> {
  const raw = {
    creatorName: formData.get("creatorName"),
    purpose: formData.get("purpose"),
    destinationUrl: formData.get("destinationUrl"),
    expiryOption: formData.get("expiryOption"),
    termsAccepted: formData.get("termsAccepted") === "on",
    shareCreatorLocation: formData.get("shareCreatorLocation") === "on",
    creatorLatitude: formData.get("creatorLatitude")
      ? Number(formData.get("creatorLatitude"))
      : undefined,
    creatorLongitude: formData.get("creatorLongitude")
      ? Number(formData.get("creatorLongitude"))
      : undefined,
    creatorAccuracy: formData.get("creatorAccuracy")
      ? Number(formData.get("creatorAccuracy"))
      : undefined,
  };

  const parsed = createLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;
  const slug = generateSlug();
  const accessCode = generateAccessCode();
  const accessCodeHash = await hashAccessCode(accessCode);
  const lookup = accessCodeLookup(accessCode);
  const expiresAt = expiryToDate(data.expiryOption as ExpiryValue);

  const shareLocation =
    data.shareCreatorLocation &&
    data.creatorLatitude != null &&
    data.creatorLongitude != null;

  await prisma.link.create({
    data: {
      slug,
      creatorName: data.creatorName,
      purpose: data.purpose,
      destinationUrl: data.destinationUrl,
      accessCodeHash,
      accessCodeLookup: lookup,
      expiryOption: data.expiryOption as ExpiryOption,
      expiresAt,
      creatorConsentAt: new Date(),
      termsVersion: TERMS_VERSION,
      creatorLatitude: shareLocation ? data.creatorLatitude : null,
      creatorLongitude: shareLocation ? data.creatorLongitude : null,
      creatorAccuracy: shareLocation ? data.creatorAccuracy : null,
      creatorLocationAt: shareLocation ? new Date() : null,
    },
  });

  redirect(
    `/create/success?slug=${slug}&code=${encodeURIComponent(accessCode)}`
  );
}

export async function verifyResultsAccess(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = accessCodeSchema.safeParse({
    accessCode: formData.get("accessCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.accessCode?.[0] };
  }

  const lookup = accessCodeLookup(parsed.data.accessCode);
  const link = await prisma.link.findUnique({
    where: { accessCodeLookup: lookup },
  });

  if (!link) {
    return { error: "Invalid access code" };
  }

  const ok = await verifyAccessCode(parsed.data.accessCode, link.accessCodeHash);
  if (!ok) {
    return { error: "Invalid access code" };
  }

  const token = await createResultsToken(link.id);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
    path: "/",
  });

  redirect("/results/dashboard");
}

export async function getAuthorizedLink() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifyResultsToken(token);
  if (!session) return null;

  const link = await prisma.link.findUnique({
    where: { id: session.linkId },
    include: {
      events: { orderBy: { openedAt: "desc" } },
    },
  });

  return link;
}

export async function logoutResults() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/results");
}

export async function openLinkEvent(slug: string) {
  const link = await prisma.link.findUnique({ where: { slug } });
  if (!link) return { error: "Link not found" as const };

  if (new Date() > link.expiresAt) {
    return { error: "expired" as const, link };
  }

  const ip = await getClientIp();
  const userAgent = await getUserAgent();

  const event = await prisma.linkEvent.create({
    data: {
      linkId: link.id,
      ipAddress: ip,
      userAgent,
      consentStatus: ConsentStatus.PENDING,
    },
  });

  return { link, eventId: event.id };
}

export async function submitConsent(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const raw = {
    eventId: formData.get("eventId"),
    accepted: formData.get("accepted") === "true",
    termsAccepted: formData.get("termsAccepted") === "true",
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : undefined,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : undefined,
    accuracy: formData.get("accuracy") ? Number(formData.get("accuracy")) : undefined,
  };

  const parsed = consentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid submission" };
  }

  const event = await prisma.linkEvent.findUnique({
    where: { id: parsed.data.eventId },
    include: { link: true },
  });

  if (!event) return { error: "Session not found" };
  if (new Date() > event.link.expiresAt) return { error: "This link has expired" };

  if (!parsed.data.accepted) {
    await prisma.linkEvent.update({
      where: { id: event.id },
      data: {
        consentStatus: ConsentStatus.DECLINED,
        consentedAt: new Date(),
      },
    });
    revalidatePath(`/l/${event.link.slug}`);
    return { success: true };
  }

  if (!parsed.data.termsAccepted) {
    return { error: "You must accept the Terms and Privacy Policy" };
  }

  if (
    parsed.data.latitude == null ||
    parsed.data.longitude == null ||
    Number.isNaN(parsed.data.latitude) ||
    Number.isNaN(parsed.data.longitude)
  ) {
    await prisma.linkEvent.update({
      where: { id: event.id },
      data: {
        consentStatus: ConsentStatus.GPS_DENIED,
        consentedAt: new Date(),
        termsAcceptedAt: new Date(),
      },
    });
    return { success: true };
  }

  await prisma.linkEvent.update({
    where: { id: event.id },
    data: {
      consentStatus: ConsentStatus.ACCEPTED,
      consentedAt: new Date(),
      termsAcceptedAt: new Date(),
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      accuracy: parsed.data.accuracy ?? null,
      locationTimestamp: new Date(),
    },
  });

  revalidatePath(`/l/${event.link.slug}`);
  return { success: true };
}
