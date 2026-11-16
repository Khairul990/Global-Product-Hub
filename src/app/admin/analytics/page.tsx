import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, Bot, Globe, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";
import { dbService } from "@/lib/db/service";

export default async function AdminAnalyticsPage() {
  const user = await getServerAdminUser();
  if (!user) redirect("/admin/login");

  const events = await dbService.getClickEvents(100);
  const totalClicks = events.length;
  const botClicks = events.filter((e) => e.isBot).length;
  const humanClicks = totalClicks - botClicks;

  return (
    <main className="min-h-screen bg-[#f2f3f0] pb-16">
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="text-xs text-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft size={14} /> Control Room
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Analytics & Audit</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Performance & Traffic Integrity</div>
            <h1 className="serif mt-1 text-3xl">Outbound Clicks & Conversions</h1>
            <p className="mt-1 text-xs text-muted">
              Persistent outbound click event logging, bot traffic isolation, and verified conversion reconciliation.
            </p>
          </div>
        </div>

        {/* Regulatory & Integrity Notice */}
        <div className="mt-6 rounded bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Business Integrity Policy:</strong> An outbound click represents visitor interest and retailer routing. It is <em>never</em> recorded or reported as a confirmed sale. Conversions are imported strictly through official affiliate network settlement reports.
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-5 rounded shadow-soft border border-line">
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Total Logged Events</span>
              <BarChart3 size={16} className="text-accent" />
            </div>
            <div className="mt-3 text-3xl font-semibold text-ink">{totalClicks}</div>
            <div className="mt-1 text-[10px] text-muted">Stored in click_events</div>
          </div>

          <div className="bg-white p-5 rounded shadow-soft border border-line">
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Verified Human Clicks</span>
              <UserCheck size={16} className="text-emerald-600" />
            </div>
            <div className="mt-3 text-3xl font-semibold text-ink">{humanClicks}</div>
            <div className="mt-1 text-[10px] text-muted">Filtered legitimate traffic</div>
          </div>

          <div className="bg-white p-5 rounded shadow-soft border border-line">
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Filtered Bot / Crawler Hits</span>
              <Bot size={16} className="text-neutral-400" />
            </div>
            <div className="mt-3 text-3xl font-semibold text-ink">{botClicks}</div>
            <div className="mt-1 text-[10px] text-muted">Excluded from performance</div>
          </div>

          <div className="bg-white p-5 rounded shadow-soft border border-line">
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Confirmed Conversions</span>
              <Sparkles size={16} className="text-accent" />
            </div>
            <div className="mt-3 text-3xl font-semibold text-ink">—</div>
            <div className="mt-1 text-[10px] text-muted">Import network CSV to reconcile</div>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="mt-8 bg-white rounded shadow-soft border border-line overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-ink">Recent Outbound Click Events</h2>
            <span className="text-[10px] text-muted">Latest {events.length} records</span>
          </div>

          {events.length === 0 ? (
            <div className="p-10 text-center text-xs text-muted">
              No outbound clicks recorded yet. Clicks on "View at retailer" / BUY NOW will appear here in real time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-[#f7f7f4] text-muted uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Click ID</th>
                    <th className="py-2.5 px-4">Product Slug</th>
                    <th className="py-2.5 px-4">Merchant</th>
                    <th className="py-2.5 px-4">Country</th>
                    <th className="py-2.5 px-4">Campaign</th>
                    <th className="py-2.5 px-4">IP Hash</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-mono text-[11px]">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-[#faf9f6]">
                      <td className="py-2.5 px-4 text-accent font-semibold">{e.clickId}</td>
                      <td className="py-2.5 px-4 font-sans font-medium text-ink">{e.productSlug}</td>
                      <td className="py-2.5 px-4 font-sans text-muted">{e.merchant}</td>
                      <td className="py-2.5 px-4">{e.country}</td>
                      <td className="py-2.5 px-4 text-muted">{e.campaign || "editorial"}</td>
                      <td className="py-2.5 px-4 text-neutral-400">{e.ipHash || "—"}</td>
                      <td className="py-2.5 px-4 font-sans">
                        {e.isBot ? (
                          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] text-neutral-500">Bot</span>
                        ) : (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-700 font-bold">Human</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right font-sans text-muted text-[10px]">
                        {new Date(e.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
