import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Radio, ShieldAlert, CheckCircle2, XCircle, Lock } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";

export default async function AdminSmartLinksPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const providers = await dbService.getSmartLinkProviders();

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Smart Link Framework</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Future Monetization Module</div>
            <h1 className="serif mt-1 text-3xl">Smart Link Providers</h1>
            <p className="mt-1 text-xs text-muted">
              Pre-built adapter interface for future automated affiliate routers. Disabled by default in Version 1.0.
            </p>
          </div>
          <span className="rounded bg-neutral-200 px-3 py-1.5 text-xs font-bold uppercase text-neutral-700">
            Version 1.0 Policy: Disabled
          </span>
        </div>

        {/* Regulatory Governance Alert */}
        <div className="mt-6 rounded bg-[#17212b] p-5 text-white shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c58b69]">
            <Lock size={16} /> Architectural Protection Policy (§8)
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/70 max-w-3xl">
            Smart Link Providers are strictly deactivated in Version 1.0. Product purchases route exclusively to verified merchant URLs directly via <code>/go/[slug]</code>. Future activation requires explicit written network agreement, traffic source verification, and domain allowlist enforcement.
          </p>
        </div>

        {/* Provider Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {providers.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded shadow-soft border border-line">
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#f4f3ef] px-2 py-0.5 text-[10px] font-mono text-muted uppercase">
                  Adapter: {p.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  <XCircle size={12} /> Inactive (V1 Guard)
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-ink">{p.name}</h3>

              <div className="mt-4 space-y-2 text-xs border-t border-line pt-3">
                <div className="flex justify-between">
                  <span className="text-muted">Country Eligibility:</span>
                  <span className="font-mono text-ink">{p.countryEligibility.join(", ") || "All"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Traffic Eligibility:</span>
                  <span className="font-mono text-ink">{p.trafficEligibility.join(", ") || "Direct"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Allowlisted Domains:</span>
                  <span className="font-mono text-ink">{p.allowlistedDomains.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Compliance Status:</span>
                  <span className="text-emerald-700 font-medium">Audited & Locked</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-line text-[11px] text-muted italic">
                Activation disabled until approved affiliate network integration phase.
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
