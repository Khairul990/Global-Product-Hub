import { MetadataRoute } from "next";
import { dbService } from "@/lib/db/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://global-product-hub.vercel.app";
  const products = await dbService.getProducts({ publishedOnly: true });

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...staticRoutes, ...productRoutes];
}
