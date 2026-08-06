export type AnalyticsConsent = "accepted" | "rejected" | "pending";

const STORAGE_KEY = "invifty_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "invifty:analytics-consent";

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "pending";
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : "pending";
}

export function setAnalyticsConsent(consent: Exclude<AnalyticsConsent, "pending">): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, consent);

  if (consent === "rejected") {
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    clearGoogleAnalyticsCookies();
  }

  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: consent }));
}

function clearGoogleAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const hostname = window.location.hostname;
  const domains = ["", hostname, `.${hostname}`];

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) continue;
    for (const domain of domains) {
      const domainPart = domain ? `; Domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; Path=/${domainPart}; SameSite=Lax`;
    }
  }
}

