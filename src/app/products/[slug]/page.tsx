import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Globe2, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import { getProduct, products, discountPercent } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const discount = discountPercent(product);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  return (
    <>
      <SiteHeader/>
      <main className="container py-8 md:py-14">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted hover:text-ink"><ArrowLeft size={14}/> Back to the edit</Link>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className={`product-art art-${product.accent} min-h-[360px] md:min-h-[540px]`}>
            {discount && <span className="absolute left-5 top-5 z-10 bg-white/90 px-3 py-2 text-xs font-bold">{discount}% LESS</span>}
            <span className="product-symbol text-[110px] md:text-[150px]">{product.symbol}</span>
            <span className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[.16em]">{product.category}</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="eyebrow">{product.label} / {product.category}</div>
            <h1 className="serif mt-4 text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-6 text-sm leading-7 text-muted">{product.description}</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && <span className="text-sm text-muted line-through">${product.compareAtPrice.toFixed(2)}</span>}
              {discount && <span className="text-xs font-bold text-accent">{discount}% off</span>}
            </div>
            <p className="mt-2 text-[11px] text-muted">Displayed price is illustrative until connected to a verified merchant feed.</p>
            <Link href={`/go/${product.slug}`} className="btn-primary mt-8 w-full sm:w-fit">View at retailer <ArrowUpRight size={15} className="ml-3"/></Link>
            <div className="mt-5 flex flex-wrap gap-5 border-t border-line pt-5 text-[10px] uppercase tracking-[.1em] text-muted">
              <span className="flex items-center gap-2"><Globe2 size={14}/> Regional availability varies</span>
              <span className="flex items-center gap-2"><ShieldCheck size={14}/> Affiliate disclosure</span>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted">We may earn a commission from qualifying purchases made through retailer links. This does not change the price you pay.</p>
          </div>
        </div>
        {related.length > 0 && <section className="mt-20 border-t border-line pt-10"><div className="eyebrow">Continue exploring</div><h2 className="serif mt-3 text-3xl">Related finds</h2><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
      </main>
    </>
  );
}
