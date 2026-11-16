import type { Metadata } from "next";
import "./globals.css";
import ConsentBanner from "@/components/consent/ConsentBanner";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://producthub-rho.vercel.app";
const safeSiteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: {
    default: "Global Product Hub — Good Finds. Well Considered.",
    template: "%s | Global Product Hub",
  },
  description: "Discover considered products, useful finds and verified offers from retailers around the world.",
  metadataBase: new URL(safeSiteUrl),
  openGraph: {
    title: "Global Product Hub",
    description: "Good Finds. Well Considered.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
