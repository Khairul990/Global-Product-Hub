import { NextRequest, NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import { AdSlotSchema } from "@/types/database";

export async function GET() {
  try {
    const slots = await dbService.getAdSlots();
    return NextResponse.json({ success: true, count: slots.length, slots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch ad slots" }, { status: 500 });
  }
}
