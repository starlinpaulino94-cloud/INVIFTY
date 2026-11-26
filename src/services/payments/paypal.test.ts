import { beforeEach, describe, expect, it, vi } from "vitest";
import { PRICING_PLANS } from "../../data/pricingData";
import {
  PAYPAL_HOSTED_BUTTONS,
  buildSdkUrl,
  getHostedButtonId,
  loadPayPalSdk,
  resetPayPalSdkForTests,
} from "./paypal";

describe("botones de pago por plan", () => {
  it("el plan Esencial tiene su botón de PayPal", () => {
    expect(getHostedButtonId("esencial")).toBe("Q39565674TWKA");
  });

  it("el plan Popular tiene su botón de PayPal", () => {
    expect(getHostedButtonId("popular")).toBe("7CLS9XVM5SW7Q");
  });

  it("el plan Premium tiene su botón de PayPal", () => {
    expect(getHostedButtonId("premium")).toBe("S6Q3NJLBMEBTS");
  });

  it("un plan sin botón configurado no ofrece pago en línea", () => {
    expect(getHostedButtonId("no-existe")).toBeUndefined();
  });

  it("cada botón configurado pertenece a un plan que existe en el catálogo", () => {
    const ids = PRICING_PLANS.map((plan) => plan.id);
    for (const planId of Object.keys(PAYPAL_HOSTED_BUTTONS)) {
      expect(ids, `el plan "${planId}" no existe en pricingData`).toContain(planId);
    }
  });
});

describe("dirección del SDK", () => {
  it("pide sólo botones alojados, en dólares y sin Venmo", () => {
    const url = new URL(buildSdkUrl("CLIENTE-123"));
    expect(url.origin + url.pathname).toBe("https://www.paypal.com/sdk/js");
    expect(url.searchParams.get("client-id")).toBe("CLIENTE-123");
    expect(url.searchParams.get("components")).toBe("hosted-buttons");
    expect(url.searchParams.get("currency")).toBe("USD");
    expect(url.searchParams.get("disable-funding")).toBe("venmo");
  });
});

describe("carga del SDK", () => {
  beforeEach(() => {
    resetPayPalSdkForTests();
    delete window.paypal;
    document.head.querySelectorAll("script[src*='paypal.com']").forEach((el) => el.remove());
  });

  it("descarga el script una sola vez aunque lo pidan varios botones a la vez", async () => {
    const appendSpy = vi.spyOn(document.head, "appendChild");

    const primera = loadPayPalSdk("CLIENTE-123");
    const segunda = loadPayPalSdk("CLIENTE-123");

    const scripts = appendSpy.mock.calls
      .map(([node]) => node as HTMLScriptElement)
      .filter((node) => node.tagName === "SCRIPT" && node.src.includes("paypal.com"));
    expect(scripts).toHaveLength(1);

    window.paypal = { HostedButtons: vi.fn() };
    scripts[0].onload?.(new Event("load"));

    await expect(primera).resolves.toBe(window.paypal);
    await expect(segunda).resolves.toBe(window.paypal);
    appendSpy.mockRestore();
  });

  it("permite reintentar si la primera carga falla", async () => {
    const appendSpy = vi.spyOn(document.head, "appendChild");

    const fallida = loadPayPalSdk("CLIENTE-123");
    const script = appendSpy.mock.calls
      .map(([node]) => node as HTMLScriptElement)
      .find((node) => node.tagName === "SCRIPT")!;
    script.onerror?.(new Event("error"));
    await expect(fallida).rejects.toThrow();

    // Tras el fallo, un nuevo intento vuelve a pedir el script en vez de
    // devolver para siempre la promesa rechazada.
    const reintento = loadPayPalSdk("CLIENTE-123");
    const scripts = appendSpy.mock.calls
      .map(([node]) => node as HTMLScriptElement)
      .filter((node) => node.tagName === "SCRIPT" && node.src.includes("paypal.com"));
    expect(scripts).toHaveLength(2);

    window.paypal = { HostedButtons: vi.fn() };
    scripts[1].onload?.(new Event("load"));
    await expect(reintento).resolves.toBeDefined();
    appendSpy.mockRestore();
  });

  it("reutiliza el SDK si la página ya lo tiene cargado", async () => {
    const appendSpy = vi.spyOn(document.head, "appendChild");
    window.paypal = { HostedButtons: vi.fn() };

    await expect(loadPayPalSdk("CLIENTE-123")).resolves.toBe(window.paypal);
    expect(appendSpy).not.toHaveBeenCalled();
    appendSpy.mockRestore();
  });
});
