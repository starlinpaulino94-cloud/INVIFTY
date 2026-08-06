import { ENV } from "../../config/env";
import { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";
import { ANALYTICS_CONSENT_EVENT, getAnalyticsConsent } from "./consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Proveedor de Google Analytics 4.
 *
 * Si `VITE_GA_MEASUREMENT_ID` no está configurado, no se carga ningún script de
 * terceros y no se instala ninguna cookie. Es el comportamiento por defecto.
 */
export function createGa4Provider(): AnalyticsProvider {
  let initialized = false;

  const loadGoogleAnalytics = () => {
    if (initialized || !ENV.gaEnabled || typeof document === "undefined") return;
    if (getAnalyticsConsent() !== "accepted") return;
    initialized = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ENV.gaMeasurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    // Las vistas de esta SPA se registran manualmente al cambiar de ruta.
    window.gtag("config", ENV.gaMeasurementId, { send_page_view: false });
  };

  return {
    name: "ga4",

    init() {
      if (!ENV.gaEnabled || typeof window === "undefined") return;
      loadGoogleAnalytics();
      window.addEventListener(ANALYTICS_CONSENT_EVENT, loadGoogleAnalytics);
    },

    track(event: AnalyticsEventName, props: AnalyticsProps) {
      if (getAnalyticsConsent() !== "accepted" || typeof window.gtag !== "function") return;
      window.gtag("event", event, props);
    },
  };
}
