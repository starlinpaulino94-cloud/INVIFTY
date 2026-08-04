import { createGa4Provider } from "./ga4Provider";
import { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";
import { captureUtm, utmToProps } from "./utm";

export * from "./types";
export { captureUtm, getStoredUtm, parseUtm, utmToProps } from "./utm";

let providers: AnalyticsProvider[] = [];

/**
 * Eventos que sólo deben registrarse una vez por sesión de página.
 *
 * `view_pricing`, `view_hero` y compañía se disparan desde un IntersectionObserver:
 * sin esta guarda, desplazarse arriba y abajo inflaría las métricas y haría
 * inservible el embudo. Ver docs/plan-medicion.md.
 */
const oncePerPage = new Set<string>();

/** Registra los proveedores. Por defecto, sólo GA4. */
export function initAnalytics(customProviders?: AnalyticsProvider[]): void {
  providers = customProviders ?? [createGa4Provider()];
  for (const provider of providers) provider.init();
  captureUtm();
  listenForWhatsAppClicks();
}

let whatsappListenerAttached = false;

/**
 * Un único listener delegado cubre todos los enlaces a WhatsApp, presentes y
 * futuros, sin tener que instrumentar cada CTA por separado.
 *
 * Sólo se envía el destino y un fragmento corto del texto visible del enlace:
 * el mensaje prellenado va en la query string y NUNCA se registra, porque puede
 * contener el nombre y el teléfono del visitante.
 */
function listenForWhatsAppClicks(): void {
  if (whatsappListenerAttached || typeof document === "undefined") return;
  whatsappListenerAttached = true;

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest?.("a[href*='wa.me']");
    if (!anchor) return;
    trackEvent("open_whatsapp", {
      link_text: (anchor.textContent || "").trim().slice(0, 60),
      placement: anchor.getAttribute("data-placement") ?? undefined,
    });
  });
}

/**
 * Registra un evento del embudo.
 *
 * Añade automáticamente `page_path` y los UTM de la sesión, para que ningún
 * componente tenga que acordarse de hacerlo.
 */
export function trackEvent(event: AnalyticsEventName, props: AnalyticsProps = {}): void {
  const enriched: AnalyticsProps = {
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...utmToProps(),
    ...props,
  };
  for (const provider of providers) provider.track(event, enriched);
}

/**
 * Igual que `trackEvent`, pero ignora repeticiones.
 *
 * `key` distingue instancias: por ejemplo `view_demo:boda-camila` se registra
 * una vez aunque la tarjeta entre y salga de pantalla varias veces.
 */
export function trackEventOnce(
  event: AnalyticsEventName,
  props: AnalyticsProps = {},
  key?: string
): void {
  const dedupeKey = `${event}:${key ?? ""}`;
  if (oncePerPage.has(dedupeKey)) return;
  oncePerPage.add(dedupeKey);
  trackEvent(event, props);
}

/**
 * Limpia las guardas de deduplicación.
 * Se llama en cada cambio de ruta de la SPA: en una página nueva, `view_pricing`
 * vuelve a ser un evento legítimo.
 */
export function resetOnceGuards(): void {
  oncePerPage.clear();
}

/** Sólo para pruebas: vacía los proveedores registrados. */
export function __resetAnalyticsForTests(): void {
  providers = [];
  oncePerPage.clear();
}
