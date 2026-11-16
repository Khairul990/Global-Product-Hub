import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Megaphone, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";
import AdSlotManager from "./AdSlotManager";

export default async function AdminAdsPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const slots = await dbService.getAdSlots();

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Ad Placements</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Display Inventory</div>
            <h1 className="serif mt-1 text-3xl">Advertisement Management</h1>
            <p className="mt-1 text-xs text-muted">
              Configure 6 compliant display slots, partner HTML snippets, and user consent gates.
            </p>
          </div>
        </div>

        {/* Ad Guidelines Alert */}
        <div className="mt-6 rounded bg-neutral-900 p-5 text-white shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c58b69]">
            <ShieldAlert size={16} /> Strict Ethical Ad Policy
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-white/70">
            <li>• Advertisements are kept visually separate from BUY NOW buttons and editorial scores.</li>
            <li>• Never force users to click advertisements or use deceptive pop-unders.</li>
            <li>• Consent-aware gating ensures slots respect GDPR and CCPA preferences.</li>
          </ul>
        </div>

        {/* Ad Slots Grid */}
        <AdSlotManager initialSlots={slots} />
      </div>
    </main>
  );
}
