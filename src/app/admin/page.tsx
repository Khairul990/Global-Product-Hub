import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  Layers,
  Link2,
  Megaphone,
  Radio,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Users,
  LogOut,
  FolderTree,
} from "lucide-react";
import { getServerAdminUser } from "@/lib/auth/server";

export default async function AdminDashboardPage() {
  const user = await getServerAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const cards = [
    { title: "Products in Catalog", value: "06", note: "Published items", icon: Boxes },
    { title: "Affiliate Outbound Clicks", value: "0", note: "Logged in click_events", icon: Link2 },
    { title: "Confirmed Conversions", value: "—", note: "Network imports pending", icon: BarChart3 },
    { title: "Active Ad Placements", value: "06", note: "Consent-aware slots", icon: Megaphone },
  ];

  const modules = [
    { name: "Products", desc: "Manage catalogue, prices, country availability and publishing", href: "/admin/products", icon: Boxes },
    { name: "Categories", desc: "Organize taxonomy and category filters", href: "/admin/categories", icon: FolderTree },
    { name: "Merchants", desc: "Approved retailer domains and commission settings", href: "/admin/merchants", icon: ShoppingBag },
    { name: "Affiliate Links", desc: "Verified HTTPS destination mapping and tracking", href: "/admin/links", icon: Link2 },
    { name: "Advertisement Management", desc: "Configure 6 compliant display slots and consent", href: "/admin/ads", icon: Megaphone },
    { name: "Smart Link Providers", desc: "Framework adapter status (currently disabled)", href: "/admin/smartlinks", icon: Radio },
    { name: "Campaigns", desc: "Track affiliate campaigns and seasonal edits", href: "/admin/campaigns", icon: Layers },
    { name: "Analytics & Clicks", desc: "Audit outbound click events and network conversions", href: "/admin/analytics", icon: BarChart3 },
    { name: "Site Settings", desc: "Platform currency, legal disclosures and consent defaults", href: "/admin/settings", icon: Settings2 },
    { name: "Admin Users & Audit", desc: "Role-based access control and security logs", href: "/admin/users", icon: Users },
  ];

  return (
    <main className="min-h-screen bg-[#f2f3f0]">
      {/* Top Bar */}
      <header className="border-b border-line bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold tracking-tight">
              GLOBAL<span className="text-accent">.</span> / CONTROL ROOM
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck size={12} /> Authenticated
            </span>
            {user.isDemo && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200">
                Evaluation Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted hidden md:inline">
              Signed in as <strong className="text-ink">{user.email}</strong> ({user.role})
            </span>
            <Link href="/" target="_blank" className="text-muted hover:text-ink">
              View Site ↗
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded border border-line bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Enterprise Overview</div>
            <h1 className="serif mt-2 text-4xl">Good morning.</h1>
            <p className="mt-2 text-sm text-muted">
              Global Product Hub administration, content curation, and monetization control.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, value, note, icon: Icon }) => (
            <div key={title} className="rounded bg-white p-5 shadow-soft border border-line">
              <Icon size={19} className="text-accent" />
              <div className="mt-5 text-xs text-muted">{title}</div>
              <div className="mt-1 text-3xl font-semibold">{value}</div>
              <div className="mt-2 text-[10px] text-muted">{note}</div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <section className="bg-white p-6 shadow-soft border border-line rounded">
            <h2 className="font-semibold text-sm tracking-wide uppercase text-ink">
              Management Modules
            </h2>
            <div className="mt-4 divide-y divide-line">
              {modules.map(({ name, desc, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className="flex items-center justify-between gap-4 py-4 group hover:bg-[#faf9f6] px-2 rounded transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded p-2 bg-[#f4f3ef] text-accent group-hover:bg-accent group-hover:text-white transition">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold group-hover:text-accent transition">
                        {name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted">{desc}</div>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  />
                </Link>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="bg-[#17212b] p-6 text-white rounded shadow-soft">
              <Settings2 size={22} className="text-[#c58b69]" />
              <h2 className="serif mt-5 text-2xl">Security & Compliance</h2>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-white/65">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Strict server-side session cookie verification.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Role-based access check against admin allowlist.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Outbound click logging with HTTPS destination validation.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>Smart Link adapter disabled by default.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded border border-line shadow-soft">
              <div className="text-xs font-bold uppercase tracking-wider text-muted">
                System Status
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Database:</span>
                  <span className="font-semibold text-ink">Cloud Firestore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Auth:</span>
                  <span className="font-semibold text-ink">Firebase Auth + RBAC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Storage:</span>
                  <span className="font-semibold text-ink">Firebase Storage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Hosting:</span>
                  <span className="font-semibold text-emerald-600">Vercel Edge</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
