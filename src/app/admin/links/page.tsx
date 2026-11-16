import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, ShieldCheck, Link2 } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";

export default async function AdminLinksPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const products = await dbService.getProducts({ publishedOnly: false });
  const configured = products.filter((p) => Boolean(p.affiliateUrl));
  const unconfigured = products.filter((p) => !p.affiliateUrl);

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Affiliate Engine</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Monetization Control</div>
            <h1 className="serif mt-1 text-3xl">Affiliate Links & Destinations</h1>
            <p className="mt-1 text-xs text-muted">
              Audit per-product merchant links, tracking sub-ids, and verified HTTPS destination status.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Active: {configured.length}
            </span>
            <span className="rounded bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200">
              Needs URL: {unconfigured.length}
            </span>
          </div>
        </div>

        {/* Security Rule Card */}
        <div className="mt-6 rounded bg-[#17212b] p-5 text-white shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c58b69]">
            <ShieldCheck size={16} /> Secure Server-Side Routing Guarantee
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/70 max-w-3xl">
            All user clicks flow through the internal <code>/go/[slug]</code> router. Destination URLs are strictly validated for HTTPS protocol, sanitized, tagged with anonymous sub-ids, and logged in <code>click_events</code>. Unconfigured URLs return HTTP 503 instead of broken loops.
          </p>
        </div>

        {/* Link Registry Table */}
        <div className="mt-8 overflow-hidden rounded bg-white shadow-soft border border-line">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-[#f7f7f4] text-muted uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Merchant</th>
                  <th className="py-3 px-4">Internal Tracking URL</th>
                  <th className="py-3 px-4">Destination Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf9f6] transition">
                    <td className="py-3.5 px-4 font-semibold text-ink">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-muted font-normal">{p.category}</div>
                    </td>
                    <td className="py-3.5 px-4 text-muted font-medium">
                      {p.merchant}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-ink">
                      <Link href={`/go/${p.slug}`} target="_blank" className="hover:text-accent flex items-center gap-1">
                        /go/{p.slug} <ExternalLink size={12} className="text-muted" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.affiliateUrl ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                            <CheckCircle2 size={11} /> HTTPS Verified
                          </span>
                          <div className="text-[10px] font-mono text-muted truncate max-w-xs">{p.affiliateUrl}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                          <XCircle size={11} /> Unconfigured (503 Guard)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="rounded border border-line px-2.5 py-1 text-xs font-semibold hover:border-ink"
                      >
                        Configure Link
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
