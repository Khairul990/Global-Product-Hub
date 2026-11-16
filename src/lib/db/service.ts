import { adminDb } from "@/lib/firebase/admin";
import {
  DbProduct,
  DbCategory,
  DbMerchant,
  DbClickEvent,
  DbAdSlot,
  DbSiteSettings,
  DbSmartLinkProvider,
  DbAuditLog,
} from "@/types/database";
import { products as initialSeedProducts, categories as initialSeedCategories } from "@/lib/products";

// Default seed data when database is in memory or cold start
let inMemoryProducts: DbProduct[] = initialSeedProducts.map((p) => ({
  ...p,
  label: p.label || "Editor's pick",
  currency: p.currency || "USD",
  countryAvailability: p.countryAvailability || ["US", "GB", "CA", "AU"],
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

let inMemoryCategories: DbCategory[] = initialSeedCategories
  .filter((c) => c !== "All")
  .map((name, idx) => ({
    id: `cat-${idx + 1}`,
    name,
    slug: name.toLowerCase(),
    order: idx + 1,
    active: true,
    createdAt: new Date().toISOString(),
  }));

let inMemoryMerchants: DbMerchant[] = [
  {
    id: "m-001",
    name: "Example Merchant",
    website: "https://example.com",
    primaryDomain: "example.com",
    network: "Direct",
    active: true,
    commissionRate: "5-10%",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-002",
    name: "Nordic Living Co.",
    website: "https://nordicliving.example",
    primaryDomain: "nordicliving.example",
    network: "ShareASale",
    active: true,
    commissionRate: "8%",
    createdAt: new Date().toISOString(),
  },
];

let inMemoryClickEvents: DbClickEvent[] = [];

let inMemoryAdSlots: DbAdSlot[] = [
  { id: "slot-header", slug: "header", name: "Header Top Banner", active: false, format: "728x90", requireConsent: true, updatedAt: new Date().toISOString() },
  { id: "slot-home", slug: "homepage", name: "Homepage Mid Banner", active: false, format: "970x250", requireConsent: true, updatedAt: new Date().toISOString() },
  { id: "slot-product", slug: "product_page", name: "Product Page Editorial Unit", active: false, format: "300x250", requireConsent: true, updatedAt: new Date().toISOString() },
  { id: "slot-sidebar", slug: "sidebar", name: "Sidebar Unit", active: false, format: "300x600", requireConsent: true, updatedAt: new Date().toISOString() },
  { id: "slot-related", slug: "related_products", name: "Between Related Finds", active: false, format: "fluid", requireConsent: true, updatedAt: new Date().toISOString() },
  { id: "slot-footer", slug: "footer", name: "Above Footer Banner", active: false, format: "728x90", requireConsent: true, updatedAt: new Date().toISOString() },
];

let inMemorySmartLinkProviders: DbSmartLinkProvider[] = [
  {
    id: "sl-001",
    name: "Global Commerce Smart Router",
    enabled: false, // EXPLICITLY DISABLED IN V1.0 PER SPEC
    countryEligibility: ["US", "GB", "CA"],
    trafficEligibility: ["direct", "search"],
    allowlistedDomains: ["amazon.com", "target.com", "bestbuy.com"],
    complianceAudited: true,
    createdAt: new Date().toISOString(),
  },
];

let inMemorySiteSettings: DbSiteSettings = {
  siteName: "Global Product Hub",
  tagline: "Good Finds. Well Considered.",
  defaultCurrency: "USD",
  contactEmail: "contact@globalproducthub.com",
  privacyEmail: "privacy@globalproducthub.com",
  affiliateDisclosureText:
    "Global Product Hub may use affiliate links. If you click an affiliate link and make a purchase, we may receive a commission at no additional cost to you. Pricing and availability are verified periodically but should always be confirmed with the retailer.",
  enableConsentBanner: true,
  updatedAt: new Date().toISOString(),
};

/* ====================================================================
   DATABASE REPOSITORY METHODS
   Seamlessly interacts with Cloud Firestore if initialized;
   Falls back to structured in-memory store in dev/local mode.
==================================================================== */

export type CreateProductInput = Partial<DbProduct> & {
  name: string;
  price: number;
  description: string;
  category: string;
  merchant: string;
};

export const dbService = {
  // PRODUCTS
  async getProducts(options?: {
    category?: string;
    search?: string;
    featuredOnly?: boolean;
    publishedOnly?: boolean;
    country?: string;
  }): Promise<DbProduct[]> {
    if (adminDb) {
      try {
        let q = adminDb.collection("products") as FirebaseFirestore.Query;
        if (options?.publishedOnly !== false) {
          q = q.where("published", "==", true);
        }
        if (options?.category && options.category !== "All") {
          q = q.where("category", "==", options.category);
        }
        if (options?.featuredOnly) {
          q = q.where("featured", "==", true);
        }
        const snap = await q.get();
        if (!snap.empty) {
          let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbProduct));
          if (options?.search) {
            const term = options.search.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
          }
          if (options?.country) {
            list = list.filter((p) => p.countryAvailability.includes(options.country!));
          }
          return list;
        }
      } catch (e) {
        console.warn("Firestore query error; using memory store:", e);
      }
    }

    // Memory Store
    let list = [...inMemoryProducts];
    if (options?.publishedOnly !== false) {
      list = list.filter((p) => p.published);
    }
    if (options?.category && options.category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
    }
    if (options?.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    if (options?.search) {
      const term = options.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }
    if (options?.country) {
      list = list.filter((p) => p.countryAvailability.includes(options.country!));
    }
    return list;
  },

  async getProductBySlug(slug: string): Promise<DbProduct | null> {
    if (adminDb) {
      try {
        const snap = await adminDb.collection("products").where("slug", "==", slug).limit(1).get();
        if (!snap.empty) {
          const doc = snap.docs[0];
          return { id: doc.id, ...doc.data() } as DbProduct;
        }
      } catch (e) {
        console.warn("Firestore product by slug error:", e);
      }
    }
    return inMemoryProducts.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<DbProduct | null> {
    if (adminDb) {
      try {
        const doc = await adminDb.collection("products").doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() } as DbProduct;
        }
      } catch (e) {
        console.warn("Firestore product by ID error:", e);
      }
    }
    return inMemoryProducts.find((p) => p.id === id) || null;
  },

  async createProduct(product: CreateProductInput): Promise<DbProduct> {
    const id = `p-${Date.now()}`;
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProduct: DbProduct = {
      label: product.label || "Editor's pick",
      currency: product.currency || "USD",
      countryAvailability: product.countryAvailability || ["US", "GB", "CA", "AU"],
      featured: product.featured ?? false,
      accent: product.accent || "sand",
      symbol: product.symbol || "✳",
      affiliateUrl: product.affiliateUrl ?? null,
      published: product.published ?? true,
      ...product,
      slug,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (adminDb) {
      try {
        await adminDb.collection("products").doc(id).set(newProduct);
      } catch (e) {
        console.error("Firestore create product error:", e);
      }
    }

    inMemoryProducts.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<DbProduct>): Promise<DbProduct | null> {
    const updatedAt = new Date().toISOString();
    if (adminDb) {
      try {
        await adminDb.collection("products").doc(id).update({ ...updates, updatedAt });
      } catch (e) {
        console.error("Firestore update product error:", e);
      }
    }

    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updates, updatedAt };
      return inMemoryProducts[idx];
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (adminDb) {
      try {
        await adminDb.collection("products").doc(id).delete();
      } catch (e) {
        console.error("Firestore delete product error:", e);
      }
    }
    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      inMemoryProducts.splice(idx, 1);
      return true;
    }
    return false;
  },

  // CATEGORIES
  async getCategories(): Promise<DbCategory[]> {
    if (adminDb) {
      try {
        const snap = await adminDb.collection("categories").where("active", "==", true).orderBy("order").get();
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbCategory));
        }
      } catch (e) {
        console.warn("Firestore getCategories error:", e);
      }
    }
    return inMemoryCategories.filter((c) => c.active);
  },

  async createCategory(cat: Omit<DbCategory, "id" | "createdAt">): Promise<DbCategory> {
    const id = `cat-${Date.now()}`;
    const newCat: DbCategory = { ...cat, id, createdAt: new Date().toISOString() };
    if (adminDb) {
      try {
        await adminDb.collection("categories").doc(id).set(newCat);
      } catch (e) {
        console.error("Firestore create category error:", e);
      }
    }
    inMemoryCategories.push(newCat);
    return newCat;
  },

  // MERCHANTS
  async getMerchants(): Promise<DbMerchant[]> {
    if (adminDb) {
      try {
        const snap = await adminDb.collection("merchants").where("active", "==", true).get();
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbMerchant));
        }
      } catch (e) {
        console.warn("Firestore getMerchants error:", e);
      }
    }
    return inMemoryMerchants.filter((m) => m.active);
  },

  async createMerchant(merchant: Omit<DbMerchant, "id" | "createdAt">): Promise<DbMerchant> {
    const id = `m-${Date.now()}`;
    const newMerchant: DbMerchant = { ...merchant, id, createdAt: new Date().toISOString() };
    if (adminDb) {
      try {
        await adminDb.collection("merchants").doc(id).set(newMerchant);
      } catch (e) {
        console.error("Firestore create merchant error:", e);
      }
    }
    inMemoryMerchants.push(newMerchant);
    return newMerchant;
  },

  // CLICK EVENTS
  async recordClickEvent(event: Omit<DbClickEvent, "id" | "timestamp">): Promise<DbClickEvent> {
    const id = `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newEvent: DbClickEvent = {
      ...event,
      id,
      timestamp: new Date().toISOString(),
    };

    if (adminDb) {
      try {
        await adminDb.collection("click_events").doc(id).set(newEvent);
      } catch (e) {
        console.error("Firestore recordClickEvent error:", e);
      }
    }

    inMemoryClickEvents.unshift(newEvent);
    // Keep recent 1000 in memory
    if (inMemoryClickEvents.length > 1000) inMemoryClickEvents.pop();
    return newEvent;
  },

  async getClickEvents(limit = 100): Promise<DbClickEvent[]> {
    if (adminDb) {
      try {
        const snap = await adminDb.collection("click_events").orderBy("timestamp", "desc").limit(limit).get();
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbClickEvent));
        }
      } catch (e) {
        console.warn("Firestore getClickEvents error:", e);
      }
    }
    return inMemoryClickEvents.slice(0, limit);
  },

  // AD SLOTS
  async getAdSlots(): Promise<DbAdSlot[]> {
    if (adminDb) {
      try {
        const snap = await adminDb.collection("ad_slots").get();
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbAdSlot));
        }
      } catch (e) {
        console.warn("Firestore getAdSlots error:", e);
      }
    }
    return inMemoryAdSlots;
  },

  async updateAdSlot(id: string, updates: Partial<DbAdSlot>): Promise<DbAdSlot | null> {
    const updatedAt = new Date().toISOString();
    if (adminDb) {
      try {
        await adminDb.collection("ad_slots").doc(id).update({ ...updates, updatedAt });
      } catch (e) {
        console.error("Firestore updateAdSlot error:", e);
      }
    }
    const idx = inMemoryAdSlots.findIndex((s) => s.id === id);
    if (idx !== -1) {
      inMemoryAdSlots[idx] = { ...inMemoryAdSlots[idx], ...updates, updatedAt };
      return inMemoryAdSlots[idx];
    }
    return null;
  },

  // SMART LINK PROVIDERS
  async getSmartLinkProviders(): Promise<DbSmartLinkProvider[]> {
    if (adminDb) {
      try {
        const snap = await adminDb.collection("smartlink_providers").get();
        if (!snap.empty) {
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbSmartLinkProvider));
        }
      } catch (e) {
        console.warn("Firestore getSmartLinkProviders error:", e);
      }
    }
    return inMemorySmartLinkProviders;
  },

  // SITE SETTINGS
  async getSiteSettings(): Promise<DbSiteSettings> {
    if (adminDb) {
      try {
        const doc = await adminDb.collection("site_settings").doc("global").get();
        if (doc.exists) {
          return doc.data() as DbSiteSettings;
        }
      } catch (e) {
        console.warn("Firestore getSiteSettings error:", e);
      }
    }
    return inMemorySiteSettings;
  },

  async updateSiteSettings(updates: Partial<DbSiteSettings>): Promise<DbSiteSettings> {
    const updatedAt = new Date().toISOString();
    const updated = { ...inMemorySiteSettings, ...updates, updatedAt };
    if (adminDb) {
      try {
        await adminDb.collection("site_settings").doc("global").set(updated, { merge: true });
      } catch (e) {
        console.error("Firestore updateSiteSettings error:", e);
      }
    }
    inMemorySiteSettings = updated;
    return updated;
  },
};
