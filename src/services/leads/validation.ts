import { LeadPayload, LeadValidationErrors } from "./types";

/**
 * Normaliza un teléfono a dígitos y aplica el prefijo del país cuando falta.
 *
 * En República Dominicana la gente escribe su número de muchas formas
 * ("809-269-3214", "(809) 269 3214", "+1 809 269 3214"). Todas deben acabar en
 * el mismo formato E.164 sin símbolos para que el enlace de WhatsApp funcione.
 */
export function normalizePhone(raw: string, defaultCountryCode = "1"): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return "";
  // Si venía con "+", el código de país ya está incluido.
  if (hasPlus) return digits;
  // 10 dígitos = número local de Norteamérica/Caribe sin código de país.
  if (digits.length === 10) return `${defaultCountryCode}${digits}`;
  return digits;
}

/** ¿El teléfono normalizado es plausible como número internacional? */
export function isValidPhone(raw: string): boolean {
  const digits = normalizePhone(raw);
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Valida un lead antes de enviarlo.
 * Devuelve identificadores de error, no textos: el componente decide qué mensaje
 * mostrar en cada idioma, y la analítica registra el identificador.
 */
export function validateLead(payload: LeadPayload): LeadValidationErrors {
  const errors: LeadValidationErrors = {};

  if (!payload.name.trim()) {
    errors.name = "required";
  } else if (payload.name.trim().length < 2) {
    errors.name = "too_short";
  }

  if (!payload.phone.trim()) {
    errors.phone = "required";
  } else if (!isValidPhone(payload.phone)) {
    errors.phone = "invalid";
  }

  if (!payload.eventType.trim()) {
    errors.eventType = "required";
  }

  if (!payload.consent) {
    errors.consent = "required";
  }

  return errors;
}

export function hasErrors(errors: LeadValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
