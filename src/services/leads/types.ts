import { UtmParams } from "../analytics/utm";

/**
 * Datos de un lead comercial.
 *
 * Es el contrato que consume tanto el envío por WhatsApp de hoy como la futura
 * API de Invifty Studio. Los componentes construyen este objeto y no saben por
 * qué canal acabará enviándose.
 */
export interface LeadPayload {
  name: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  planId?: string;
  demoId?: string;
  message?: string;
  language: "es" | "en";
  /** De dónde salió el lead: `inquiry_form`, `pricing_card`, `demo_watermark`… */
  source: string;
  utm?: UtmParams;
  consent: boolean;
}

/** Cómo se envió el lead. */
export type LeadTransportKind = "api" | "whatsapp";

export type LeadResult =
  | {
      ok: true;
      mode: LeadTransportKind;
      /**
       * URL de WhatsApp que hay que abrir. Sólo en modo `whatsapp`.
       * El componente la abre; el servicio no toca `window`.
       */
      whatsappUrl?: string;
    }
  | {
      ok: false;
      mode: LeadTransportKind;
      /** Identificador de error para la analítica; no es texto para el usuario. */
      reason: string;
    };

export interface LeadTransport {
  readonly kind: LeadTransportKind;
  send(payload: LeadPayload): Promise<LeadResult>;
}

/** Errores de validación: campo → identificador del problema. */
export type LeadValidationErrors = Partial<Record<keyof LeadPayload, string>>;
