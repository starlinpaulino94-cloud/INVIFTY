/**
 * CONFIGURACIÓN PRINCIPAL DE INVIFTY
 * ==================================
 * Datos de marca y contacto usados en toda la web.
 *
 * Los valores que cambian entre entornos (número de WhatsApp, URL del sitio,
 * analítica, URL de Studio) se leen desde variables de entorno en `./env.ts`.
 * Ver `.env.example` en la raíz del proyecto.
 */

import { ENV } from "./env";

export { ENV };

/** Número de WhatsApp en formato internacional, sólo dígitos. */
export const WHATSAPP_NUMBER = ENV.whatsappNumber;

/** Formatea un número dominicano/US (11 dígitos, 1XXXXXXXXXX) para mostrar en pantalla. */
function formatDisplayPhone(digits: string): string {
  const match = /^1(\d{3})(\d{3})(\d{4})$/.exec(digits);
  return match ? `+1 (${match[1]}) ${match[2]}-${match[3]}` : `+${digits}`;
}

export const CONFIG = {
  brandName: "Invifty",
  slogan: "Invitaciones digitales que enamoran desde el primer mensaje",
  subtitle:
    "Invitaciones digitales de alta gama para bodas, cumpleaños y eventos especiales. Tu invitación lista en 3 a 5 días hábiles.",
  location: "Disponible para eventos en todo el mundo",
  instagramUser: "@invifty.official",
  instagramUrl: "https://instagram.com/invifty.official",
  supportEmail: "hola@invifty.com",
  parentCompany: "Vitrexi Technologies",
  parentCompanyUrl: "#",

  /** URL pública del sitio, sin barra final. */
  siteUrl: ENV.siteUrl,

  // Moneda principal ($ USD)
  currency: "$",
  currencyCode: "USD",

  /** Número de WhatsApp configurado (sólo dígitos). */
  rawWhatsappNumber: ENV.whatsappNumber,

  /** Teléfono formateado para mostrar en pantalla. */
  displayPhone: formatDisplayPhone(ENV.whatsappNumber),
} as const;

/**
 * Construye un enlace a WhatsApp con el mensaje prellenado.
 */
export function buildWhatsAppUrl(message: string): string {
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${CONFIG.rawWhatsappNumber}?text=${encodedText}`;
}

/** Convierte una ruta interna en URL absoluta (canonical, Open Graph, sitemap). */
export function absoluteUrl(path: string): string {
  return `${CONFIG.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
