import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PayPalButton from "./PayPalButton";
import { LanguageProvider } from "../context/LanguageContext";

const loadMock = vi.fn();
vi.mock("../services/payments/paypal", () => ({
  loadPayPalSdk: (...args: unknown[]) => loadMock(...args),
}));

function renderButton() {
  return render(
    <LanguageProvider>
      <PayPalButton hostedButtonId="BTN123" planId="esencial" placement="pricing_card" />
    </LanguageProvider>
  );
}

/** Observador que avisa al instante de que el elemento ya está en pantalla. */
class VisibleAlInstante {
  constructor(private callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as never);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  loadMock.mockReset();
  localStorage.setItem("invifty_lang", "es");
  vi.stubGlobal("IntersectionObserver", VisibleAlInstante);
});

describe("botón de pago de PayPal", () => {
  it("pide a PayPal el botón alojado con el identificador del plan", async () => {
    const render_ = vi.fn().mockResolvedValue(undefined);
    const hostedButtons = vi.fn().mockReturnValue({ render: render_ });
    loadMock.mockResolvedValue({ HostedButtons: hostedButtons });

    renderButton();

    await waitFor(() => expect(render_).toHaveBeenCalledWith("#paypal-container-BTN123"));
    expect(hostedButtons).toHaveBeenCalledWith({ hostedButtonId: "BTN123" });
    expect(document.getElementById("paypal-container-BTN123")).not.toBeNull();
  });

  it("explica el paso siguiente: escribir por WhatsApp tras pagar", async () => {
    loadMock.mockResolvedValue({
      HostedButtons: () => ({ render: () => Promise.resolve() }),
    });
    renderButton();
    expect(await screen.findByText(/escríbenos por WhatsApp con los datos de tu evento/i)).toBeInTheDocument();
  });

  it("avisa y permite reintentar cuando PayPal no carga", async () => {
    loadMock.mockRejectedValueOnce(new Error("bloqueado"));
    renderButton();

    expect(await screen.findByRole("alert")).toHaveTextContent(/No pudimos cargar PayPal/i);

    const render_ = vi.fn().mockResolvedValue(undefined);
    loadMock.mockResolvedValueOnce({ HostedButtons: () => ({ render: render_ }) });
    await userEvent.click(screen.getByRole("button", { name: /reintentar/i }));

    await waitFor(() => expect(render_).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  });
});

describe("carga diferida", () => {
  it("no pide el SDK hasta que la tarjeta se acerca a la pantalla", async () => {
    // Observador que nunca avisa: el visitante no ha llegado a los planes.
    class NuncaVisible {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    vi.stubGlobal("IntersectionObserver", NuncaVisible);

    renderButton();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(loadMock).not.toHaveBeenCalled();
  });
});
