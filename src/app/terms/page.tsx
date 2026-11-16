import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container max-w-3xl py-14">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
          <ArrowLeft size={14} /> Back to the edit
        </Link>

        <div className="eyebrow mt-8">Terms of Service</div>
        <h1 className="serif mt-3 text-4xl sm:text-5xl">Terms & Conditions</h1>
        <p className="mt-2 text-xs text-muted">Last updated: November 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#2c3742] border-t border-line pt-8">
          <section>
            <h2 className="font-bold text-base text-ink">1. Platform Purpose & Editorial Independence</h2>
            <p className="mt-2">
              Global Product Hub provides curated product discovery, editorial commentary, and direct retailer referral links. We are not a seller, broker, or manufacturer of the products showcased. All transactions take place directly on third-party merchant platforms.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">2. Pricing & Merchant Availability Disclaimer</h2>
            <p className="mt-2">
              While our editorial staff reviews prices and product availability regularly, retailer prices, promotions, shipping fees, import tariffs, and product specifications change dynamically.
            </p>
            <div className="mt-3 rounded bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Price Accuracy Notice:</strong> You must always confirm the current price, shipping policy, return conditions, and item specifications directly on the seller&apos;s website before completing any purchase. Global Product Hub is not liable for price discrepancies between our editorial listing and the retailer&apos;s final checkout page.
            </div>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">3. Affiliate Relationship & Disclosures</h2>
            <p className="mt-2">
              We participate in affiliate marketing programs. When you follow an outbound link and make a qualifying purchase, we may receive compensation. This editorial arrangement does not alter the price you pay and never influences our product selection standards. See our full{" "}
              <Link href="/affiliate-disclosure" className="text-accent underline">
                Affiliate Disclosure
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">4. Intellectual Property</h2>
            <p className="mt-2">
              All editorial compositions, reviews, design layouts, and brand trademarks on this website are the property of Global Product Hub. Third-party brand names, retailer logos, and trademarks are the property of their respective owners and used solely for identification purposes.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">5. Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by applicable law, Global Product Hub and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of this site or any goods purchased from third-party retailers.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
