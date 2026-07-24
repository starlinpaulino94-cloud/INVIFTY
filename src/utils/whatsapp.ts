import { buildWhatsAppUrl } from "../config";
import { InquiryFormData, RsvpFormData } from "../types";

/**
 * Construye el enlace de WhatsApp para la solicitud del Formulario Principal
 */
export function createInquiryWhatsAppUrl(data: InquiryFormData): string {
  const message = `
*SOLICITUD DE INVITACIÓN - INVIFTY*
--------------------------------
👤 *Nombre:* ${data.name}
📱 *Teléfono:* ${data.phone}
🎉 *Evento:* ${data.eventType}
📅 *Fecha:* ${data.eventDate || "Por definir"}
💎 *Plan de Interés:* ${data.planInterest}
${data.message ? `📝 *Detalles:* ${data.message}` : ""}
--------------------------------
Hola Invifty, acabo de enviar mi solicitud desde la página web. Deseo recibir asesoría personalizada para mi evento.
`.trim();

  return buildWhatsAppUrl(message);
}

/**
 * Construye el enlace de WhatsApp para seleccionar un Plan específico
 */
export function createPlanWhatsAppUrl(planName: string, price: number): string {
  const message = `
*CONSULTA DE PLAN - INVIFTY*
--------------------------------
Hola Invifty, estoy interesado/a en solicitar el *Plan ${planName}* ($${price} USD).
¿Me podrían indicar los pasos para enviar los datos de mi celebración?
`.trim();

  return buildWhatsAppUrl(message);
}

/**
 * Construye el enlace de WhatsApp desde la marca de agua de las Muestras ("Quiero una invitación así")
 */
export function createDemoWatermarkWhatsAppUrl(sampleName: string): string {
  const message = `
*SOLICITUD DESDE MUESTRA MODELO - INVIFTY*
--------------------------------
Hola Invifty, estuve observando la muestra de diseño *"${sampleName}"* en su sitio web y me ha gustado mucho.
Deseo cotizar una invitación similar para mi próximo evento.
`.trim();

  return buildWhatsAppUrl(message);
}

/**
 * Construye el mensaje de RSVP para las Muestras
 */
export function createRsvpWhatsAppUrl(eventName: string, data: RsvpFormData): string {
  const message = `
💌 *CONFIRMACIÓN DE ASISTENCIA (RSVP)*
Evento: *${eventName}*
--------------------------------
👤 *Nombre:* ${data.fullName}
📌 *Estado:* ${data.attendance === "Confirmado" ? "CONFIRMADO" : "No asistiré"}
👥 *Acompañantes:* ${data.guestCount}
${data.menuPreference ? `🍽️ *Menú:* ${data.menuPreference}` : ""}
${data.dietaryNotes ? `⚠️ *Notas:* ${data.dietaryNotes}` : ""}
${data.songRequest ? `🎵 *Sugerencia musical:* ${data.songRequest}` : ""}
--------------------------------
Confirmado desde la invitación digital Invifty.
`.trim();

  return buildWhatsAppUrl(message);
}
