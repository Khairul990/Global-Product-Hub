import { NextRequest, NextResponse } from "next/server";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import { ProductSchema } from "@/types/database";

// GET /api/products - List products (Public for published; all for admins)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const country = searchParams.get("country") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const all = searchParams.get("all") === "true";

    const user = await getServerAdminUser();
    // Only admins can request unpublished products
    const publishedOnly = !all || !user;

    const products = await dbService.getProducts({
      category,
      search,
      country,
      featuredOnly,
      publishedOnly,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products - Create product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getServerAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Admin credentials required." }, { status: 401 });
    }

    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // Validate using Zod (omitting id and timestamps which service creates)
    const partialSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true });
    const validation = partialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Ensure HTTPS if affiliate URL is provided
    if (validation.data.affiliateUrl) {
      const url = new URL(validation.data.affiliateUrl);
      if (url.protocol !== "https:") {
        return NextResponse.json({ error: "Affiliate URL must use secure HTTPS protocol." }, { status: 400 });
      }
    }

    const created = await dbService.createProduct(validation.data);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
