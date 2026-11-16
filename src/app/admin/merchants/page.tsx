import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Plus, ExternalLink, ShieldCheck } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";

export default async function AdminMerchantsPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const merchants = await dbService.getMerchants();

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Merchants</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Retail Partnerships</div>
            <h1 className="serif mt-1 text-3xl">Approved Merchants</h1>
            <p className="mt-1 text-xs text-muted">
              Whitelisted retailer domains, affiliate network partners, and commission agreements.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {merchants.map((m) => (
            <div key={m.id} className="bg-white p-5 rounded shadow-soft border border-line">
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#f4f3ef] px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                  {m.network}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck size={12} /> Active
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{m.name}</h3>
              <div className="mt-1 text-xs font-mono text-muted">{m.primaryDomain}</div>
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="text-muted">Commission:</span>
                <span className="font-semibold text-ink">{m.commissionRate || "Standard"}</span>
              </div>
              <div className="mt-3">
                <a
                  href={m.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  Visit merchant site <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
