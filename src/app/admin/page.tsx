import Link from "next/link";
import { ArrowUpRight, BarChart3, Boxes, ExternalLink, Link2, Megaphone, Settings2 } from "lucide-react";

const cards = [
  { title: "Products", value: "06", note: "Demo catalogue", icon: Boxes },
  { title: "Affiliate clicks", value: "—", note: "Connect tracking storage", icon: Link2 },
  { title: "Conversions", value: "—", note: "Import network reports", icon: BarChart3 },
  { title: "Ad placements", value: "06", note: "Slots planned", icon: Megaphone },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f2f3f0]">
      <header className="border-b border-line bg-white px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="font-bold tracking-tight">GLOBAL<span className="text-accent">.</span> / ADMIN</Link><Link href="/" className="text-xs text-muted">View website ↗</Link></div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Control room</div><h1 className="serif mt-2 text-4xl">Good morning.</h1><p className="mt-2 text-sm text-muted">Your product and monetization workspace.</p></div><span className="rounded-full bg-amber-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-800">Demo mode · Not secured</span></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({title,value,note,icon:Icon})=><div key={title} className="rounded bg-white p-5 shadow-soft"><Icon size={19} className="text-accent"/><div className="mt-5 text-xs text-muted">{title}</div><div className="mt-1 text-3xl font-semibold">{value}</div><div className="mt-2 text-[10px] text-muted">{note}</div></div>)}</div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <section className="bg-white p-6 shadow-soft"><h2 className="font-semibold">Management modules</h2><div className="mt-5 divide-y divide-line">{[["Product catalogue","Manage product information and publishing"],["Affiliate links","Add verified merchant destinations"],["Advertisement slots","Configure compliant display placements"],["Smart Link providers","Disabled until a provider is approved"],["Analytics","Connect click and conversion reporting"]].map(([a,b])=><div key={a} className="flex items-center justify-between gap-4 py-4"><div><div className="text-sm font-semibold">{a}</div><div className="mt-1 text-xs text-muted">{b}</div></div><ArrowUpRight size={16} className="text-muted"/></div>)}</div></section>
          <aside className="bg-[#17212b] p-6 text-white"><Settings2 size={22} className="text-[#c58b69]"/><h2 className="serif mt-5 text-2xl">Before launch</h2><ul className="mt-4 space-y-3 text-xs leading-5 text-white/65"><li>• Add Firebase authentication and server-side authorization.</li><li>• Replace sample products with verified merchant data.</li><li>• Configure affiliate URLs and click event storage.</li><li>• Publish privacy, terms and disclosure pages.</li><li>• Test network policies and regional restrictions.</li></ul></aside>
        </div>
        <p className="mt-8 text-xs leading-5 text-muted">This is a visual dashboard foundation only. Do not expose this route publicly as an operational admin panel until authentication, authorization and database-backed actions are implemented.</p>
      </div>
    </main>
  );
}
