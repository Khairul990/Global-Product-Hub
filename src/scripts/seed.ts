import { adminDb } from "../lib/firebase/admin";
import { dbService } from "../lib/db/service";

export async function seedFirestore() {
  if (!adminDb) {
    console.log("Firebase Admin is not connected. Seed script skipped.");
    return;
  }

  console.log("🌱 Seeding Cloud Firestore with production collections...");

  // Seed Site Settings
  await adminDb.collection("site_settings").doc("global").set({
    siteName: "Global Product Hub",
    tagline: "Good Finds. Well Considered.",
    defaultCurrency: "USD",
    contactEmail: "contact@globalproducthub.com",
    privacyEmail: "privacy@globalproducthub.com",
    affiliateDisclosureText:
      "Global Product Hub may use affiliate links. If you click an affiliate link and make a purchase, we may receive a commission at no additional cost to you.",
    enableConsentBanner: true,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  console.log("✓ Site settings seeded.");

  // Seed Categories
  const categories = await dbService.getCategories();
  for (const cat of categories) {
    await adminDb.collection("categories").doc(cat.id).set(cat, { merge: true });
  }
  console.log(`✓ ${categories.length} categories seeded.`);

  // Seed Merchants
  const merchants = await dbService.getMerchants();
  for (const merchant of merchants) {
    await adminDb.collection("merchants").doc(merchant.id).set(merchant, { merge: true });
  }
  console.log(`✓ ${merchants.length} merchants seeded.`);

  // Seed Products
  const products = await dbService.getProducts({ publishedOnly: false });
  for (const product of products) {
    await adminDb.collection("products").doc(product.id).set(product, { merge: true });
  }
  console.log(`✓ ${products.length} products seeded.`);

  // Seed Ad Slots
  const adSlots = await dbService.getAdSlots();
  for (const slot of adSlots) {
    await adminDb.collection("ad_slots").doc(slot.id).set(slot, { merge: true });
  }
  console.log(`✓ ${adSlots.length} ad slots seeded.`);

  // Seed Smart Link Providers (Disabled by default)
  const slProviders = await dbService.getSmartLinkProviders();
  for (const sl of slProviders) {
    await adminDb.collection("smartlink_providers").doc(sl.id).set(sl, { merge: true });
  }
  console.log(`✓ ${slProviders.length} smart link provider adapters initialized (disabled).`);

  console.log("🎉 Firestore database seeding complete!");
}

if (require.main === module) {
  seedFirestore().catch(console.error);
}
