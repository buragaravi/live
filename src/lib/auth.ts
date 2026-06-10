import { createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "locate_results_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "change_me_to_a_long_random_secret") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production");
    }
  }
  return new TextEncoder().encode(secret ?? "dev-secret");
}

export function accessCodeLookup(code: string): string {
  return createHash("sha256")
    .update(code.trim().toUpperCase())
    .digest("hex");
}

export async function hashAccessCode(code: string): Promise<string> {
  return bcrypt.hash(code, 12);
}

export async function verifyAccessCode(
  code: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export async function createResultsToken(linkId: string): Promise<string> {
  return new SignJWT({ linkId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(getSecret());
}

export async function verifyResultsToken(
  token: string
): Promise<{ linkId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.linkId === "string") {
      return { linkId: payload.linkId };
    }
    return null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
