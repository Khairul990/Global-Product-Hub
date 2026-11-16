export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  label: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  merchant: string;
  countryAvailability: string[];
  featured: boolean;
  accent: string;
  symbol: string;
  affiliateUrl: string | null;
};

export const products: Product[] = [
  {
    id: "p-001", slug: "studio-wireless-headphones",
    name: "Studio Wireless Headphones", category: "Electronics",
    label: "Editor's pick",
    description: "A considered everyday audio pick with comfortable over-ear design, clean controls and a travel-friendly profile. Check the merchant page for current specifications and availability.",
    price: 89, compareAtPrice: 129, currency: "USD",
    merchant: "Example Merchant", countryAvailability: ["US", "GB", "CA", "AU"],
    featured: true, accent: "sand", symbol: "♫", affiliateUrl: null
  },
  {
    id: "p-002", slug: "everyday-leather-crossbody",
    name: "Everyday Crossbody Bag", category: "Fashion",
    label: "Everyday essential",
    description: "A versatile crossbody silhouette designed for daily use. Review material, sizing and shipping information on the seller's website before purchasing.",
    price: 54, compareAtPrice: 72, currency: "USD",
    merchant: "Example Merchant", countryAvailability: ["US", "GB", "IN"],
    featured: true, accent: "clay", symbol: "▱", affiliateUrl: null
  },
  {
    id: "p-003", slug: "minimal-desk-lamp",
    name: "Minimal Desk Lamp", category: "Home",
    label: "Workspace edit",
    description: "A minimal lighting option for a focused desk setup. Confirm dimensions, bulb compatibility and product details with the retailer.",
    price: 42, compareAtPrice: 59, currency: "USD",
    merchant: "Example Merchant", countryAvailability: ["US", "CA", "AU"],
    featured: true, accent: "olive", symbol: "◉", affiliateUrl: null
  },
  {
    id: "p-004", slug: "daily-carry-water-bottle",
    name: "Daily Carry Water Bottle", category: "Lifestyle",
    label: "Useful find",
    description: "A reusable bottle concept for everyday carry. Check capacity, care instructions and material details on the retailer listing.",
    price: 26, currency: "USD",
    merchant: "Example Merchant", countryAvailability: ["US", "GB", "IN", "AU"],
    featured: false, accent: "blue", symbol: "◌", affiliateUrl: null
  },
  {
    id: "p-005", slug: "active-move-training-mat",
    name: "Active Move Training Mat", category: "Sports",
    label: "Move well",
    description: "A practical mat for home movement and stretching. Check thickness, dimensions and cleaning guidance on the merchant website.",
    price: 35, compareAtPrice: 45, currency: "USD",
    merchant: "Example Merchant", countryAvailability: ["US", "GB", "CA"],
    featured: false, accent: "plum", symbol: "▤", affiliateUrl: null
  },
  {
    id: "p-006", slug: "everyday-skincare-set",
    name: "Everyday Skincare Set", category: "Beauty",
    label: "Daily routine",
    description: "A sample beauty category listing. Review the complete ingredient list, suitability information and seller details before purchase.",
    price: 31, currency: "USD",
    merchant: "Example Merchant", countryAvailability: ["US", "GB", "IN"],
    featured: false, accent: "rose", symbol: "✳", affiliateUrl: null
  }
];

export const categories = ["All", "Electronics", "Fashion", "Home", "Lifestyle", "Sports", "Beauty"];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function discountPercent(product: Product) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}
