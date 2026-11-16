import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { discountPercent } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  return (
    <Link href={`/products/${product.slug}`} className="card-link group block">
      <div className={`product-art art-${product.accent}`}>
        {discount && <span className="absolute left-4 top-4 z-10 bg-white/85 px-3 py-1 text-[10px] font-bold tracking-wider">{discount}% LESS</span>}
        <span className="product-symbol">{product.symbol}</span>
        <span className="absolute bottom-4 right-4 text-[9px] tracking-[.16em] uppercase text-ink/60">{product.category}</span>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-[.13em] text-accent">{product.label}</div>
          <h3 className="mt-1 text-[15px] font-semibold tracking-[-.02em]">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && <span className="text-xs text-muted line-through">${product.compareAtPrice.toFixed(2)}</span>}
          </div>
        </div>
        <ArrowUpRight className="mt-1 text-muted transition group-hover:-translate-y-1 group-hover:translate-x-1" size={17}/>
      </div>
    </Link>
  );
}
