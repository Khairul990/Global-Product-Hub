import { DbSmartLinkProvider } from "@/types/database";

export interface SmartLinkResolutionRequest {
  targetUrl: string;
  country: string;
  trafficSource: string;
}

export interface SmartLinkResolutionResult {
  allowed: boolean;
  finalUrl: string;
  providerId?: string;
  reason?: string;
}

/**
 * SmartLinkEngine
 * 
 * In accordance with Master Development Specification §8, Smart Links are
 * EXPLICITLY DISABLED by default in Version 1.0. All affiliate purchase routing
 * proceeds through verified merchant links directly.
 */
export class SmartLinkEngine {
  static resolve(
    provider: DbSmartLinkProvider,
    request: SmartLinkResolutionRequest
  ): SmartLinkResolutionResult {
    // 1. Strict Version 1.0 Safety Guard: Always return direct target URL if provider is not enabled
    if (!provider.enabled) {
      return {
        allowed: false,
        finalUrl: request.targetUrl,
        reason: "Smart Link provider is disabled by default in Version 1.0 per compliance policy.",
      };
    }

    // 2. Strict compliance audit requirement
    if (!provider.complianceAudited) {
      return {
        allowed: false,
        finalUrl: request.targetUrl,
        reason: "Provider has not passed mandatory traffic source and network compliance audit.",
      };
    }

    // 3. Country eligibility check
    if (
      provider.countryEligibility.length > 0 &&
      !provider.countryEligibility.includes(request.country)
    ) {
      return {
        allowed: false,
        finalUrl: request.targetUrl,
        reason: `Country ${request.country} is not eligible for this Smart Link provider.`,
      };
    }

    // 4. Traffic source eligibility
    if (
      provider.trafficEligibility.length > 0 &&
      !provider.trafficEligibility.includes(request.trafficSource)
    ) {
      return {
        allowed: false,
        finalUrl: request.targetUrl,
        reason: `Traffic source ${request.trafficSource} is not permitted by provider policy.`,
      };
    }

    // 5. Allowlisted domain verification
    try {
      const parsed = new URL(request.targetUrl);
      const isDomainAllowlisted = provider.allowlistedDomains.some((domain) =>
        parsed.hostname.endsWith(domain)
      );

      if (!isDomainAllowlisted) {
        return {
          allowed: false,
          finalUrl: request.targetUrl,
          reason: `Domain ${parsed.hostname} is not in the approved HTTPS merchant allowlist.`,
        };
      }
    } catch {
      return {
        allowed: false,
        finalUrl: request.targetUrl,
        reason: "Malformed target URL",
      };
    }

    return {
      allowed: true,
      finalUrl: request.targetUrl,
      providerId: provider.id,
    };
  }
}
