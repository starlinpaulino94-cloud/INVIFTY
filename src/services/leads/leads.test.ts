import { describe, expect, it, vi } from "vitest";
import { PRICING_PLANS } from "../../data/pricingData";
import { submitLead } from "./index";
import { LeadPayload, LeadTransport } from "./types";
import { isValidPhone, normalizePhone, validateLead, hasErrors } from "./validation";
import { buildLeadMessage, createWhatsAppTransport } from "./whatsappTransport";

function makeLead(overrides: Partial<LeadPayload> = {}): LeadPayload {
  return {
    name: "Sofía Rodríguez",
    phone: "8092693214",
    eventType: "Boda / Matrimonio",
    language: "es",
    source: "inquiry_form",
    consent: true,
    ...overrides,
  };
}

describe("normalización de teléfonos", () => {
  it("acepta las formas en que se escribe un número dominicano", () => {
    // Todas deben producir el mismo número E.164 sin símbolos.
    expect(normalizePhone("8092693214")).toBe("18092693214");
    expect(normalizePhone("809-269-3214")).toBe("18092693214");
    expect(normalizePhone("(809) 269 3214")).toBe("18092693214");
    expect(normalizePhone("+1 809 269 3214")).toBe("18092693214");
  });

  it("respeta el código de país cuando viene con +", () => {
    expect(normalizePhone("+34 600 123 456")).toBe("34600123456");
  });

  it("devuelve cadena vacía si no hay dígitos", () => {
    expect(normalizePhone("   ")).toBe("");
    expect(normalizePhone("sin número")).toBe("");
  });

  it("valida la longitud internacional", () => {
    expect(isValidPhone("8092693214")).toBe(true);
    expect(isValidPhone("+34600123456")).toBe(true);
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });
});

describe("validación del lead", () => {
  it("acepta un lead completo", () => {
    expect(hasErrors(validateLead(makeLead()))).toBe(false);
  });

  it("exige nombre", () => {
    expect(validateLead(makeLead({ name: "" })).name).toBe("required");
    expect(validateLead(makeLead({ name: "A" })).name).toBe("too_short");
  });

  it("exige un teléfono utilizable", () => {
    expect(validateLead(makeLead({ phone: "" })).phone).toBe("required");
    expect(validateLead(makeLead({ phone: "123" })).phone).toBe("invalid");
  });

  it("exige consentimiento explícito de contacto", () => {
    // Sin permiso no se puede responder al visitante por WhatsApp.
    expect(validateLead(makeLead({ consent: false })).consent).toBe("required");
  });
});

describe("mensaje de WhatsApp", () => {
  it("incluye el contexto que el equipo necesita para responder", () => {
    const message = buildLeadMessage(
      makeLead({ eventDate: "2026-12-05", message: "Queremos algo dorado" })
    );
    expect(message).toContain("Sofía Rodríguez");
    expect(message).toContain("+18092693214");
    expect(message).toContain("Boda / Matrimonio");
    expect(message).toContain("2026-12-05");
    expect(message).toContain("Queremos algo dorado");
  });

  it("resuelve el nombre y el precio del plan desde el catálogo único", () => {
    const popular = PRICING_PLANS.find((p) => p.isPopular)!;
    const message = buildLeadMessage(makeLead({ planId: popular.id }));
    expect(message).toContain(popular.name.es);
    expect(message).toContain(popular.priceDOP.toLocaleString());
  });

  it("marca el plan a medida con 'Desde'", () => {
    const custom = PRICING_PLANS.find((p) => p.isCustom)!;
    expect(buildLeadMessage(makeLead({ planId: custom.id }))).toContain("Desde");
  });

  it("conserva la demo que inspiró al visitante", () => {
    const message = buildLeadMessage(makeLead({ demoId: "boda-camila-y-lucas" }));
    expect(message).toContain("boda-camila-y-lucas");
  });

  it("omite las líneas opcionales vacías", () => {
    const message = buildLeadMessage(makeLead());
    expect(message).not.toContain("Detalles:");
    expect(message).not.toContain("Plan de interés:");
  });

  it("cambia de idioma con el lead", () => {
    expect(buildLeadMessage(makeLead({ language: "en" }))).toContain("*Name:*");
  });
});

describe("transporte de WhatsApp", () => {
  it("devuelve una URL wa.me con el mensaje codificado", async () => {
    const result = await createWhatsAppTransport().send(makeLead());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.mode).toBe("whatsapp");
    expect(result.whatsappUrl).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(result.whatsappUrl!)).toContain("Sofía Rodríguez");
  });

  it("no abre ninguna ventana por su cuenta", async () => {
    // Abrir WhatsApp debe ocurrir dentro del gesto del usuario, en el componente.
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    await createWhatsAppTransport().send(makeLead());
    expect(open).not.toHaveBeenCalled();
  });
});

describe("submitLead", () => {
  it("usa WhatsApp cuando la integración con Studio está apagada", async () => {
    const result = await submitLead(makeLead());
    expect(result.mode).toBe("whatsapp");
  });

  it("cae de vuelta a WhatsApp si la API falla", async () => {
    // Perder el lead sería peor que enviarlo por el canal antiguo.
    const failingApi: LeadTransport = {
      kind: "api",
      send: async () => ({ ok: false, mode: "api", reason: "http_500" }),
    };
    const result = await submitLead(makeLead(), failingApi);
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("whatsapp");
  });

  it("no cae a WhatsApp si el fallo viene del propio WhatsApp", async () => {
    const failingWhatsApp: LeadTransport = {
      kind: "whatsapp",
      send: async () => ({ ok: false, mode: "whatsapp", reason: "boom" }),
    };
    const result = await submitLead(makeLead(), failingWhatsApp);
    expect(result.ok).toBe(false);
  });
});
