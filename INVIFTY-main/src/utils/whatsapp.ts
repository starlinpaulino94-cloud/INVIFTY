import { buildWhatsAppUrl } from "../config";
import { InquiryFormData, RsvpFormData } from "../types";

/**
 * Construye el enlace de WhatsApp para la solicitud del Formulario Principal
 */
export function createInquiryWhatsAppUrl(data: InquiryFormData, isEs: boolean = true): string {
  const message = isEs
    ? `
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
`.trim()
    : `
*INVITATION REQUEST - INVIFTY*
--------------------------------
👤 *Name:* ${data.name}
📱 *Phone:* ${data.phone}
🎉 *Event:* ${data.eventType}
📅 *Date:* ${data.eventDate || "To be defined"}
💎 *Plan of Interest:* ${data.planInterest}
${data.message ? `📝 *Details:* ${data.message}` : ""}
--------------------------------
Hello Invifty, I just sent my request from the website. I would like personalized advice for my event.
`.trim();

  return buildWhatsAppUrl(message);
}

/**
 * Construye el enlace de WhatsApp para seleccionar un Plan específico
 */
export function createPlanWhatsAppUrl(planName: string, priceDisplay: string, isEs: boolean = true): string {
  const message = isEs
    ? `
*CONSULTA DE PLAN - INVIFTY*
--------------------------------
Hola Invifty, estoy interesado/a en solicitar el *Plan ${planName}* (${priceDisplay}).
¿Me podrían indicar los pasos para enviar los datos de mi celebración?
`.trim()
    : `
*PLAN INQUIRY - INVIFTY*
--------------------------------
Hello Invifty, I am interested in requesting the *${planName} Plan* (${priceDisplay}).
Could you please guide me through the steps to submit my event details?
`.trim();

  return buildWhatsAppUrl(message);
}

/**
 * Construye el enlace de WhatsApp desde la marca de agua de las Muestras ("Quiero una invitación así")
 */
export function createDemoWatermarkWhatsAppUrl(sampleName: string, isEs: boolean = true): string {
  const message = isEs
    ? `
*SOLICITUD DESDE MUESTRA MODELO - INVIFTY*
--------------------------------
Hola Invifty, estuve observando la muestra de diseño *"${sampleName}"* en su sitio web y me ha gustado mucho.
Deseo cotizar una invitación similar para mi próximo evento.
`.trim()
    : `
*REQUEST FROM SHOWCASE SAMPLE - INVIFTY*
--------------------------------
Hello Invifty, I was looking at the *"${sampleName}"* design sample on your website and loved it.
I would like a quote for a similar invitation for my upcoming event.
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
