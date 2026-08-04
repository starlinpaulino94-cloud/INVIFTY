import { ENV } from "../../config/env";
import { getStoredUtm } from "../analytics/utm";
import { createStudioTransport } from "./studioTransport";
import { LeadPayload, LeadResult, LeadTransport } from "./types";
import { createWhatsAppTransport } from "./whatsappTransport";

export * from "./types";
export { buildLeadMessage } from "./whatsappTransport";
export { hasErrors, isValidPhone, normalizePhone, validateLead } from "./validation";

/**
 * Elige el canal de envío.
 *
 * Hoy siempre devuelve WhatsApp. Cuando Studio publique el endpoint y se
 * enciendan `VITE_STUDIO_API_URL` + `VITE_ENABLE_STUDIO_LEADS`, pasará a la API
 * sin tocar ningún componente.
 */
export function resolveTransport(): LeadTransport {
  return ENV.studioLeadsEnabled ? createStudioTransport() : createWhatsAppTransport();
}

/**
 * Envía un lead por el canal configurado.
 *
 * Si la API de Studio falla, cae de vuelta a WhatsApp: es preferible que el
 * visitante llegue al chat a que pierda la solicitud que acaba de escribir.
 */
export async function submitLead(
  payload: LeadPayload,
  transport: LeadTransport = resolveTransport()
): Promise<LeadResult> {
  const enriched: LeadPayload = {
    ...payload,
    utm: payload.utm ?? getStoredUtm(),
  };

  const result = await transport.send(enriched);

  if (!result.ok && transport.kind === "api") {
    return createWhatsAppTransport().send(enriched);
  }

  return result;
}
