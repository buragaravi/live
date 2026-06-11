import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "locate_admin_session";

function getSecret() {
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  return new TextEncoder().encode(secret);
}

async function isValidAdminSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin" && typeof payload.adminId === "string";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin") {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (token && (await isValidAdminSession(token))) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/")) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || !(await isValidAdminSession(token))) {
      const login = new URL("/admin", req.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
