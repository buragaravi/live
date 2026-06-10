import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ConsentStatus } from "@prisma/client";

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.link.findUnique({ where: { slug } });
  if (!link) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (new Date() > link.expiresAt) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  const event = await prisma.linkEvent.create({
    data: {
      linkId: link.id,
      ipAddress: clientIp(req),
      userAgent: req.headers.get("user-agent"),
      consentStatus: ConsentStatus.PENDING,
    },
  });

  return NextResponse.json({
    eventId: event.id,
    hostname: hostnameFromUrl(link.destinationUrl),
    link: {
      id: link.id,
      slug: link.slug,
      creatorName: link.creatorName,
      purpose: link.purpose,
      destinationUrl: link.destinationUrl,
      expiresAt: link.expiresAt.toISOString(),
      creatorLatitude: link.creatorLatitude,
      creatorLongitude: link.creatorLongitude,
    },
  });
}
