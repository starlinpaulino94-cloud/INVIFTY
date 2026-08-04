import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { LanguageProvider } from "../context/LanguageContext";

function renderNavbar() {
  return render(
    <LanguageProvider>
      <Navbar />
    </LanguageProvider>
  );
}

const openMenu = () => screen.getByRole("button", { name: /abrir menú/i });

beforeEach(() => {
  localStorage.setItem("invifty_lang", "es");
  document.body.style.overflow = "";
});

describe("menú móvil — accesibilidad", () => {
  it("expone su estado con aria-expanded", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = openMenu();
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: /cerrar menú/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("asocia el botón con el cajón mediante aria-controls", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(openMenu());

    const toggle = screen.getByRole("button", { name: /cerrar menú/i });
    const controlsId = toggle.getAttribute("aria-controls");
    expect(controlsId).toBe("menu-movil");
    expect(document.getElementById(controlsId!)).toBeInTheDocument();
  });

  it("se cierra al pulsar Escape y devuelve el foco al botón", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const toggle = openMenu();
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /cerrar menú/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    // Quien navega con teclado no debe quedarse sin foco tras cerrar.
    const reopened = screen.getByRole("button", { name: /abrir menú/i });
    expect(reopened).toHaveAttribute("aria-expanded", "false");
    expect(reopened).toHaveFocus();
  });

  it("bloquea el scroll del fondo mientras está abierto", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(openMenu());
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
  });

  it("da un nombre accesible al cajón de navegación", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(openMenu());
    expect(screen.getByRole("navigation", { name: /menú principal/i })).toBeInTheDocument();
  });
});

describe("selector de idioma", () => {
  it("comunica el idioma activo con aria-pressed, no sólo con color", () => {
    // El estado activo se marcaba únicamente con el fondo dorado, invisible
    // para un lector de pantalla.
    renderNavbar();

    const esButtons = screen.getAllByRole("button", { name: /^ES/ });
    expect(esButtons.length).toBeGreaterThan(0);
    for (const button of esButtons) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }

    for (const button of screen.getAllByRole("button", { name: /^EN/ })) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("invierte el estado al cambiar de idioma", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getAllByRole("button", { name: /^EN/ })[0]);

    for (const button of screen.getAllByRole("button", { name: /^EN/ })) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }
  });
});
