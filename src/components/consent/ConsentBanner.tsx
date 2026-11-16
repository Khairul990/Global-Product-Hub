"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Check } from "lucide-react";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gph_consent");
      if (!stored) {
        setVisible(true);
      }
    } catch {}
  }, []);

  const saveConsent = async (marketing: boolean) => {
    const visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const payload = {
      visitorId,
      consentGiven: marketing,
      categories: {
        analytics: true,
        marketing,
      },
    };

    try {
      localStorage.setItem("gph_consent", JSON.stringify(payload.categories));
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#17212b] text-white p-4 md:p-5 border-t border-white/10 shadow-soft">
      <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c58b69]">
            <ShieldCheck size={15} /> Privacy & Editorial Transparency
          </div>
          <p className="mt-1 text-xs leading-relaxed text-white/75">
            We use essential cookies to maintain platform performance and anonymous outbound affiliate click counts. With your permission, we may also load consent-managed partner placements. Read our{" "}
            <Link href="/privacy" className="text-white underline hover:text-[#c58b69]">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/affiliate-disclosure" className="text-white underline hover:text-[#c58b69]">
              Affiliate Disclosure
            </Link>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => saveConsent(false)}
            className="rounded border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
          >
            Essential Only
          </button>
          <button
            onClick={() => saveConsent(true)}
            className="btn-primary !bg-[#c58b69] !text-ink !py-2 !px-4 text-xs hover:!bg-white transition"
          >
            Accept Considered Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
