/**
 * VARIABLES DE ENTORNO
 * ====================
 * Punto único donde se leen las variables de entorno de Vite.
 *
 * REGLA DE SEGURIDAD: todo lo que lleva el prefijo `VITE_` queda incrustado en
 * el JavaScript que se envía al navegador y es PÚBLICO. Nunca pongas aquí una
 * clave de API, un token ni ningún secreto. Si la integración con Studio llega
 * a necesitar autenticación, debe resolverse en un endpoint de servidor, nunca
 * en este archivo.
 *
 * Todas las variables son opcionales: la web funciona sin ningún `.env` usando
 * los valores por defecto de abajo. Ver `.env.example`.
 */

interface RawEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GTM_CONTAINER_ID?: string;
  readonly VITE_SHOW_CONSENT_BANNER?: string;
  readonly VITE_ENABLE_VERCEL_ANALYTICS?: string;
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
  readonly VITE_STUDIO_API_URL?: string;
  readonly VITE_ENABLE_STUDIO_LEADS?: string;
}

const raw = import.meta.env as unknown as RawEnv;

/** Acumula avisos de configuración para mostrarlos una sola vez en desarrollo. */
const warnings: string[] = [];

function readString(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  const trimmed = value?.trim().toLowerCase();
  if (trimmed === undefined || trimmed === "") return fallback;
  return trimmed === "true" || trimmed === "1";
}

/** Deja sólo dígitos: `wa.me` exige el número en formato internacional sin símbolos. */
function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

const siteUrl = readString(raw.VITE_SITE_URL, "https://invifty.com").replace(/\/+$/, "");

const whatsappNumber = normalizePhone(readString(raw.VITE_WHATSAPP_NUMBER, "18092693214"));

// El ID de medición es público por definición. Puede sobrescribirse por entorno,
// pero Invifty funciona con su propiedad oficial incluso sin configuración extra.
const gaMeasurementId = readString(raw.VITE_GA_MEASUREMENT_ID, "G-41L6G60R5C");
const gtmContainerId = readString(raw.VITE_GTM_CONTAINER_ID, "GTM-WFPB226S");

/**
 * Analítica de Vercel. Activada por defecto porque el sitio se despliega en
 * Vercel, no instala cookies y no requiere banner de consentimiento.
 *
 * Si la función no está habilitada en el panel del proyecto, el script que
 * inyecta simplemente no existe y la petición falla sin efectos: no rompe nada.
 */
const vercelAnalyticsEnabled = readBoolean(raw.VITE_ENABLE_VERCEL_ANALYTICS, true);

/**
 * Token de verificación de Google Search Console.
 *
 * Es el valor del atributo `content` de la etiqueta que da Google, NO la
 * etiqueta entera. No es un secreto: sirve para demostrar que controlas el
 * dominio y es público por definición.
 */
const googleSiteVerification = readString(raw.VITE_GOOGLE_SITE_VERIFICATION, "");

const studioApiUrl = readString(raw.VITE_STUDIO_API_URL, "").replace(/\/+$/, "");

const enableStudioLeadsRequested = readBoolean(raw.VITE_ENABLE_STUDIO_LEADS, false);

// --- Validación -------------------------------------------------------------

if (!/^\d{10,15}$/.test(whatsappNumber)) {
  warnings.push(
    `VITE_WHATSAPP_NUMBER no parece un número internacional válido ("${whatsappNumber}"). ` +
      "Debe tener entre 10 y 15 dígitos, con código de país y sin símbolos. Ej: 18092693214."
  );
}

if (gaMeasurementId && !/^G-[A-Z0-9]+$/i.test(gaMeasurementId)) {
  warnings.push(
    `VITE_GA_MEASUREMENT_ID no tiene el formato esperado ("${gaMeasurementId}"). ` +
      'Debe ser del tipo "G-XXXXXXXXXX". La analítica quedará desactivada.'
  );
}

if (gtmContainerId && !/^GTM-[A-Z0-9]+$/i.test(gtmContainerId)) {
  warnings.push(
    `VITE_GTM_CONTAINER_ID no tiene el formato esperado ("${gtmContainerId}"). ` +
      'Debe ser del tipo "GTM-XXXXXXX". Tag Manager quedará desactivado.'
  );
}

if (enableStudioLeadsRequested && !studioApiUrl) {
  warnings.push(
    "VITE_ENABLE_STUDIO_LEADS está activo pero VITE_STUDIO_API_URL está vacío. " +
      "Los leads seguirán enviándose por WhatsApp."
  );
}

/**
 * La integración con Studio sólo se considera activa si el flag está encendido
 * Y además hay una URL configurada. Así, un flag mal puesto nunca deja el
 * formulario sin canal de envío.
 */
const studioLeadsEnabled = enableStudioLeadsRequested && studioApiUrl.length > 0;

const gaEnabled = /^G-[A-Z0-9]+$/i.test(gaMeasurementId);
const gtmEnabled = /^GTM-[A-Z0-9]+$/i.test(gtmContainerId);

/**
 * Banner de consentimiento de analítica. Apagado por decisión del negocio
 * mientras no se quiera mostrar ningún aviso en la página: sin banner nadie
 * puede aceptar, así que GA4 y GTM permanecen sin cargar y sin cookies
 * (la analítica sin cookies de Vercel no lo necesita y sigue midiendo).
 * Para reactivarlo: VITE_SHOW_CONSENT_BANNER=true en el entorno.
 */
const consentBannerEnabled = readBoolean(raw.VITE_SHOW_CONSENT_BANNER, false);

if (import.meta.env.DEV && gaEnabled && !consentBannerEnabled) {
  warnings.push(
    "GA4 está configurado pero el banner de consentimiento está oculto " +
      "(VITE_SHOW_CONSENT_BANNER). Sin banner nadie puede aceptar, así que GA4 no se activará."
  );
}

if (import.meta.env.DEV && warnings.length > 0) {
  // Sólo en desarrollo: en producción no se ensucia la consola del visitante.
  console.warn(
    "[Invifty] Avisos de configuración de entorno:\n" +
      warnings.map((w) => `  · ${w}`).join("\n")
  );
}

export const ENV = {
  /** URL pública absoluta del sitio, sin barra final. Base para canonical y Open Graph. */
  siteUrl,
  /** Número de WhatsApp en formato internacional, sólo dígitos. */
  whatsappNumber,
  /** ID de medición de GA4. Cadena vacía = analítica desactivada. */
  gaMeasurementId,
  /** true sólo si el ID de GA4 tiene formato válido. */
  gaEnabled,
  /** Contenedor público de Google Tag Manager. */
  gtmContainerId,
  /** true sólo si el contenedor de GTM tiene formato válido. */
  gtmEnabled,
  /** true si debe mostrarse el banner de consentimiento de analítica. */
  consentBannerEnabled,
  /** true si debe cargarse la analítica sin cookies de Vercel. */
  vercelAnalyticsEnabled,
  /** Token de Google Search Console. Cadena vacía = no verificado por etiqueta. */
  googleSiteVerification,
  /** URL base de la API pública de Invifty Studio. Vacío = no configurada. */
  studioApiUrl,
  /** true sólo si el flag está activo Y hay URL. Ver docs/integracion-futura-studio.md. */
  studioLeadsEnabled,
  /** Avisos de validación, expuestos para pruebas y diagnóstico. */
  warnings: warnings as readonly string[],
} as const;
