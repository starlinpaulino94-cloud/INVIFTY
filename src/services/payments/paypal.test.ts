import { describe, expect, it } from "vitest";
import { PRICING_PLANS } from "../../data/pricingData";
import {
  PAYPAL_PAYMENT_LINKS,
  buildPaymentLinkUrl,
  getPaymentLinkId,
  hasOnlinePayment,
} from "./paypal";

describe("enlaces de pago por plan", () => {
  it.each([
    ["esencial", "Q39565674TWKA"],
    ["popular", "7CLS9XVM5SW7Q"],
    ["premium", "S6Q3NJLBMEBTS"],
    ["a-medida", "DJJ8H2NDVZJNN"],
  ])("el plan %s paga con su enlace de PayPal", (planId, linkId) => {
    expect(getPaymentLinkId(planId)).toBe(linkId);
    expect(buildPaymentLinkUrl(linkId)).toBe(`https://www.paypal.com/ncp/payment/${linkId}`);
  });

  it("un plan sin enlace configurado no ofrece pago en línea", () => {
    expect(getPaymentLinkId("no-existe")).toBeUndefined();
    expect(hasOnlinePayment("no-existe")).toBe(false);
  });

  it("cada enlace configurado pertenece a un plan que existe en el catálogo", () => {
    const ids = PRICING_PLANS.map((plan) => plan.id);
    for (const planId of Object.keys(PAYPAL_PAYMENT_LINKS)) {
      expect(ids, `el plan "${planId}" no existe en pricingData`).toContain(planId);
    }
  });

  it("todos los planes del catálogo se pueden pagar en línea", () => {
    for (const plan of PRICING_PLANS) {
      expect(hasOnlinePayment(plan.id), `el plan "${plan.id}" no tiene pago`).toBe(true);
    }
  });

  it("cada plan tiene su propio enlace (no se reutiliza uno para dos precios)", () => {
    const codigos = Object.values(PAYPAL_PAYMENT_LINKS);
    expect(new Set(codigos).size).toBe(codigos.length);
  });

  it("el código del enlace se codifica en la dirección", () => {
    expect(buildPaymentLinkUrl("A/B ?")).toBe("https://www.paypal.com/ncp/payment/A%2FB%20%3F");
  });
});
