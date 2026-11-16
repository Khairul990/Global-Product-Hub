import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/products";

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  return (
    <>
      <SiteHeader />
      <main>
        <section className="container grid gap-10 py-14 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-24">
          <div>
            <div className="eyebrow flex items-center gap-2"><span className="h-px w-7 bg-accent"/> THE GLOBAL EDIT</div>
            <h1 className="serif mt-6 max-w-[650px] text-[48px] leading-[.99] sm:text-[64px] md:text-[76px]">Good finds.<br/><i className="font-normal text-accent">Well considered.</i></h1>
            <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-muted">A curated place to discover useful products, thoughtful design and offers from retailers around the world.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#discover" className="btn-primary">Explore products <ArrowUpRight size={15} className="ml-3"/></Link>
              <Link href="#about" className="btn-secondary">How it works</Link>
            </div>
            <div className="mt-12 flex items-center gap-7 border-t border-line pt-5 text-[10px] uppercase tracking-[.12em] text-muted">
              <span className="flex items-center gap-2"><Globe2 size={14}/> Global discovery</span>
              <span className="flex items-center gap-2"><ShieldCheck size={14}/> Clear disclosures</span>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-[#e8e3d9] p-7 sm:min-h-[470px]">
            <div className="absolute inset-0 opacity-70" style={{background:"radial-gradient(circle at 70% 35%,#f8f4ec 0,transparent 32%),linear-gradient(145deg,#d4c5b3,#eee9df 55%,#c6c8b8)"}}/>
            <div className="relative flex h-full min-h-[310px] flex-col justify-between sm:min-h-[420px]">
              <div className="flex justify-between text-[10px] uppercase tracking-[.16em] text-ink/60"><span>Vol. 01 / Objects</span><span>Est. 2026</span></div>
              <div className="mx-auto grid h-48 w-48 place-items-center rounded-full border border-ink/15 bg-white/20 shadow-soft sm:h-60 sm:w-60">
                <div className="grid h-36 w-36 place-items-center rounded-full border border-ink/20 bg-[#e9e0d4] text-6xl text-ink/70 sm:h-44 sm:w-44">✳</div>
              </div>
              <div className="flex items-end justify-between">
                <div><div className="eyebrow">A better way to browse</div><div className="serif mt-2 text-3xl">The useful edit.</div></div>
                <Sparkles size={22} className="mb-1 text-accent"/>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="border-y border-line bg-white">
          <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
            <span className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">Browse by category</span>
            <div className="flex flex-wrap gap-x-6 gap-y-3">{categories.filter(c=>c!=="All").map(c=><Link key={c} href={`/?category=${c}#discover`} className="text-xs text-ink/75 hover:text-accent">{c}</Link>)}</div>
          </div>
        </section>

        <section id="discover" className="container py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><div className="eyebrow">A considered collection</div><h2 className="serif mt-3 text-4xl sm:text-5xl">Featured finds</h2></div>
            <p className="max-w-[300px] text-sm leading-6 text-muted">A starting edit of useful things across everyday categories. New discoveries will be added regularly.</p>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{featured.map(p=><ProductCard key={p.id} product={p}/>)}</div>
          <div className="mt-12 border-t border-line pt-7 text-center"><span className="text-xs text-muted">More categories and products are coming to the collection.</span></div>
        </section>

        <section id="about" className="bg-[#ecebe5] py-16 md:py-20">
          <div className="container grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1"><div className="eyebrow">Our approach</div><h2 className="serif mt-3 text-4xl">Browse with<br/><i className="font-normal text-accent">more clarity.</i></h2></div>
            <div className="grid gap-8 sm:grid-cols-2 md:col-span-2">
              <div><div className="mb-4 text-accent"><Globe2 size={23}/></div><h3 className="font-semibold">A world of options</h3><p className="mt-2 text-sm leading-6 text-muted">Discover products across categories, with merchant and regional availability details.</p></div>
              <div><div className="mb-4 text-accent"><ShieldCheck size={23}/></div><h3 className="font-semibold">Transparent links</h3><p className="mt-2 text-sm leading-6 text-muted">Some links may be affiliate links. If you buy through them, the site may earn a commission at no extra cost to you.</p></div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#17212b] py-10 text-white">
        <div className="container flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><div className="text-lg font-bold tracking-[-.04em]">GLOBAL<span className="text-[#c58b69]">.</span></div><div className="mt-1 text-[9px] tracking-[.22em] text-white/50">PRODUCT HUB</div><p className="mt-4 max-w-sm text-xs leading-5 text-white/55">Thoughtful finds, better choices. Product details and prices should always be confirmed with the retailer.</p></div>
          <div className="flex flex-wrap gap-5 text-xs text-white/65"><Link href="/privacy">Privacy</Link><Link href="/affiliate-disclosure">Affiliate disclosure</Link><Link href="/terms">Terms</Link><Link href="/admin">Admin</Link></div>
        </div>
        <div className="container mt-8 border-t border-white/15 pt-5 text-[10px] text-white/40">© {new Date().getFullYear()} Global Product Hub. All rights reserved.</div>
      </footer>
    </>
  );
}
