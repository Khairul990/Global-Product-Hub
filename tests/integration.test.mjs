/**
 * Comprehensive Integration & Verification Test Suite
 * Global Product Hub
 */

const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING GLOBAL PRODUCT HUB AUTOMATED TEST SUITE");
  console.log("=================================================");

  // 1. Public Homepage
  console.log("\n[Test Suite 1: Public Discovery & Navigation]");
  try {
    const homeRes = await fetch(`${BASE_URL}/`);
    assert(homeRes.status === 200, "Homepage returns HTTP 200");
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes("Good finds"), "Homepage contains brand title 'Good finds'");
    assert(homeHtml.includes("GLOBAL"), "Homepage contains brand name 'GLOBAL'");
  } catch (e) {
    assert(false, `Homepage failed: ${e.message}`);
  }

  // 2. Search & Category Filters
  try {
    const catRes = await fetch(`${BASE_URL}/?category=Electronics`);
    assert(catRes.status === 200, "Category filter query returns HTTP 200");
    const catHtml = await catRes.text();
    assert(catHtml.includes("Electronics Finds") || catHtml.includes("Electronics"), "Category filter renders matched header");

    const searchRes = await fetch(`${BASE_URL}/?q=Lamp`);
    assert(searchRes.status === 200, "Search query returns HTTP 200");
    const searchHtml = await searchRes.text();
    assert(searchHtml.includes("Lamp") || searchHtml.includes("Found Objects"), "Search query displays results");
  } catch (e) {
    assert(false, `Search & Filter failed: ${e.message}`);
  }

  // 3. Product Detail Page & 404 Guard
  console.log("\n[Test Suite 2: Product Detail Pages & SEO]");
  try {
    const prodRes = await fetch(`${BASE_URL}/products/everyday-leather-crossbody`);
    assert(prodRes.status === 200, "Product detail page returns HTTP 200");
    const prodHtml = await prodRes.text();
    assert(prodHtml.includes("Everyday Crossbody Bag"), "Page renders product name");
    assert(prodHtml.includes("View at retailer"), "Page renders 'View at retailer' button");
    assert(prodHtml.includes("schema.org"), "Page contains Schema.org JSON-LD structured data");

    const notFoundRes = await fetch(`${BASE_URL}/products/non-existent-product-9999`);
    assert(notFoundRes.status === 404, "Invalid product returns HTTP 404");
  } catch (e) {
    assert(false, `Product detail failed: ${e.message}`);
  }

  // 4. SEO & Legal Routes
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    assert(robotsRes.status === 200, "robots.txt returns HTTP 200");
    const robotsText = await robotsRes.text();
    assert(robotsText.includes("Disallow: /admin"), "robots.txt disallows /admin");

    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    assert(sitemapRes.status === 200, "sitemap.xml returns HTTP 200");

    const privacyRes = await fetch(`${BASE_URL}/privacy`);
    assert(privacyRes.status === 200, "Privacy policy returns HTTP 200");

    const termsRes = await fetch(`${BASE_URL}/terms`);
    assert(termsRes.status === 200, "Terms and conditions returns HTTP 200");

    const affDiscRes = await fetch(`${BASE_URL}/affiliate-disclosure`);
    assert(affDiscRes.status === 200, "Affiliate disclosure returns HTTP 200");
  } catch (e) {
    assert(false, `SEO & Legal routes failed: ${e.message}`);
  }

  // 5. Security & Authentication Checks
  console.log("\n[Test Suite 3: Security, Auth & RBAC]");
  let sessionCookie = "";
  try {
    // Unauthenticated admin access must be denied
    const unauthSession = await fetch(`${BASE_URL}/api/auth/session`);
    assert(unauthSession.status === 401, "Unauthenticated session check returns HTTP 401");

    // Login with demo credentials
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@globalproducthub.com", isDemo: true }),
    });
    assert(loginRes.status === 200, "Admin login returns HTTP 200");
    const loginCookie = loginRes.headers.get("set-cookie");
    assert(Boolean(loginCookie), "Admin login returns secure session cookie");
    sessionCookie = loginCookie ? loginCookie.split(";")[0] : "";

    // Authenticated session check
    const authSession = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { cookie: sessionCookie },
    });
    assert(authSession.status === 200, "Authenticated session check returns HTTP 200");
    const sessionJson = await authSession.json();
    assert(sessionJson.authenticated === true, "Session confirms authenticated: true");
    assert(sessionJson.user.role === "superadmin", "User role is superadmin");
  } catch (e) {
    assert(false, `Auth checks failed: ${e.message}`);
  }

  // 6. Product Management CRUD
  console.log("\n[Test Suite 4: Product Management CRUD]");
  let createdProductId = "";
  try {
    // Unauth POST
    const unauthCreate = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacker Attempt", price: 10 }),
    });
    assert(unauthCreate.status === 401, "Unauthenticated product creation returns HTTP 401");

    // Auth POST with valid payload
    const createRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: sessionCookie },
      body: JSON.stringify({
        name: "Artisan Stoneware Vase",
        slug: "artisan-stoneware-vase",
        category: "Home",
        label: "Handcrafted edit",
        description: "Matte ceramic vase made from reclaimed stoneware.",
        price: 48,
        compareAtPrice: 65,
        currency: "USD",
        merchant: "Nordic Living Co.",
        countryAvailability: ["US", "GB", "CA"],
        accent: "sand",
        symbol: "🏺",
        affiliateUrl: "https://example.com/vase?affid=9988",
        published: true,
        featured: true,
      }),
    });
    assert(createRes.status === 201, "Admin product creation returns HTTP 201");
    const createJson = await createRes.json();
    createdProductId = createJson.product?.id;
    assert(Boolean(createdProductId), `Created product assigned unique ID: ${createdProductId}`);

    // Update Product
    // Update Product (with slight delay for dev compilation)
    if (createdProductId) {
      await new Promise((r) => setTimeout(r, 600));
      const updateRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", cookie: sessionCookie },
        body: JSON.stringify({ price: 44 }),
      });
      assert(updateRes.status === 200, "Admin product update returns HTTP 200");
      const updateJson = await updateRes.json();
      assert(Boolean(updateJson?.product && updateJson.product.price === 44), "Product price updated to $44.00");
    }
  } catch (e) {
    assert(false, `Product CRUD failed: ${e.message}`);
  }

  // 7. Affiliate Engine & Bot Filtering
  console.log("\n[Test Suite 5: Affiliate Redirect Engine & Tracking]");
  try {
    // Unset affiliate URL guard (p-006 has null affiliateUrl)
    const unsetRes = await fetch(`${BASE_URL}/go/everyday-skincare-set`, { redirect: "manual" });
    assert(unsetRes.status === 503, "Unset affiliate URL returns HTTP 503 Guard");

    // Human click redirect
    const humanClickRes = await fetch(`${BASE_URL}/go/artisan-stoneware-vase?cmp=newsletter`, {
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
        "x-vercel-ip-country": "US",
      },
    });
    assert(humanClickRes.status === 302, "Valid affiliate click returns HTTP 302 Temporary Redirect");
    const location = humanClickRes.headers.get("location");
    assert(Boolean(location && location.includes("subid=clk_")), "Redirect appends tracking subid parameter");
    assert(Boolean(location && location.includes("campaign=newsletter")), "Redirect appends campaign parameter");
    assert(Boolean(humanClickRes.headers.get("x-click-id")), "Response contains X-Click-Id header");

    // Bot hit redirect
    await fetch(`${BASE_URL}/go/artisan-stoneware-vase`, {
      redirect: "manual",
      headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
    });

    // Check click analytics API
    const clicksRes = await fetch(`${BASE_URL}/api/clicks`, { headers: { cookie: sessionCookie } });
    assert(clicksRes.status === 200, "Clicks analytics API returns HTTP 200");
    const clicksJson = await clicksRes.json();
    assert(clicksJson.summary.totalClicks >= 2, "Outbound clicks logged in click_events");
    assert(clicksJson.summary.botClicks >= 1, "Bot hits detected and isolated from human performance");
  } catch (e) {
    assert(false, `Affiliate engine failed: ${e.message}`);
  }

  // 8. Advertisement Slots & Consent API
  console.log("\n[Test Suite 6: Advertising & Privacy Consent]");
  try {
    const consentRes = await fetch(`${BASE_URL}/api/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: "test_visitor_01",
        consentGiven: true,
        categories: { analytics: true, marketing: true },
      }),
    });
    assert(consentRes.status === 200, "Privacy consent API returns HTTP 200");

    const adsRes = await fetch(`${BASE_URL}/api/ads`);
    assert(adsRes.status === 200, "Ad slots API returns HTTP 200");
    const adsJson = await adsRes.json();
    assert(adsJson.slots.length === 6, "All 6 required compliant ad slots configured");
  } catch (e) {
    assert(false, `Ad & Consent tests failed: ${e.message}`);
  }

  // Clean up test product
  if (createdProductId) {
    await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "DELETE",
      headers: { cookie: sessionCookie },
    });
  }

  console.log("\n=================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("FATAL ERROR IN TEST RUNNER:", e);
  process.exit(1);
});
