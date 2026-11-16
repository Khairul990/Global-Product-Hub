import { z } from "zod";

// 1. Products
export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string().min(2),
  name: z.string().min(2),
  category: z.string(),
  categoryId: z.string().optional(),
  label: z.string().optional(),
  description: z.string(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  merchant: z.string(),
  merchantId: z.string().optional(),
  countryAvailability: z.array(z.string().length(2)).optional(),
  featured: z.boolean().optional(),
  accent: z.string().optional(),
  symbol: z.string().optional(),
  imageUrl: z.string().url().optional(),
  affiliateUrl: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type DbProduct = z.infer<typeof ProductSchema> & {
  label: string;
  currency: string;
  countryAvailability: string[];
  featured: boolean;
  accent: string;
  symbol: string;
  affiliateUrl: string | null;
  published: boolean;
};

// 2. Categories
export const CategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
  active: z.boolean().default(true),
  createdAt: z.string(),
});
export type DbCategory = z.infer<typeof CategorySchema>;

// 3. Merchants
export const MerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  website: z.string().url(),
  primaryDomain: z.string(),
  network: z.string().default("Direct / Network"),
  active: z.boolean().default(true),
  commissionRate: z.string().optional(),
  createdAt: z.string(),
});
export type DbMerchant = z.infer<typeof MerchantSchema>;

// 4. Affiliate Links
export const AffiliateLinkSchema = z.object({
  id: z.string(),
  productId: z.string(),
  merchantId: z.string(),
  countryCode: z.string().length(2).default("US"),
  targetUrl: z.string().url(),
  active: z.boolean().default(true),
  verifiedAt: z.string().optional(),
  createdAt: z.string(),
});
export type DbAffiliateLink = z.infer<typeof AffiliateLinkSchema>;

// 5. Click Events (Outbound tracking)
export const ClickEventSchema = z.object({
  id: z.string(),
  clickId: z.string(),
  productId: z.string(),
  productSlug: z.string(),
  merchant: z.string(),
  country: z.string().default("GLOBAL"),
  campaign: z.string().optional(),
  referer: z.string().optional(),
  userAgent: z.string().optional(),
  ipHash: z.string().optional(),
  isBot: z.boolean().default(false),
  timestamp: z.string(),
});
export type DbClickEvent = z.infer<typeof ClickEventSchema>;

// 6. Conversions (Network imported reports)
export const ConversionSchema = z.object({
  id: z.string(),
  clickId: z.string().optional(),
  productId: z.string().optional(),
  merchant: z.string(),
  network: z.string(),
  orderAmount: z.number().optional(),
  commissionAmount: z.number(),
  currency: z.string().default("USD"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  eventDate: z.string(),
  importedAt: z.string(),
});
export type DbConversion = z.infer<typeof ConversionSchema>;

// 7. Ad Slots
export const AdSlotSchema = z.object({
  id: z.string(),
  slug: z.enum(["header", "homepage", "product_page", "sidebar", "related_products", "footer"]),
  name: z.string(),
  providerId: z.string().optional(),
  active: z.boolean().default(false),
  format: z.string().default("banner"),
  htmlContent: z.string().optional(),
  requireConsent: z.boolean().default(true),
  updatedAt: z.string(),
});
export type DbAdSlot = z.infer<typeof AdSlotSchema>;

// 8. Ad Providers
export const AdProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["direct", "approved_network", "house"]),
  active: z.boolean().default(false),
  scriptUrl: z.string().url().optional(),
  policyApproved: z.boolean().default(false),
  createdAt: z.string(),
});
export type DbAdProvider = z.infer<typeof AdProviderSchema>;

// 9. Smart Link Providers (Disabled by default in Version 1.0)
export const SmartLinkProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean().default(false), // Explicitly false by default
  countryEligibility: z.array(z.string()).default([]),
  trafficEligibility: z.array(z.string()).default([]),
  allowlistedDomains: z.array(z.string()).default([]),
  apiEndpoint: z.string().url().optional(),
  complianceAudited: z.boolean().default(false),
  createdAt: z.string(),
});
export type DbSmartLinkProvider = z.infer<typeof SmartLinkProviderSchema>;

// 10. Campaigns
export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  active: z.boolean().default(true),
  notes: z.string().optional(),
  createdAt: z.string(),
});
export type DbCampaign = z.infer<typeof CampaignSchema>;

// 11. Admin Users
export const AdminUserDocSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  role: z.enum(["superadmin", "admin", "editor"]),
  active: z.boolean().default(true),
  lastLoginAt: z.string().optional(),
  createdAt: z.string(),
});
export type DbAdminUser = z.infer<typeof AdminUserDocSchema>;

// 12. Site Settings
export const SiteSettingsSchema = z.object({
  siteName: z.string().default("Global Product Hub"),
  tagline: z.string().default("Good Finds. Well Considered."),
  defaultCurrency: z.string().default("USD"),
  contactEmail: z.string().default("contact@globalproducthub.com"),
  affiliateDisclosureText: z.string(),
  privacyEmail: z.string().default("privacy@globalproducthub.com"),
  enableConsentBanner: z.boolean().default(true),
  updatedAt: z.string(),
});
export type DbSiteSettings = z.infer<typeof SiteSettingsSchema>;

// 13. Consent Records
export const ConsentRecordSchema = z.object({
  id: z.string(),
  visitorId: z.string(),
  consentGiven: z.boolean(),
  categories: z.object({
    analytics: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
  country: z.string().optional(),
  timestamp: z.string(),
});
export type DbConsentRecord = z.infer<typeof ConsentRecordSchema>;

// 14. Audit Logs
export const AuditLogSchema = z.object({
  id: z.string(),
  action: z.string(),
  userId: z.string(),
  userEmail: z.string(),
  role: z.string(),
  details: z.record(z.string(), z.any()).optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string(),
});
export type DbAuditLog = z.infer<typeof AuditLogSchema>;
