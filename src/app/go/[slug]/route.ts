import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db/service";
import { isBotTraffic, hashIp, generateClickId, appendTrackingParam } from "@/lib/affiliate/tracker";

const ALLOWED_PROTOCOLS = new Set(["https:"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const product = await dbService.getProductBySlug(slug);

  if (!product) {
    return new NextResponse("Product not found in catalogue", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Affiliate URL guard: unset URLs return 503 rather than broken redirect
  if (!product.affiliateUrl) {
    return new NextResponse(
      `The merchant destination for "${product.name}" is currently being verified by our editorial team. Please check back shortly.`,
      { status: 503, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain" } }
    );
  }

  // Destination URL security check
  let destinationUrl: URL;
  try {
    destinationUrl = new URL(product.affiliateUrl);
  } catch {
    return new NextResponse("Invalid retailer destination URL configured", { status: 500 });
  }

  if (!ALLOWED_PROTOCOLS.has(destinationUrl.protocol)) {
    return new NextResponse("Security error: Only secure HTTPS destinations are permitted", { status: 400 });
  }

  // Extract Request Context
  const searchParams = request.nextUrl.searchParams;
  const campaign = searchParams.get("cmp") || searchParams.get("campaign") || "editorial";
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const rawIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    searchParams.get("country") ||
    "GLOBAL";

  const isBot = isBotTraffic(userAgent);
  const clickId = generateClickId();
  const ipHash = hashIp(rawIp);

  // Persist outbound click event asynchronously
  try {
    await dbService.recordClickEvent({
      clickId,
      productId: product.id,
      productSlug: product.slug,
      merchant: product.merchant,
      country,
      campaign,
      referer,
      userAgent: userAgent.substring(0, 200),
      ipHash,
      isBot,
    });
  } catch (err) {
    console.error("Failed to log outbound click event:", err);
  }

  // Append tracking sub-id to final destination
  const trackedUrl = appendTrackingParam(product.affiliateUrl, clickId, campaign);

  // 302 Temporary Redirect to merchant with no-cache headers to ensure accurate tracking
  return NextResponse.redirect(trackedUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Click-Id": clickId,
    },
  });
}
