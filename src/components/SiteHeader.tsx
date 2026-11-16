import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="bg-[#f7f7f4]/95 border-b border-line">
      <div className="container flex items-center justify-between gap-5 py-5">
        <Link href="/" className="min-w-0">
          <div className="text-[17px] font-bold tracking-[-.04em]">GLOBAL<span className="text-accent">.</span></div>
          <div className="text-[9px] tracking-[.22em] text-muted">PRODUCT HUB</div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="nav-link" href="/#discover">Discover</Link>
          <Link className="nav-link" href="/#categories">Categories</Link>
          <Link className="nav-link" href="/#about">Our approach</Link>
        </nav>
        <Link href="/#discover" className="flex items-center gap-2 text-xs font-semibold tracking-wide">
          <Search size={15}/> <span className="hidden sm:inline">EXPLORE FINDS</span><ArrowUpRight size={14}/>
        </Link>
      </div>
    </header>
  );
}
