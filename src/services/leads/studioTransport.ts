import { ENV } from "../../config/env";
import { LeadPayload, LeadResult, LeadTransport } from "./types";
import { normalizePhone } from "./validation";

/**
 * Envío del lead a la API pública de Invifty Studio.
 *
 * ⚠️ Este transporte está IMPLEMENTADO pero DESACTIVADO. Sólo se usa si
 * `VITE_STUDIO_API_URL` y `VITE_ENABLE_STUDIO_LEADS` están configurados, y
 * Studio todavía no expone el endpoint. Ver docs/integracion-futura-studio.md.
 *
 * No lleva ninguna clave de API: el endpoint debe ser público con rate limiting
 * del lado del servidor. Un secreto en el frontend sería visible para cualquiera.
 */
export function createStudioTransport(): LeadTransport {
  return {
    kind: "api",

    async send(payload: LeadPayload): Promise<LeadResult> {
      if (!ENV.studioApiUrl) {
        return { ok: false, mode: "api", reason: "not_configured" };
      }

      // Clave de idempotencia: si el visitante pulsa dos veces o la red reintenta,
      // Studio debe reconocer el duplicado en vez de crear dos pedidos.
      const idempotencyKey = `${normalizePhone(payload.phone)}:${payload.eventType}:${payload.eventDate ?? ""}`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        const response = await fetch(`${ENV.studioApiUrl}/api/public/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({
            ...payload,
            phone: normalizePhone(payload.phone),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          return { ok: false, mode: "api", reason: `http_${response.status}` };
        }
        return { ok: true, mode: "api" };
      } catch (error) {
        const reason = error instanceof DOMException && error.name === "AbortError" ? "timeout" : "network";
        return { ok: false, mode: "api", reason };
      }
    },
  };
}
