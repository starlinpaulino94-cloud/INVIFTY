import { inject, track as vercelTrack } from "@vercel/analytics";
import { ENV } from "../../config/env";
import { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

/**
 * Proveedor de Vercel Web Analytics.
 *
 * Se eligió frente a GA4 porque **no instala cookies ni identifica al
 * visitante**: no necesita banner de consentimiento y no hay datos personales
 * que custodiar. A cambio mide menos: da visitas, páginas más vistas, país,
 * dispositivo y —lo importante para una campaña— el **referente y los UTM** de
 * cada visita.
 *
 * ⚠️ DOS CONDICIONES para que registre algo:
 *
 * 1. Hay que activar «Web Analytics» en el panel de Vercel (Project →
 *    Analytics → Enable). Sin eso, `/_vercel/insights/script.js` no existe y
 *    esto no hace nada. No rompe la web: sólo no mide.
 * 2. Los **eventos personalizados** (`open_whatsapp`, `submit_lead_form`…)
 *    requieren plan Pro. En el plan gratuito se envían y se descartan en
 *    silencio; las visitas de página sí se registran siempre.
 *
 * Por eso `track` no se calla si falla: mientras el plan sea gratuito, la
 * fuente de verdad del embudo sigue siendo el propio WhatsApp.
 */
export function createVercelProvider(): AnalyticsProvider {
  let initialized = false;

  return {
    name: "vercel",

    init() {
      if (initialized || !ENV.vercelAnalyticsEnabled || typeof document === "undefined") return;
      initialized = true;

      // `mode: "auto"` usa el script de depuración en desarrollo (registra por
      // consola sin enviar nada) y el real en producción.
      inject({ mode: "auto" });
    },

    track(event: AnalyticsEventName, props: AnalyticsProps) {
      if (!initialized) return;

      // El script de Vercel ya cuenta las vistas de página por su cuenta, y
      // sigue los cambios de ruta de la SPA. Reenviarlas como evento propio
      // las contaría dos veces en dos sitios distintos del panel.
      if (event === "page_view") return;

      // La API de Vercel sólo acepta valores planos; `undefined` no vale.
      const payload: Record<string, string | number | boolean> = {};
      for (const [key, value] of Object.entries(props)) {
        if (value === undefined || value === null) continue;
        payload[key] = value as string | number | boolean;
      }

      vercelTrack(event, payload);
    },
  };
}
