/**
 * ANALÍTICA DE CONVERSIÓN (Google Analytics 4)
 * =============================================
 * Para activarla: crea una propiedad GA4 en analytics.google.com,
 * copia el ID de medición (formato "G-XXXXXXXXXX") y pégalo en
 * GA_MEASUREMENT_ID aquí abajo. Sin ID configurado, el sitio no
 * carga ningún script de rastreo (cero cookies de terceros).
 *
 * Eventos que se registran automáticamente:
 *  - whatsapp_click : cada clic en un enlace de WhatsApp (la conversión principal)
 *  - view_demo      : cuando un visitante abre una muestra interactiva
 *  - inquiry_submit : cuando se envía el formulario de cotización
 */

export const GA_MEASUREMENT_ID = ""; // ej: "G-XXXXXXXXXX"

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  // Conversión principal: cualquier clic en un enlace de WhatsApp.
  // Un solo listener global cubre todos los CTAs presentes y futuros.
  document.addEventListener("click", (event) => {
    const anchor = (event.target as HTMLElement | null)?.closest?.("a[href*='wa.me']");
    if (anchor) {
      trackEvent("whatsapp_click", {
        link_text: (anchor.textContent || "").trim().slice(0, 80),
        page_path: window.location.pathname,
      });
    }
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}
