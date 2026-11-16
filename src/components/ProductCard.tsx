import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { DbProduct } from "@/types/database";

export default function ProductCard({ product }: { product: DbProduct }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <Link href={`/products/${product.slug}`} className="card-link group block">
      <div className={`product-art art-${product.accent} relative`}>
        {discount && (
          <span className="absolute left-4 top-4 z-10 bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-wider text-ink shadow-sm">
            {discount}% LESS
          </span>
        )}

        {product.imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 transition group-hover:scale-105 duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <span className="product-symbol">{product.symbol}</span>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
          <span className="bg-white/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-[.14em] text-ink/75">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-[.13em] text-accent font-semibold">
            {product.label}
          </div>
          <h3 className="mt-1 text-[15px] font-semibold tracking-[-.02em] group-hover:text-accent transition">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="font-semibold text-ink">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] text-muted font-mono ml-1">
              ({product.merchant})
            </span>
          </div>
        </div>
        <ArrowUpRight
          className="mt-1 text-muted transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          size={17}
        />
      </div>
    </Link>
  );
}
