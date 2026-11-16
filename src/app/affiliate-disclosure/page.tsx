import Link from "next/link";
import { ArrowLeft, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function AffiliateDisclosurePage() {
  return (
    <>
      <SiteHeader />
      <main className="container max-w-3xl py-14">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
          <ArrowLeft size={14} /> Back to the edit
        </Link>

        <div className="eyebrow mt-8">FTC & Consumer Transparency</div>
        <h1 className="serif mt-3 text-4xl sm:text-5xl">Affiliate Disclosure</h1>
        <p className="mt-2 text-xs text-muted">In compliance with FTC 16 CFR § 255 and International Standards</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#2c3742] border-t border-line pt-8">
          <section>
            <h2 className="font-bold text-base text-ink">1. How We Monitize</h2>
            <p className="mt-2">
              Global Product Hub is an independently operated editorial discovery publication. To fund our research, technical infrastructure, and curation work, we partner with affiliate networks and trusted merchants.
            </p>
            <p className="mt-2">
              When you click on certain links designated as &quot;View at retailer&quot; or BUY NOW and subsequently make a purchase on the seller&apos;s website, we may earn an affiliate commission.
            </p>
          </section>

          <section className="rounded bg-[#f7f7f4] p-5 border border-line">
            <div className="flex items-center gap-2 font-semibold text-ink text-sm">
              <CheckCircle2 size={16} className="text-emerald-600" /> Three Core Editorial Guarantees
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
              <li>• <strong>No Added Cost to You:</strong> You never pay a penny more. Retailer commissions are paid out of merchant marketing budgets.</li>
              <li>• <strong>Uncompromised Curation:</strong> Products are chosen because they represent thoughtful design and utility, not because of commission rates.</li>
              <li>• <strong>No Fabricated Urgency:</strong> We never display fake discounts, artificial countdown timers, or unverified claims.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">2. Amazon Associates Disclosure</h2>
            <p className="mt-2">
              Global Product Hub may participate in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated international properties.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">3. Verified Tracking Architecture</h2>
            <p className="mt-2">
              All affiliate outbound routing occurs transparently through our secure <code>/go/[slug]</code> tracking router. Every target destination is strictly HTTPS-validated and monitored against approved retailer allowlists.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
