import { ENV } from "../../config/env";
import { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

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

  return {
    name: "ga4",

    init() {
      if (initialized || !ENV.gaEnabled || typeof document === "undefined") return;
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
      // `send_page_view: false` porque las vistas de página de esta SPA se
      // registran a mano en cada cambio de ruta; si no, se duplicarían.
      window.gtag("config", ENV.gaMeasurementId, { send_page_view: false });
    },

    track(event: AnalyticsEventName, props: AnalyticsProps) {
      if (!ENV.gaEnabled || typeof window.gtag !== "function") return;
      window.gtag("event", event, props);
    },
  };
}
