import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers, Plus, Calendar, Tag } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";

const demoCampaigns = [
  { id: "cmp-01", name: "The Spring Edit 2026", slug: "spring_edit", status: "Active", dates: "Mar 1 – May 31", clicks: "—" },
  { id: "cmp-02", name: "Workspace Refresh", slug: "workspace_refresh", status: "Active", dates: "Ongoing", clicks: "—" },
  { id: "cmp-03", name: "Holiday Gift Guide", slug: "holiday_guide", status: "Scheduled", dates: "Nov 15 – Dec 31", clicks: "—" },
];

export default async function AdminCampaignsPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Campaigns</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Affiliate Marketing Channels</div>
            <h1 className="serif mt-1 text-3xl">Editorial Campaigns</h1>
            <p className="mt-1 text-xs text-muted">
              Configure campaign sub-ids for newsletters, social edits, and seasonal curations to isolate traffic source performance.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoCampaigns.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded shadow-soft border border-line">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] font-mono text-accent bg-[#f4f3ef] px-2 py-0.5 rounded">
                  <Tag size={10} /> cmp={c.slug}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {c.status}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink">{c.name}</h3>
              <div className="mt-4 pt-3 border-t border-line text-xs flex items-center justify-between text-muted">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {c.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
