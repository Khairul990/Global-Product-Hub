import crypto from "crypto";

// Common bots and web crawlers
const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /google/i,
  /bing/i,
  /duckduck/i,
  /baidu/i,
  /yandex/i,
  /sogou/i,
  /exabot/i,
  /facebot/i,
  /facebook/i,
  /ia_archiver/i,
  /pinterest/i,
  /twitter/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /node-fetch/i,
  /go-http-client/i,
];

export function isBotTraffic(userAgent?: string | null): boolean {
  if (!userAgent) return true; // Treat absent user-agent as automated/bot
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "gph_salt_2026").digest("hex").substring(0, 16);
}

export function generateClickId(): string {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString("hex");
  return `clk_${ts}_${rand}`;
}

export function appendTrackingParam(originalUrl: string, clickId: string, campaign?: string | null): string {
  try {
    const parsed = new URL(originalUrl);
    // Add click tracking ID for affiliate network sub-id tracking
    parsed.searchParams.set("subid", clickId);
    if (campaign) {
      parsed.searchParams.set("campaign", campaign);
    }
    return parsed.toString();
  } catch {
    return originalUrl;
  }
}
