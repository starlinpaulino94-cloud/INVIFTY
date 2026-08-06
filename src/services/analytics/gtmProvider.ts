import { ENV } from "../../config/env";
import { ANALYTICS_CONSENT_EVENT, getAnalyticsConsent } from "./consent";
import { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

/**
 * Carga Google Tag Manager únicamente tras el consentimiento.
 *
 * GTM se reserva para etiquetas futuras (Meta Pixel, TikTok, Clarity, etc.).
 * La propiedad GA4 oficial se configura en `ga4Provider`; no debe añadirse de
 * nuevo dentro del contenedor porque duplicaría visitas y conversiones.
 */
export function createGtmProvider(): AnalyticsProvider {
  let initialized = false;

  const loadGoogleTagManager = () => {
    if (initialized || !ENV.gtmEnabled || typeof document === "undefined") return;
    if (getAnalyticsConsent() !== "accepted") return;
    initialized = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    const firstScript = document.getElementsByTagName("script")[0];
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${ENV.gtmContainerId}`;
    firstScript?.parentNode?.insertBefore(script, firstScript);
  };

  return {
    name: "gtm",

    init() {
      if (!ENV.gtmEnabled || typeof window === "undefined") return;
      loadGoogleTagManager();
      window.addEventListener(ANALYTICS_CONSENT_EVENT, loadGoogleTagManager);
    },

    // Los eventos ya llegan a GA4 directamente. GTM sólo recibe aquellos que
    // una etiqueta futura necesite, evitando duplicar `page_view` por defecto.
    track(_event: AnalyticsEventName, _props: AnalyticsProps) {},
  };
}

