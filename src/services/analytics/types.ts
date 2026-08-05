/**
 * CONTRATO DE ANALÍTICA
 * =====================
 * Tipos compartidos por la capa de analítica. No dependen de ningún proveedor:
 * cambiar GA4 por otra herramienta sólo debe obligar a escribir un `Provider`
 * nuevo, nunca a tocar los componentes que registran eventos.
 */

/** Eventos del embudo. La unión cerrada evita nombres inventados o con erratas. */
export type AnalyticsEventName =
  // Navegación
  | "page_view"
  | "view_hero"
  | "click_primary_cta"
  | "change_language"
  // Catálogo de demos
  | "view_demo_list"
  | "filter_demo"
  | "view_demo"
  | "click_demo_lead"
  // Planes
  | "view_pricing"
  | "expand_plan_comparison"
  | "select_plan"
  // Formulario de captación
  | "start_lead_form"
  | "lead_form_error"
  | "submit_lead_form"
  // Reseñas de clientes
  | "view_reviews"
  | "start_review_form"
  | "review_form_error"
  | "submit_review"
  // Contacto
  | "open_whatsapp"
  | "view_faq"
  // Enlaces internos de las páginas SEO
  | "seo_internal_link";

/** Cómo se envió finalmente el lead. */
export type LeadSubmissionMode = "api" | "whatsapp";

/**
 * Propiedades permitidas en un evento.
 *
 * Es una lista cerrada a propósito. La regla de privacidad del proyecto prohíbe
 * enviar nombre, teléfono, mensajes personales o la fecha exacta del evento a
 * la analítica; al no existir esos campos en el tipo, no se pueden enviar por
 * descuido desde un componente.
 */
export interface AnalyticsProps {
  page_path?: string;
  language?: "es" | "en";
  plan_id?: string;
  demo_id?: string;
  /** Categoría del evento (boda, quinceanera…), NUNCA la fecha del evento. */
  event_type?: string;
  category?: string;
  /** Dónde estaba el control que se pulsó (hero, navbar, pricing_card…). */
  placement?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  lead_submission_mode?: LeadSubmissionMode;
  /** Motivo de un `lead_form_error`: identificador de campo, nunca su valor. */
  error_reason?: string;
  filter_value?: string;
  link_text?: string;
  /** Estrellas de una reseña (1–5). Nunca su texto ni quién la escribió. */
  rating?: number;
  /** Cuántas reseñas hay publicadas al mostrarse la sección. */
  review_count?: number;
}

/** Destino concreto de los eventos (GA4, consola, un doble de pruebas…). */
export interface AnalyticsProvider {
  readonly name: string;
  /** Se llama una vez al arrancar. Debe ser idempotente. */
  init(): void;
  track(event: AnalyticsEventName, props: AnalyticsProps): void;
}
