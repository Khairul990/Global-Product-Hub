import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

const ALLOWED_PROTOCOLS = new Set(["https:"]);

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = getProduct(slug);
  if (!product) return new NextResponse("Product not found", { status: 404 });

  // Affiliate URLs are deliberately unset in demo data. Configure and verify
  // a real merchant affiliate URL before enabling a redirect.
  if (!product.affiliateUrl) {
    return new NextResponse(
      "This retailer link has not been configured yet. Please check back later.",
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  let destination: URL;
  try {
    destination = new URL(product.affiliateUrl);
  } catch {
    return new NextResponse("Invalid retailer destination", { status: 500 });
  }
  if (!ALLOWED_PROTOCOLS.has(destination.protocol)) {
    return new NextResponse("Only secure HTTPS destinations are allowed", { status: 400 });
  }

  // TODO: persist a click event server-side before redirecting.
  return NextResponse.redirect(destination, 302);
}
