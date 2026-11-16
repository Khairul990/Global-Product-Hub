import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Global Product Hub — Thoughtful finds, better choices",
    template: "%s | Global Product Hub",
  },
  description: "Discover considered products, useful finds and offers from merchants around the world.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://global-product-hub.vercel.app"),
  openGraph: {
    title: "Global Product Hub",
    description: "Thoughtful finds, better choices.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
