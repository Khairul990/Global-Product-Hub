import { NextRequest, NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 100);

    const events = await dbService.getClickEvents(limit);

    // Compute basic analytics
    const totalClicks = events.length;
    const botClicks = events.filter((e) => e.isBot).length;
    const humanClicks = totalClicks - botClicks;

    // Group by product
    const productStats: Record<string, number> = {};
    const countryStats: Record<string, number> = {};

    events.forEach((e) => {
      if (!e.isBot) {
        productStats[e.productSlug] = (productStats[e.productSlug] || 0) + 1;
        countryStats[e.country] = (countryStats[e.country] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalClicks,
        humanClicks,
        botClicks,
        productStats,
        countryStats,
      },
      recentEvents: events.slice(0, 50),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch click analytics" }, { status: 500 });
  }
}
