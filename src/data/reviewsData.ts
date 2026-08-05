import { Localized } from "../types";

/**
 * RESEÑAS DE CLIENTES
 * ===================
 * Fuente única de las opiniones publicadas en la web.
 *
 * ⚠️ REGLA INNEGOCIABLE: aquí sólo entra una reseña que **una persona real haya
 * escrito y autorizado a publicar por escrito**.
 *
 * Esta web ya tuvo testimonios inventados (`Isabella & Carlos M.`,
 * `Dra. Patricia Reyes`…) con nombre, ciudad, fecha y cinco estrellas. Se
 * retiraron. No se trata de un detalle de estilo:
 *
 * 1. Atribuir una opinión a alguien que no la dijo es una afirmación falsa
 *    sobre una persona, aunque el nombre sea inventado.
 * 2. Google penaliza el marcado de reseñas falsas, y `AggregateRating` sobre
 *    opiniones inventadas es exactamente ese caso.
 * 3. Un cliente que descubre una reseña falsa deja de creer también las
 *    verdaderas — y el resto de la web.
 *
 * Una etiqueta de «ejemplo ilustrativo» NO lo arregla: la letra pequeña no
 * viaja cuando alguien comparte una captura.
 *
 * QUÉ HACE FALTA PARA PUBLICAR UNA
 * --------------------------------
 * - El texto tal como lo escribió la persona (se pueden corregir erratas, no
 *   cambiar el sentido ni inflar el elogio).
 * - El nombre tal como quiera aparecer (vale «Camila R.» si lo prefiere así).
 * - El tipo de evento y el mes.
 * - **Permiso explícito de publicación**, guardado en la conversación de
 *   WhatsApp. Sin eso, la reseña no se publica.
 *
 * Mientras este arreglo esté vacío, la web lo dice abiertamente en vez de
 * disimularlo, y no emite ningún marcado de valoración.
 */
export interface ClientReview {
  /** Identificador estable. Viaja en la analítica; no cambiar una vez publicado. */
  id: string;
  /** Nombre tal como la persona autorizó que aparezca. */
  author: string;
  /** Tipo de evento, en los dos idiomas. */
  eventType: Localized;
  /** Mes y año del evento. Ej: "Marzo 2026". Nunca la fecha exacta. */
  eventDate: Localized;
  /** Texto de la reseña, tal como se recibió. */
  quote: Localized;
  /** Valoración de 1 a 5 que dio la persona. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Ciudad o localidad, si la persona quiso indicarla. Opcional. */
  location?: string;
}

/**
 * Reseñas publicadas.
 *
 * Vacío a propósito: hoy no hay ninguna reseña real autorizada. En cuanto
 * llegue la primera por WhatsApp con permiso, se añade aquí y aparece sola en
 * la web, con su marcado de valoración incluido.
 */
export const CLIENT_REVIEWS: ClientReview[] = [];

/** Media de valoración, o `null` si todavía no hay reseñas. */
export function averageRating(reviews: ClientReview[] = CLIENT_REVIEWS): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
