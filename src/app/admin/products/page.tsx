import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, ExternalLink, Edit, Trash2, CheckCircle2, XCircle, Search, Globe } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import ProductActions from "./ProductActions";

export default async function AdminProductsPage() {
  const user = await getServerAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  const products = await dbService.getProducts({ publishedOnly: false });
  const categories = await dbService.getCategories();

  return (
    <main className="min-h-screen bg-[#f2f3f0]">
      {/* Top Header */}
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1">
              <ArrowLeft size={14} /> Control Room
            </Link>
            <span className="text-line">/</span>
            <span className="text-xs font-bold uppercase tracking-wider text-ink">Products</span>
          </div>
          <Link
            href="/admin/products/new"
            className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Inventory & Curation</div>
            <h1 className="serif mt-1 text-3xl">Product Catalogue</h1>
            <p className="mt-1 text-xs text-muted">
              Manage your considered finds, pricing transparency, verified retailer destinations, and publishing status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-white px-3 py-1.5 text-xs font-semibold text-ink border border-line">
              Total: {products.length}
            </span>
          </div>
        </div>

        {/* Product Table */}
        <div className="mt-6 overflow-hidden rounded bg-white shadow-soft border border-line">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-[#f7f7f4] text-muted uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Merchant & Affiliate</th>
                  <th className="py-3 px-4">Countries</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => {
                  const discount = p.compareAtPrice && p.compareAtPrice > p.price
                    ? Math.round((1 - p.price / p.compareAtPrice) * 100)
                    : null;

                  return (
                    <tr key={p.id} className="hover:bg-[#faf9f6] transition">
                      <td className="py-3.5 px-4 font-medium text-ink">
                        <div className="flex items-center gap-3">
                          <div className={`product-art art-${p.accent} !min-h-[44px] !h-11 !w-11 shrink-0 rounded`}>
                            <span className="text-sm font-serif">{p.symbol}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{p.name}</div>
                            <div className="text-[10px] text-muted">{p.label} · slug: /{p.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="rounded bg-[#f4f3ef] px-2 py-1 text-[11px] font-medium text-ink">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-sm">
                          ${p.price.toFixed(2)} <span className="text-[10px] text-muted">{p.currency}</span>
                        </div>
                        {p.compareAtPrice && (
                          <div className="text-[10px] text-muted line-through">
                            ${p.compareAtPrice.toFixed(2)}
                            {discount && <span className="ml-1 text-accent font-bold">(-{discount}%)</span>}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-ink">{p.merchant}</div>
                        {p.affiliateUrl ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                            <CheckCircle2 size={11} /> Verified HTTPS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                            <XCircle size={11} /> Unset (503 guard)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {p.countryAvailability.map((c) => (
                            <span key={c} className="rounded bg-neutral-100 px-1 py-0.5 text-[9px] font-mono">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {p.published ? (
                          <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                            Draft
                          </span>
                        )}
                        {p.featured && (
                          <span className="ml-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            Featured
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <ProductActions product={p} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
