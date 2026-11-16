import { NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";

export async function GET() {
  const user = await getServerAdminUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
