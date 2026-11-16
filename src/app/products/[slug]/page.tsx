import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Globe2, ShieldCheck, CheckCircle2, ShoppingBag } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import AdSlot from "@/components/ads/AdSlot";
import { dbService } from "@/lib/db/service";

export async function generateMetadata(props?: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = props?.params ? await props.params : undefined;
  const slug = params?.slug;
  if (!slug) return {};
  const product = await dbService.getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} — Considered Finds`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "article",
    },
  };
}

export default async function ProductDetailPage(props?: {
  params: Promise<{ slug: string }>;
}) {
  const params = props?.params ? await props.params : undefined;
  const slug = params?.slug;
  if (!slug) notFound();
  const product = await dbService.getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const allProducts = await dbService.getProducts({ publishedOnly: true });
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Schema.org JSON-LD Structured Data for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: product.merchant,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="container py-8 md:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-ink transition"
        >
          <ArrowLeft size={14} /> Back to the collection
        </Link>

        {/* Product Showcase Grid */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16 items-start">
          {/* Visual Artwork / Photo */}
          <div className={`product-art art-${product.accent} min-h-[380px] md:min-h-[520px] relative`}>
            {discount && (
              <span className="absolute left-5 top-5 z-10 bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-bold text-ink shadow-sm">
                {discount}% LESS
              </span>
            )}

            {product.imageUrl ? (
              <div className="relative h-96 w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>
            ) : (
              <span className="product-symbol text-[120px] md:text-[160px]">{product.symbol}</span>
            )}

            <span className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[.18em] font-semibold text-ink/75">
              {product.category}
            </span>
          </div>

          {/* Editorial Content & Purchasing Module */}
          <div className="flex flex-col justify-center">
            <div className="eyebrow">{product.label} / {product.category}</div>
            <h1 className="serif mt-3 text-4xl sm:text-5xl leading-tight text-ink">{product.name}</h1>
            
            <p className="mt-6 text-sm leading-7 text-muted">{product.description}</p>

            {/* Pricing Section */}
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-ink">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-muted line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {discount && (
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {discount}% off
                </span>
              )}
              <span className="text-xs text-muted font-mono ml-1">
                ({product.currency})
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <ShoppingBag size={13} className="text-accent" />
              <span>Retailer partner: <strong className="text-ink">{product.merchant}</strong></span>
            </div>

            {/* BUY NOW Button -> Internal /go/slug Tracking Router */}
            <div className="mt-8">
              <Link
                href={`/go/${product.slug}`}
                className="btn-primary w-full sm:w-fit text-xs !py-3.5 !px-8 flex items-center justify-center gap-2"
              >
                <span>View at retailer</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {/* Availability & Disclosure Guarantees */}
            <div className="mt-8 border-t border-line pt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[.12em] text-muted">
                <span className="flex items-center gap-1.5">
                  <Globe2 size={13} className="text-accent" /> Available in: {product.countryAvailability.join(", ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-accent" /> Verified HTTPS Routing
                </span>
              </div>

              <div className="rounded bg-[#f7f7f4] p-3 text-xs leading-relaxed text-muted border border-line">
                <strong className="text-ink">Affiliate Transparency:</strong> When you purchase through our links, we may receive a commission from the merchant at no added cost to you. Pricing and stock are subject to confirmation on the retailer website.
              </div>
            </div>
          </div>
        </div>

        {/* Independent Ad Slot (Explicitly Separated from BUY NOW Button) */}
        <AdSlot slug="product_page" className="mt-14" />

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <div className="eyebrow">Continue exploring</div>
            <h2 className="serif mt-2 text-3xl">Related finds in {product.category}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
