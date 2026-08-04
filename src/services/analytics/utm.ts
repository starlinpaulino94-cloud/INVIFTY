import { AnalyticsProps } from "./types";

const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const STORAGE_KEY = "invifty:utm";

/** Lee los parámetros UTM de una query string. */
export function parseUtm(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value) utm[key] = value.slice(0, 100);
  }
  return utm;
}

/**
 * Captura los UTM de la URL actual y los conserva durante la sesión.
 *
 * Se guardan en `sessionStorage` porque el visitante suele llegar por un anuncio
 * y enviar el formulario varias vistas después, cuando la URL ya no lleva los
 * parámetros. Al ser de sesión, no persiste entre visitas ni funciona como
 * seguimiento a largo plazo.
 */
export function captureUtm(search: string = typeof window !== "undefined" ? window.location.search : ""): UtmParams {
  const fresh = parseUtm(search);
  if (Object.keys(fresh).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // sessionStorage puede fallar en modo privado; los UTM son opcionales.
    }
    return fresh;
  }
  return getStoredUtm();
}

export function getStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const source = parsed as Record<string, unknown>;
    const utm: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = source[key];
      if (typeof value === "string") utm[key] = value;
    }
    return utm;
  } catch {
    return {};
  }
}

/** Convierte los UTM guardados en propiedades de evento (`utm_source`…). */
export function utmToProps(utm: UtmParams = getStoredUtm()): AnalyticsProps {
  const props: AnalyticsProps = {};
  if (utm.source) props.utm_source = utm.source;
  if (utm.medium) props.utm_medium = utm.medium;
  if (utm.campaign) props.utm_campaign = utm.campaign;
  if (utm.content) props.utm_content = utm.content;
  if (utm.term) props.utm_term = utm.term;
  return props;
}
