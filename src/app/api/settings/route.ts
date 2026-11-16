import { NextRequest, NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import { SiteSettingsSchema } from "@/types/database";

export async function GET() {
  try {
    const settings = await dbService.getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getServerAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = SiteSettingsSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid settings format", details: validation.error.flatten() }, { status: 400 });
    }

    const updated = await dbService.updateSiteSettings(validation.data);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
