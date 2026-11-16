"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, AlertCircle, CheckCircle2, Sparkles, ShieldAlert } from "lucide-react";
import { DbProduct, DbCategory, DbMerchant } from "@/types/database";

const AVAILABLE_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
];

const ACCENTS = ["sand", "clay", "olive", "blue", "plum", "rose"];
const SYMBOLS = ["✳", "♫", "▱", "◉", "◌", "▤", "✦", "❖"];

export default function ProductForm({
  initialData,
  categories,
  merchants,
}: {
  initialData?: DbProduct;
  categories: DbCategory[];
  merchants: DbMerchant[];
}) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [label, setLabel] = useState(initialData?.label || "Editor's pick");
  const [category, setCategory] = useState(initialData?.category || categories[0]?.name || "Electronics");
  const [merchant, setMerchant] = useState(initialData?.merchant || merchants[0]?.name || "Example Merchant");
  const [price, setPrice] = useState<number | string>(initialData?.price ?? 49);
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(initialData?.compareAtPrice ?? "");
  const [currency, setCurrency] = useState(initialData?.currency || "USD");
  const [description, setDescription] = useState(initialData?.description || "");
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliateUrl || "");
  const [accent, setAccent] = useState(initialData?.accent || "sand");
  const [symbol, setSymbol] = useState(initialData?.symbol || "✳");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [countries, setCountries] = useState<string[]>(initialData?.countryAvailability || ["US", "GB", "CA", "AU"]);
  const [published, setPublished] = useState(initialData ? initialData.published : true);
  const [featured, setFeatured] = useState(initialData ? initialData.featured : false);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  // Discount calculation
  const numPrice = Number(price);
  const numCompare = Number(compareAtPrice);
  const hasDiscount = numCompare > 0 && numCompare > numPrice;
  const discountPercent = hasDiscount ? Math.round((1 - numPrice / numCompare) * 100) : null;

  // Handle Country Toggle
  const toggleCountry = (code: string) => {
    if (countries.includes(code)) {
      setCountries(countries.filter((c) => c !== code));
    } else {
      setCountries([...countries, code]);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate HTTPS for affiliateUrl if provided
    if (affiliateUrl.trim()) {
      try {
        const parsed = new URL(affiliateUrl.trim());
        if (parsed.protocol !== "https:") {
          throw new Error("Affiliate URL must use HTTPS protocol (https://...)");
        }
      } catch (err: any) {
        setError(err?.message || "Invalid affiliate URL format");
        setLoading(false);
        return;
      }
    }

    if (countries.length === 0) {
      setError("Please select at least one available country.");
      setLoading(false);
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      label: label.trim(),
      category,
      merchant,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      currency,
      description: description.trim(),
      affiliateUrl: affiliateUrl.trim() ? affiliateUrl.trim() : null,
      accent,
      symbol,
      imageUrl: imageUrl.trim() || undefined,
      countryAvailability: countries,
      published,
      featured,
    };

    try {
      const endpoint = isEditing ? `/api/products/${initialData!.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {error && (
        <div className="flex items-start gap-3 rounded bg-red-50 p-4 text-xs text-red-700 border border-red-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <div>{error}</div>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 shadow-soft rounded border border-line">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">1. Basic Information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-ink">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Studio Wireless Headphones"
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. studio-wireless-headphones"
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm font-mono focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Editorial Badge / Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Editor's pick, Daily essential"
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm bg-white focus:border-ink focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-semibold text-ink">Editorial Description *</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A considered description detailing materials, design profile, and retailer confirmation guidance."
            className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {/* Pricing & Commercials */}
      <div className="bg-white p-6 shadow-soft rounded border border-line">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">2. Pricing & Commercials</h2>
        
        <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-3 rounded border border-amber-200 flex items-start gap-2">
          <ShieldAlert size={15} className="shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Editorial Rule:</strong> Never invent discounts or compare-at prices. Only record verified retailer list prices.
          </span>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-ink">Current Verified Price *</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Compare-At / List Price (Optional)</label>
            <input
              type="number"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="Leave blank if no discount"
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm bg-white focus:border-ink focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        {discountPercent !== null && (
          <div className="mt-4 rounded bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Calculated Verified Discount: <strong>{discountPercent}% OFF</strong></span>
          </div>
        )}
      </div>

      {/* Retailer & Affiliate Link */}
      <div className="bg-white p-6 shadow-soft rounded border border-line">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">3. Merchant & Affiliate Route</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-ink">Merchant / Retailer Name *</label>
            <select
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm bg-white focus:border-ink focus:outline-none"
            >
              {merchants.map((m) => (
                <option key={m.id} value={m.name}>{m.name} ({m.network})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">
              Verified Affiliate Destination URL (HTTPS only)
            </label>
            <input
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://merchant.com/item?aff_id=..."
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm font-mono focus:border-ink focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-muted">
              If left blank, `/go/{slug}` will return HTTP 503 guard to prevent broken redirects.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-semibold text-ink">Available Countries *</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_COUNTRIES.map(({ code, name }) => {
              const selected = countries.includes(code);
              return (
                <button
                  type="button"
                  key={code}
                  onClick={() => toggleCountry(code)}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition ${
                    selected
                      ? "border-accent bg-accent/10 text-accent font-semibold"
                      : "border-line bg-white text-muted hover:border-ink"
                  }`}
                >
                  {name} ({code})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Media & Artwork */}
      <div className="bg-white p-6 shadow-soft rounded border border-line">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">4. Visuals & Media</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-ink">Upload Product Image</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="text-xs text-muted file:mr-3 file:rounded file:border-0 file:bg-[#17212b] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-accent"
              />
              {uploading && <span className="text-xs text-muted">Uploading...</span>}
            </div>
            {imageUrl && (
              <div className="mt-3">
                <span className="text-[10px] text-muted">Active Image URL:</span>
                <p className="text-xs font-mono text-ink truncate max-w-sm">{imageUrl}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Editorial Abstract Visual Fallback</label>
            <div className="mt-2 flex items-center gap-4">
              <div>
                <span className="text-[10px] text-muted block mb-1">Accent:</span>
                <div className="flex gap-1.5">
                  {ACCENTS.map((acc) => (
                    <button
                      type="button"
                      key={acc}
                      onClick={() => setAccent(acc)}
                      className={`h-6 w-6 rounded border ${
                        accent === acc ? "ring-2 ring-accent" : "border-line"
                      } art-${acc}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-muted block mb-1">Symbol:</span>
                <div className="flex gap-1.5">
                  {SYMBOLS.map((sym) => (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => setSymbol(sym)}
                      className={`h-6 w-6 rounded border text-xs font-serif flex items-center justify-center ${
                        symbol === sym ? "bg-accent text-white" : "border-line bg-white"
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Controls */}
      <div className="bg-white p-6 shadow-soft rounded border border-line flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-line text-ink focus:ring-ink"
            />
            <span className="text-xs font-semibold text-ink">Published Live on Site</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-line text-ink focus:ring-ink"
            />
            <span className="text-xs font-semibold text-ink">Feature on Homepage</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn-secondary !py-2.5 !px-4 text-xs">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"
          >
            <Save size={14} />
            {loading ? "Saving..." : isEditing ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
