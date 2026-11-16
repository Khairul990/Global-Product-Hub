import { NextRequest, NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import { AdSlotSchema } from "@/types/database";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const partial = AdSlotSchema.partial();
    const validation = partial.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid ad slot data", details: validation.error.flatten() }, { status: 400 });
    }

    const updated = await dbService.updateAdSlot(id, validation.data);
    if (!updated) {
      return NextResponse.json({ error: "Ad slot not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slot: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update ad slot" }, { status: 500 });
  }
}
