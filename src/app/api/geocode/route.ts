import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyResultsToken, COOKIE_NAME } from "@/lib/auth";
import { reverseGeocode } from "@/lib/geocode";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const session = await verifyResultsToken(token);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lng = Number(req.nextUrl.searchParams.get("lng"));

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "invalid_coordinates" }, { status: 400 });
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "invalid_coordinates" }, { status: 400 });
  }

  const result = await reverseGeocode(lat, lng);
  return NextResponse.json(result);
}
