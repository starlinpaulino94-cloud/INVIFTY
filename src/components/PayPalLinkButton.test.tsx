import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PayPalLinkButton from "./PayPalLinkButton";
import { LanguageProvider } from "../context/LanguageContext";

function renderButton() {
  return render(
    <LanguageProvider>
      <PayPalLinkButton linkId="LINK123" planId="a-medida" placement="pricing_custom" />
    </LanguageProvider>
  );
}

beforeEach(() => {
  localStorage.setItem("invifty_lang", "es");
});

describe("enlace de pago de PayPal", () => {
  it("envía a la página de pago de PayPal en una pestaña nueva y segura", () => {
    const { container } = renderButton();
    const form = container.querySelector("form")!;
    expect(form.getAttribute("action")).toBe("https://www.paypal.com/ncp/payment/LINK123");
    expect(form.getAttribute("method")).toBe("post");
    expect(form.getAttribute("target")).toBe("_blank");
    expect(form.getAttribute("rel")).toContain("noopener");
  });

  it("muestra el botón de pago y el aviso del siguiente paso", () => {
    renderButton();
    expect(screen.getByRole("button", { name: /Pagar ahora/i })).toBeTruthy();
    expect(screen.getByText(/escríbenos por WhatsApp con los datos de tu evento/i)).toBeTruthy();
  });

  it("no carga ningún script de terceros", () => {
    renderButton();
    expect(document.querySelector('script[src*="paypal.com"]')).toBeNull();
  });

  it("no promete tarjetas ni otros medios de pago", () => {
    const { container } = renderButton();
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).not.toMatch(/tarjeta|card|zelle|venmo/i);
  });
});
