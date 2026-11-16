"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { DbSiteSettings } from "@/types/database";

export default function SettingsForm({ initialSettings }: { initialSettings: DbSiteSettings }) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(initialSettings.siteName);
  const [tagline, setTagline] = useState(initialSettings.tagline);
  const [defaultCurrency, setDefaultCurrency] = useState(initialSettings.defaultCurrency);
  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail);
  const [privacyEmail, setPrivacyEmail] = useState(initialSettings.privacyEmail);
  const [affiliateDisclosureText, setAffiliateDisclosureText] = useState(initialSettings.affiliateDisclosureText);
  const [enableConsentBanner, setEnableConsentBanner] = useState(initialSettings.enableConsentBanner);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim(),
          tagline: tagline.trim(),
          defaultCurrency,
          contactEmail: contactEmail.trim(),
          privacyEmail: privacyEmail.trim(),
          affiliateDisclosureText: affiliateDisclosureText.trim(),
          enableConsentBanner,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded bg-emerald-50 p-4 text-xs text-emerald-800 border border-emerald-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Platform settings updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-4 text-xs text-red-800 border border-red-200">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand Identity */}
      <div className="bg-white p-6 rounded shadow-soft border border-line">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">1. Brand Identity & Currency</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-ink">Site Name</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Tagline</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Default Platform Currency</label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm bg-white focus:border-ink focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">Public Inquiries Email</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Regulatory & Disclosure */}
      <div className="bg-white p-6 rounded shadow-soft border border-line">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">2. Legal Disclosures & Consent</h2>
        
        <div className="mt-5">
          <label className="block text-xs font-semibold text-ink">Affiliate Disclosure Statement</label>
          <textarea
            rows={3}
            required
            value={affiliateDisclosureText}
            onChange={(e) => setAffiliateDisclosureText(e.target.value)}
            className="mt-1 w-full rounded border border-line px-3 py-2 text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-muted">Displayed on product detail pages and footer.</p>
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableConsentBanner}
              onChange={(e) => setEnableConsentBanner(e.target.checked)}
              className="h-4 w-4 rounded border-line text-ink focus:ring-ink"
            />
            <span className="text-xs font-semibold text-ink">
              Enable GDPR / Global Privacy Consent Banner for Non-Essential Tags
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary !py-2.5 !px-6 text-xs flex items-center gap-2"
        >
          <Save size={14} />
          {loading ? "Saving..." : "Save Platform Settings"}
        </button>
      </div>
    </form>
  );
}
