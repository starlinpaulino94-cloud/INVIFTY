/**
 * CONFIGURACIÓN PRINCIPAL DE INVIFTY
 * ====================================
 * Puedes modificar el número de WhatsApp, usuario de Instagram,
 * precios y textos principales directamente en este archivo.
 */

export const WHATSAPP_NUMBER = "18092693214";

export const CONFIG = {
  brandName: "Invifty",
  slogan: "Invitaciones digitales que enamoran desde el primer mensaje",
  subtitle: "Invitaciones digitales de alta gama para bodas, cumpleaños y eventos especiales. Tu invitación lista en 48 horas.",
  location: "Disponible para eventos en todo el mundo",
  instagramUser: "@invifty.official",
  instagramUrl: "https://instagram.com/invifty.official",
  supportEmail: "hola@invifty.com",
  parentCompany: "Vitrexi Technologies",
  parentCompanyUrl: "#",
  
  // Moneda principal ($ USD)
  currency: "$",
  currencyCode: "USD",
  
  // Número de WhatsApp configurado (809) 269-3214
  rawWhatsappNumber: WHATSAPP_NUMBER,
  
  // Teléfono formateado para mostrar en pantalla
  displayPhone: "+1 (809) 269-3214",
};

/**
 * Función helper para construir enlaces a WhatsApp con mensajes prellenados.
 */
export function buildWhatsAppUrl(message: string): string {
  const number = CONFIG.rawWhatsappNumber;
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encodedText}`;
}
