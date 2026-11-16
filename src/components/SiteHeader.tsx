"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Globe2, Menu, X, ShieldCheck } from "lucide-react";

const COUNTRIES = [
  { code: "US", label: "US ($)" },
  { code: "GB", label: "UK (£)" },
  { code: "CA", label: "CA ($)" },
  { code: "AU", label: "AU ($)" },
  { code: "IN", label: "IN (₹)" },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-[#f7f7f4]/95 backdrop-blur border-b border-line">
      <div className="container flex items-center justify-between gap-5 py-4">
        {/* Brand Logo */}
        <Link href="/" className="min-w-0 flex items-baseline gap-1">
          <div className="text-[19px] font-bold tracking-[-.04em]">
            GLOBAL<span className="text-accent">.</span>
          </div>
          <div className="text-[9px] tracking-[.24em] text-muted font-bold">PRODUCT HUB</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link className="nav-link text-xs font-medium" href="/#discover">
            Discover
          </Link>
          <Link className="nav-link text-xs font-medium" href="/#categories">
            Categories
          </Link>
          <Link className="nav-link text-xs font-medium" href="/#about">
            Our Approach
          </Link>
          <Link className="nav-link text-xs font-medium text-accent" href="/affiliate-disclosure">
            Disclosure
          </Link>
        </nav>

        {/* Actions: Country Selector + Search Toggle + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Country Selector */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-ink bg-white px-2.5 py-1.5 rounded border border-line">
            <Globe2 size={13} className="text-accent" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wide bg-white px-3 py-1.5 rounded border border-line hover:border-ink transition"
          >
            <Search size={14} className="text-muted" />
            <span className="hidden sm:inline">EXPLORE</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-ink hover:text-accent"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="border-t border-line bg-white p-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="container max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}#discover`;
                }
              }}
              className="flex items-center gap-2"
            >
              <Search size={16} className="text-muted shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search considered objects, audio, bags, lighting, routine..."
                className="w-full text-sm py-1.5 focus:outline-none"
              />
              <button type="submit" className="btn-primary !py-1.5 !px-3 text-xs">
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-[#f7f7f4] px-5 py-6 space-y-4">
          <Link
            href="/#discover"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-ink"
          >
            Discover Finds
          </Link>
          <Link
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-ink"
          >
            Categories
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-ink"
          >
            Our Approach
          </Link>
          <Link
            href="/affiliate-disclosure"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-accent"
          >
            Affiliate Disclosure
          </Link>
          <div className="pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
            <Link href="/terms" onClick={() => setMobileMenuOpen(false)}>Terms</Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
