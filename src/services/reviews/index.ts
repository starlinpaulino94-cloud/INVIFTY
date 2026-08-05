import { buildWhatsAppUrl } from "../../config";

export type ReviewLanguage = "es" | "en";

/** Lo que el visitante escribe en el formulario de reseña. */
export interface ReviewSubmission {
  /** Nombre tal como quiere que aparezca publicado. */
  author: string;
  /** Tipo de evento en texto libre: «Boda», «15 años», «Apertura»… */
  eventType: string;
  /** Valoración de 1 a 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Texto de la reseña. */
  quote: string;
  /** Autorización explícita para publicarla. Sin esto no se envía. */
  consentToPublish: boolean;
  language: ReviewLanguage;
}

/** Identificadores de error. El componente decide el texto y el idioma. */
export type ReviewFieldError = "author" | "eventType" | "quote" | "consent";

export const MIN_QUOTE_LENGTH = 20;
export const MAX_QUOTE_LENGTH = 600;

/**
 * Valida una reseña antes de enviarla.
 *
 * Devuelve **identificadores**, no textos: así la analítica registra qué campo
 * falló sin registrar nunca lo que la persona escribió.
 */
export function validateReview(submission: ReviewSubmission): ReviewFieldError[] {
  const errors: ReviewFieldError[] = [];

  if (submission.author.trim().length < 2) errors.push("author");
  if (submission.eventType.trim().length < 2) errors.push("eventType");

  const quote = submission.quote.trim();
  if (quote.length < MIN_QUOTE_LENGTH || quote.length > MAX_QUOTE_LENGTH) errors.push("quote");

  // El consentimiento no es una casilla decorativa: es lo que permite publicar
  // la reseña. Sin él no se envía nada, ni siquiera al WhatsApp del negocio.
  if (!submission.consentToPublish) errors.push("consent");

  return errors;
}

/**
 * Redacta el mensaje de WhatsApp con la reseña.
 *
 * Incluye la autorización por escrito dentro del propio mensaje: así queda
 * registrada en la conversación, que es donde debe poder consultarse antes de
 * publicar nada.
 */
export function buildReviewMessage(submission: ReviewSubmission): string {
  const isEs = submission.language === "es";
  const stars = "★".repeat(submission.rating) + "☆".repeat(5 - submission.rating);

  const lines = isEs
    ? [
        "*RESEÑA DE CLIENTE — INVIFTY*",
        "--------------------------------",
        `👤 *Nombre para publicar:* ${submission.author.trim()}`,
        `🎉 *Evento:* ${submission.eventType.trim()}`,
        `⭐ *Valoración:* ${stars} (${submission.rating}/5)`,
        "",
        `📝 *Reseña:*`,
        submission.quote.trim(),
        "",
        "--------------------------------",
        "✅ Autorizo a Invifty a publicar esta reseña en su página web con el nombre indicado.",
      ]
    : [
        "*CLIENT REVIEW — INVIFTY*",
        "--------------------------------",
        `👤 *Name to publish:* ${submission.author.trim()}`,
        `🎉 *Event:* ${submission.eventType.trim()}`,
        `⭐ *Rating:* ${stars} (${submission.rating}/5)`,
        "",
        `📝 *Review:*`,
        submission.quote.trim(),
        "",
        "--------------------------------",
        "✅ I authorise Invifty to publish this review on their website under the name given above.",
      ];

  return lines.join("\n");
}

/**
 * Prepara el envío de una reseña.
 *
 * **No guarda nada**: esta web no tiene backend, así que la reseña viaja por
 * WhatsApp igual que los pedidos. Devuelve la URL en vez de abrirla, porque
 * abrir una ventana fuera del gesto del usuario lo bloquea el navegador —y
 * porque así la función se puede probar.
 *
 * La consecuencia honesta, que la interfaz debe decir: al enviar **no queda
 * publicada**. Se publica cuando Invifty la añade a `reviewsData.ts`.
 */
export function submitReview(submission: ReviewSubmission): {
  ok: boolean;
  errors: ReviewFieldError[];
  whatsappUrl?: string;
} {
  const errors = validateReview(submission);
  if (errors.length > 0) return { ok: false, errors };

  return { ok: true, errors: [], whatsappUrl: buildWhatsAppUrl(buildReviewMessage(submission)) };
}
