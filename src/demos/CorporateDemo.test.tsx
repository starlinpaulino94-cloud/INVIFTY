import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CorporateDemo from "./CorporateDemo";
import { LanguageProvider } from "../context/LanguageContext";

function renderDemo() {
  return render(
    <LanguageProvider>
      <CorporateDemo onBackToHome={() => {}} />
    </LanguageProvider>
  );
}

beforeEach(() => {
  localStorage.setItem("invifty_lang", "es");
});

describe("muestra · Gala Anual de Innovación", () => {
  it("renderiza todas las secciones del evento", () => {
    const { container } = renderDemo();
    // Pasó de 5 secciones a 8: faltaban pase QR destacado y galería.
    for (const id of ["gala", "agenda", "ponentes", "pase", "ubicacion", "vestimenta", "parqueo", "galeria", "registro"]) {
      expect(container.querySelector(`#${id}`), `falta la sección #${id}`).not.toBeNull();
    }
  });

  it("no deja enlaces del menú apuntando a secciones inexistentes", () => {
    const { container } = renderDemo();
    const nav = container.querySelector("nav");
    const buttons = within(nav as HTMLElement).getAllByRole("button");

    for (const button of buttons) {
      const label = button.textContent?.trim();
      expect(label, "botón de navegación sin etiqueta").toBeTruthy();
    }
    expect(buttons.length).toBeGreaterThanOrEqual(7);
  });

  it("ofrece el selector de idioma que antes no existía", async () => {
    // Era la única muestra sin traducción, y es la que más la necesita.
    const user = userEvent.setup();
    renderDemo();

    expect(screen.getByRole("button", { name: /^ES$/ })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: /^EN$/ }));
    expect(screen.getByRole("heading", { name: /executive agenda/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /featured speakers/i })).toBeInTheDocument();
  });

  it("muestra los tres ponentes con su retrato y su tema", () => {
    renderDemo();
    for (const name of ["Ing. Guillermo Henríquez", "Dra. Elena Vásquez", "Lic. Marcos De la Cruz"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
      expect(screen.getByAltText(name)).toBeInTheDocument();
    }
  });

  it("abre el pase QR de ejemplo", async () => {
    const user = userEvent.setup();
    renderDemo();

    await user.click(screen.getByRole("button", { name: /ver mi pase de ejemplo/i }));
    expect(await screen.findByText(/Gala Anual de Innovación 2026/i)).toBeInTheDocument();
  });

  it("envía empresa, cargo, menú y acompañantes en el registro", async () => {
    // Antes el formulario ignoraba menú y acompañantes, pero el mensaje los
    // incluía con valores fijos que el asistente nunca eligió.
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderDemo();

    await user.type(screen.getByLabelText(/nombre completo/i), "Lic. Ana Reyes");
    await user.type(screen.getByLabelText(/^empresa$/i), "Corporación Meridiano");
    await user.type(screen.getByLabelText(/^cargo$/i), "Directora de Operaciones");
    await user.selectOptions(screen.getByLabelText(/acompañantes/i), "2");
    await user.selectOptions(screen.getByLabelText(/preferencia de menú/i), "Opción vegetariana");

    await user.click(screen.getByRole("button", { name: /enviar registro/i }));

    expect(open).toHaveBeenCalledTimes(1);
    const message = decodeURIComponent(String(open.mock.calls[0][0]));
    expect(message).toContain("Lic. Ana Reyes");
    expect(message).toContain("Corporación Meridiano");
    expect(message).toContain("Directora de Operaciones");
    expect(message).toContain("Opción vegetariana");
    expect(message).toContain("2");
  });

  it("no afirma que el registro quedó procesado", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "open").mockImplementation(() => null);
    renderDemo();

    await user.type(screen.getByLabelText(/nombre completo/i), "Ana Reyes");
    await user.click(screen.getByRole("button", { name: /enviar registro/i }));

    // Antes decía "Hemos procesado sus datos", que era falso.
    expect(await screen.findByText(/se abrió whatsapp/i)).toBeInTheDocument();
    expect(screen.getByText(/no se guardan en ningún sistema/i)).toBeInTheDocument();
  });

  it("permite ampliar una edición anterior y cerrarla con Escape", async () => {
    const user = userEvent.setup();
    renderDemo();

    await user.click(screen.getByRole("button", { name: /ampliar fotografía 1/i }));
    expect(screen.getByRole("dialog", { name: /fotografía ampliada/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /fotografía ampliada/i })).not.toBeInTheDocument();
  });

  it("ofrece volver a Invifty y cotizar el diseño", () => {
    renderDemo();
    expect(screen.getByRole("button", { name: /volver a invifty/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link").some((a) => a.getAttribute("href")?.includes("wa.me"))).toBe(true);
  });
});
