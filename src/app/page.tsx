import Link from "next/link";
import { ArrowUpRight, Globe2, ShieldCheck, Sparkles, Search, Filter } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import AdSlot from "@/components/ads/AdSlot";
import { dbService } from "@/lib/db/service";

export default async function HomePage(props: {
  searchParams?: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedSearchParams = props.searchParams ? await props.searchParams : undefined;
  const category = resolvedSearchParams?.category;
  const q = resolvedSearchParams?.q;

  const categories = await dbService.getCategories();
  const allProducts = await dbService.getProducts({
    category: category && category !== "All" ? category : undefined,
    search: q,
    publishedOnly: true,
  });

  const featured = allProducts.filter((p) => p.featured);
  const displayList = category || q ? allProducts : (featured.length > 0 ? featured : allProducts);

  return (
    <>
      <SiteHeader />

      {/* Header Ad Slot (Consent-Aware) */}
      <div className="container">
        <AdSlot slug="header" className="!my-3" />
      </div>

      <main>
        {/* Editorial Hero */}
        <section className="container grid gap-10 py-12 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-20">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <span className="h-px w-7 bg-accent" /> THE GLOBAL EDIT
            </div>
            <h1 className="serif mt-6 max-w-[650px] text-[46px] leading-[.99] sm:text-[62px] md:text-[74px] text-ink">
              Good finds.<br />
              <i className="font-normal text-accent">Well considered.</i>
            </h1>
            <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-muted">
              A curated platform to discover useful products, thoughtful craftsmanship, and verified offers from retailers worldwide.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#discover" className="btn-primary">
                Explore products <ArrowUpRight size={15} className="ml-2" />
              </Link>
              <Link href="#about" className="btn-secondary">
                Our approach
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-7 border-t border-line pt-5 text-[10px] uppercase tracking-[.12em] text-muted">
              <span className="flex items-center gap-2">
                <Globe2 size={14} /> Global discovery
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} /> Verified retail links
              </span>
            </div>
          </div>

          {/* Abstract Editorial Art */}
          <div className="relative min-h-[350px] overflow-hidden bg-[#e8e3d9] p-7 sm:min-h-[460px] rounded">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 70% 35%,#f8f4ec 0,transparent 32%),linear-gradient(145deg,#d4c5b3,#eee9df 55%,#c6c8b8)",
              }}
            />
            <div className="relative flex h-full min-h-[300px] flex-col justify-between sm:min-h-[400px]">
              <div className="flex justify-between text-[10px] uppercase tracking-[.16em] text-ink/60">
                <span>Vol. 01 / Considered Objects</span>
                <span>Est. 2026</span>
              </div>
              <div className="mx-auto grid h-48 w-48 place-items-center rounded-full border border-ink/15 bg-white/20 shadow-soft sm:h-56 sm:w-56">
                <div className="grid h-36 w-36 place-items-center rounded-full border border-ink/20 bg-[#e9e0d4] text-6xl text-ink/70 sm:h-40 sm:w-40 font-serif">
                  ✳
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="eyebrow">A better way to browse</div>
                  <div className="serif mt-1 text-2xl sm:text-3xl">The useful edit.</div>
                </div>
                <Sparkles size={20} className="mb-1 text-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section id="categories" className="border-y border-line bg-white sticky top-16 z-30">
          <div className="container flex flex-wrap items-center justify-between gap-4 py-3.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted">
              <Filter size={12} className="text-accent" /> Categories
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/#discover"
                className={`text-xs transition ${
                  !category || category === "All"
                    ? "font-bold text-accent border-b-2 border-accent pb-0.5"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                All
              </Link>
              {categories.map((c) => {
                const isSelected = category?.toLowerCase() === c.name.toLowerCase();
                return (
                  <Link
                    key={c.id}
                    href={`/?category=${encodeURIComponent(c.name)}#discover`}
                    className={`text-xs transition ${
                      isSelected
                        ? "font-bold text-accent border-b-2 border-accent pb-0.5"
                        : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mid-Homepage Ad Slot */}
        <div className="container">
          <AdSlot slug="homepage" />
        </div>

        {/* Discover Product Grid */}
        <section id="discover" className="container py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="eyebrow">
                {q ? `Search results for "${q}"` : category ? `Category: ${category}` : "A considered collection"}
              </div>
              <h2 className="serif mt-2 text-3xl sm:text-4xl">
                {q ? `Found Objects (${displayList.length})` : category ? `${category} Finds` : "Featured finds"}
              </h2>
            </div>
            <p className="max-w-[320px] text-xs leading-6 text-muted">
              Curated everyday goods from vetted retailers. Prices and availability are verified periodically.
            </p>
          </div>

          {displayList.length === 0 ? (
            <div className="mt-12 rounded bg-white p-12 text-center border border-line">
              <Search size={28} className="mx-auto text-muted mb-3" />
              <div className="font-semibold text-ink text-base">No matching objects found</div>
              <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                Try searching for a different keyword or browsing across all categories.
              </p>
              <Link href="/#discover" className="btn-secondary mt-5 inline-block !py-2 !px-4 text-xs">
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {displayList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Our Approach Section */}
        <section id="about" className="bg-[#ecebe5] py-16 md:py-20">
          <div className="container grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="eyebrow">Our approach</div>
              <h2 className="serif mt-3 text-3xl sm:text-4xl">
                Browse with<br />
                <i className="font-normal text-accent">more clarity.</i>
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:col-span-2">
              <div>
                <div className="mb-3 text-accent">
                  <Globe2 size={22} />
                </div>
                <h3 className="font-semibold text-sm">International Options</h3>
                <p className="mt-2 text-xs leading-6 text-muted">
                  Discover products across trusted global merchants with clear country availability flags and verified shipping destinations.
                </p>
              </div>
              <div>
                <div className="mb-3 text-accent">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-semibold text-sm">Transparent Links</h3>
                <p className="mt-2 text-xs leading-6 text-muted">
                  Some links are affiliate links. If you buy through them, we may earn a commission with zero added cost to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Ad Slot */}
        <div className="container">
          <AdSlot slug="footer" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#17212b] py-12 text-white">
        <div className="container flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <div className="text-xl font-bold tracking-[-.04em]">
              GLOBAL<span className="text-[#c58b69]">.</span>
            </div>
            <div className="mt-1 text-[9px] tracking-[.22em] text-white/50 font-bold">
              PRODUCT HUB
            </div>
            <p className="mt-4 max-w-sm text-xs leading-5 text-white/60">
              Good Finds. Well Considered. All product specifications, list prices, and shipping conditions must be confirmed with the merchant.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-white/70">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/affiliate-disclosure" className="hover:text-white transition">Affiliate Disclosure</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/admin" className="hover:text-[#c58b69] transition">Control Room</Link>
          </div>
        </div>

        <div className="container mt-8 border-t border-white/10 pt-5 text-[10px] text-white/40 flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Global Product Hub. All rights reserved.</span>
          <span>Designed with considered typography and mobile-first principles.</span>
        </div>
      </footer>
    </>
  );
}
