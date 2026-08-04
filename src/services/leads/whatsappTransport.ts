import { buildWhatsAppUrl } from "../../config";
import { PRICING_PLANS } from "../../data/pricingData";
import { LeadPayload, LeadResult, LeadTransport } from "./types";
import { normalizePhone } from "./validation";

/** Nombre legible de un plan a partir de su id, usando el catálogo único. */
function planName(planId: string | undefined, isEs: boolean): string | undefined {
  if (!planId) return undefined;
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return planId;
  const name = isEs ? plan.name.es : plan.name.en;
  const price = isEs ? `RD$${plan.priceDOP.toLocaleString()} DOP` : `$${plan.priceUSD} USD`;
  const prefix = plan.isCustom ? (isEs ? "Desde " : "From ") : "";
  return `${name} — ${prefix}${price}`;
}

/** Redacta el mensaje de WhatsApp con todo el contexto del lead. */
export function buildLeadMessage(payload: LeadPayload): string {
  const isEs = payload.language === "es";
  const plan = planName(payload.planId, isEs);

  const lines = isEs
    ? [
        "*SOLICITUD DE INVITACIÓN — INVIFTY*",
        "--------------------------------",
        `👤 *Nombre:* ${payload.name.trim()}`,
        `📱 *WhatsApp:* +${normalizePhone(payload.phone)}`,
        `🎉 *Evento:* ${payload.eventType}`,
        `📅 *Fecha:* ${payload.eventDate || "Por definir"}`,
        plan ? `💎 *Plan de interés:* ${plan}` : null,
        payload.demoId ? `✨ *Muestra que le gustó:* ${payload.demoId}` : null,
        payload.message?.trim() ? `📝 *Detalles:* ${payload.message.trim()}` : null,
        "--------------------------------",
        "Hola Invifty, envío mi solicitud desde la página web y me gustaría recibir asesoría para mi evento.",
      ]
    : [
        "*INVITATION REQUEST — INVIFTY*",
        "--------------------------------",
        `👤 *Name:* ${payload.name.trim()}`,
        `📱 *WhatsApp:* +${normalizePhone(payload.phone)}`,
        `🎉 *Event:* ${payload.eventType}`,
        `📅 *Date:* ${payload.eventDate || "To be defined"}`,
        plan ? `💎 *Plan of interest:* ${plan}` : null,
        payload.demoId ? `✨ *Sample they liked:* ${payload.demoId}` : null,
        payload.message?.trim() ? `📝 *Details:* ${payload.message.trim()}` : null,
        "--------------------------------",
        "Hello Invifty, I'm sending my request from the website and would like advice for my event.",
      ];

  return lines.filter((line): line is string => line !== null).join("\n");
}

/**
 * Canal de envío actual: WhatsApp.
 *
 * No hay backend, así que este transporte NO guarda el lead en ninguna parte:
 * únicamente construye el enlace con el mensaje ya redactado. Por eso devuelve
 * la URL en vez de abrirla — quien llama debe abrirla dentro del gesto del
 * usuario, y la interfaz debe decir que se abrió WhatsApp, no que "se guardó".
 */
export function createWhatsAppTransport(): LeadTransport {
  return {
    kind: "whatsapp",
    async send(payload: LeadPayload): Promise<LeadResult> {
      const url = buildWhatsAppUrl(buildLeadMessage(payload));
      return { ok: true, mode: "whatsapp", whatsappUrl: url };
    },
  };
}
