"use client";

import { useEffect, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { DbAdSlot } from "@/types/database";

export default function AdSlot({
  slug,
  className = "",
}: {
  slug: "header" | "homepage" | "product_page" | "sidebar" | "related_products" | "footer";
  className?: string;
}) {
  const [slot, setSlot] = useState<DbAdSlot | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check consent in localStorage
    try {
      const consent = localStorage.getItem("gph_consent");
      if (consent) {
        const parsed = JSON.parse(consent);
        setHasConsent(Boolean(parsed.marketing));
      }
    } catch {}

    // Fetch slot config
    fetch("/api/ads")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.slots) {
          const matched = d.slots.find((s: DbAdSlot) => s.slug === slug);
          setSlot(matched || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, [slug]);

  if (!loaded || !slot || !slot.active) {
    return null; // Stay clean and quiet when slot is inactive
  }

  // If consent is required by law/config and user has not given marketing consent
  if (slot.requireConsent && !hasConsent) {
    return null;
  }

  return (
    <div className={`my-6 rounded border border-dashed border-[#d8dcd8] bg-[#fbfbf9] p-4 text-center ${className}`}>
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[.18em] text-muted pb-2 border-b border-[#ecebe6]">
        <span className="flex items-center gap-1 font-semibold">
          <Info size={11} /> Advertisement / Sponsored Slot
        </span>
        <span>{slot.format}</span>
      </div>

      <div className="py-4">
        {slot.htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: slot.htmlContent }} />
        ) : (
          <div className="mx-auto max-w-md py-4 text-xs text-muted">
            <span className="font-semibold text-ink">Approved Editorial Partner Space</span>
            <p className="mt-1 text-[11px] text-muted">
              Display inventory reserved for vetted design and commerce brands. Separated from product rankings.
            </p>
          </div>
        )}
      </div>

      <div className="text-[9px] text-neutral-400 text-right pt-1">
        Audited for compliance · No deceptive redirects
      </div>
    </div>
  );
}
