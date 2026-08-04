import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdultCumpleDemo from "./AdultCumpleDemo";
import { LanguageProvider } from "../context/LanguageContext";

function renderDemo() {
  return render(
    <LanguageProvider>
      <AdultCumpleDemo onBackToHome={() => {}} />
    </LanguageProvider>
  );
}

beforeEach(() => {
  localStorage.setItem("invifty_lang", "es");
  // jsdom no implementa la Web Audio API. Sin este doble, `toggleMusic` lanza,
  // se traga el error y la música nunca cambia de estado.
  vi.stubGlobal(
    "AudioContext",
    class {
      currentTime = 0;
      destination = {};
      createOscillator() {
        return { type: "", frequency: { setValueAtTime() {} }, connect() {}, start() {} };
      }
      createGain() {
        return { gain: { setValueAtTime() {} }, connect() {} };
      }
      close() {}
    }
  );
});

describe("muestra · 50 años de Roberto", () => {
  it("renderiza todas las secciones de la invitación", () => {
    const { container } = renderDemo();
    // La muestra pasó de 3 secciones a 7: homenaje, programa y galería eran
    // capacidades que el catálogo prometía y no estaban.
    for (const id of ["evento", "homenaje", "programa", "lugar", "galeria", "muro", "rsvp"]) {
      expect(container.querySelector(`#${id}`), `falta la sección #${id}`).not.toBeNull();
    }
  });

  it("no deja ningún enlace del menú apuntando a una sección inexistente", () => {
    // El menú anunciaba "Muro de Brindis" pero la sección no existía:
    // pulsarlo no hacía nada.
    const { container } = renderDemo();
    const nav = container.querySelector("nav");
    expect(nav).not.toBeNull();

    const labels = within(nav as HTMLElement)
      .getAllByRole("button")
      .map((b) => b.textContent?.trim());

    expect(labels).toContain("Muro de Brindis");
    expect(labels.length).toBeGreaterThanOrEqual(7);
  });

  it("arranca con la música apagada y permite encenderla", async () => {
    const user = userEvent.setup();
    renderDemo();

    const play = screen.getByRole("button", { name: /reproducir la música/i });
    expect(play).toHaveAttribute("aria-pressed", "false");
    await user.click(play);
    expect(screen.getByRole("button", { name: /silenciar la música/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("recoge en el RSVP todos los datos que el mensaje de WhatsApp envía", async () => {
    // Antes el formulario sólo pedía nombre y asistencia, pero el mensaje
    // incluía acompañantes y menú con valores fijos que el invitado nunca elegía.
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderDemo();

    await user.type(screen.getByLabelText(/nombre completo/i), "Familia Bermúdez");
    await user.selectOptions(screen.getByLabelText(/nº de personas/i), "3");
    await user.selectOptions(screen.getByLabelText(/preferencia de menú/i), "Opción vegetariana");
    await user.type(screen.getByLabelText(/alergias o notas/i), "Sin mariscos");
    await user.type(screen.getByLabelText(/pide una canción/i), "Bachata Rosa");

    await user.click(screen.getByRole("button", { name: /enviar confirmación/i }));

    expect(open).toHaveBeenCalledTimes(1);
    const message = decodeURIComponent(String(open.mock.calls[0][0]));
    expect(message).toContain("Familia Bermúdez");
    expect(message).toContain("3");
    expect(message).toContain("Opción vegetariana");
    expect(message).toContain("Sin mariscos");
    expect(message).toContain("Bachata Rosa");
  });

  it("publica un brindis en el muro y lo muestra", async () => {
    const user = userEvent.setup();
    renderDemo();

    await user.type(screen.getByLabelText(/tu nombre/i), "Los Pérez");
    await user.type(screen.getByLabelText(/tu brindis/i), "¡Por otros cincuenta!");
    await user.click(screen.getByRole("button", { name: /publicar brindis/i }));

    expect(await screen.findByText(/¡Por otros cincuenta!/)).toBeInTheDocument();
    expect(screen.getByText(/Los Pérez/)).toBeInTheDocument();
  });

  it("no promete que el brindis quede guardado", async () => {
    const user = userEvent.setup();
    renderDemo();

    await user.type(screen.getByLabelText(/tu nombre/i), "Los Pérez");
    await user.type(screen.getByLabelText(/tu brindis/i), "Salud");
    await user.click(screen.getByRole("button", { name: /publicar brindis/i }));

    // Es una muestra sin backend: el aviso debe hablar en condicional.
    expect(await screen.findByRole("status")).toHaveTextContent(/en una invitación real/i);
  });

  it("permite ampliar una fotografía de la galería y cerrarla con Escape", async () => {
    const user = userEvent.setup();
    renderDemo();

    await user.click(screen.getByRole("button", { name: /ampliar fotografía 1/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ofrece volver a Invifty y pedir un diseño similar", () => {
    renderDemo();
    expect(screen.getByRole("button", { name: /volver/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link").some((a) => a.getAttribute("href")?.includes("wa.me"))).toBe(
      true
    );
  });

  it("traduce la invitación al inglés", async () => {
    const user = userEvent.setup();
    renderDemo();

    await user.click(screen.getByRole("button", { name: /^EN$/ }));
    expect(screen.getByText(/Half a century in six moments/i)).toBeInTheDocument();
    // "Toast wall" aparece en el menú y en el título de la sección.
    expect(screen.getByRole("heading", { name: /toast wall/i })).toBeInTheDocument();
  });
});
