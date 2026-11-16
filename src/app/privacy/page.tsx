import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="container max-w-3xl py-14">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
          <ArrowLeft size={14} /> Back to the edit
        </Link>

        <div className="eyebrow mt-8">Legal & Data Transparency</div>
        <h1 className="serif mt-3 text-4xl sm:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted">Last updated: November 2026 · Global Audience Edition</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#2c3742] border-t border-line pt-8">
          <section>
            <h2 className="font-bold text-base text-ink">1. Overview and Commitment</h2>
            <p className="mt-2">
              Global Product Hub (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates as a premium editorial product discovery platform. We are committed to protecting your privacy and providing transparent information about our data practices in full compliance with global standards, including the General Data Protection Regulation (GDPR), the UK Data Protection Act, and the California Consumer Privacy Act (CCPA/CPRA).
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">2. Information We Collect</h2>
            <p className="mt-2">
              We operate on a data minimization principle. We do not require account registration or collect sensitive personal data for public visitors. The only information processed includes:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Pseudonymized Outbound Click Data:</strong> When you click &quot;View at retailer&quot; or BUY NOW links, we generate an anonymous click identifier (e.g. <code>clk_...</code>) and record a cryptographically hashed IP address to verify routing without identifying you.</li>
              <li><strong>Technical Metadata:</strong> Browser type, coarse geographic region (country code derived at the edge), and referrer source for security and bot prevention.</li>
              <li><strong>Consent Preferences:</strong> Your choices regarding cookie categories, stored locally in your browser.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">3. Outbound Retailer Links & Affiliate Networks</h2>
            <p className="mt-2">
              When you click on an outbound retailer link, you are redirected to third-party merchant platforms (such as Amazon, ShareASale, CJ, or direct retailers). These third parties may set tracking cookies on their domain to credit qualifying purchases. Their privacy practices are governed by their respective privacy statements.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">4. Display Advertising & Consent</h2>
            <p className="mt-2">
              All advertisement placements on Global Product Hub are strictly consent-aware. We do not engage in cross-site tracking or deceptive cloaking. Marketing tags are loaded only when you provide explicit consent through our privacy banner.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">5. Your Privacy Rights</h2>
            <p className="mt-2">
              Depending on your location, you hold statutory rights including the right to access, rectify, or erase your data, or withdraw consent at any time. Because we do not store customer profiles or email accounts for public visitors, your primary control is managing browser cookies and resetting your consent preferences via our banner.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-ink">6. Contact & Data Protection Officer</h2>
            <p className="mt-2">
              For any questions regarding this Privacy Policy or our editorial data practices, contact us at:
            </p>
            <div className="mt-3 rounded bg-white p-4 border border-line text-xs font-mono">
              Email: privacy@globalproducthub.com<br />
              Platform: Global Product Hub Compliance Desk
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
