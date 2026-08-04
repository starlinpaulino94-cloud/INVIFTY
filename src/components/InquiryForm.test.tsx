import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InquiryForm from "./InquiryForm";
import { LanguageProvider } from "../context/LanguageContext";
import { SelectionProvider } from "../context/SelectionContext";
import { PRICING_PLANS } from "../data/pricingData";

function renderForm() {
  return render(
    <LanguageProvider>
      <SelectionProvider>
        <InquiryForm />
      </SelectionProvider>
    </LanguageProvider>
  );
}

/** Rellena los campos obligatorios con datos válidos. */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/nombre completo/i), "Sofía Rodríguez");
  await user.type(screen.getByLabelText("WhatsApp *"), "8092693214");
  await user.click(screen.getByLabelText(/acepto que invifty me contacte/i));
}

beforeEach(() => {
  sessionStorage.clear();
  // jsdom declara navigator.language = "en-US", así que el contexto arrancaría
  // en inglés. Estas pruebas comprueban la copia en español.
  localStorage.setItem("invifty_lang", "es");
});

describe("formulario de captación — validación", () => {
  it("no envía nada si faltan los campos obligatorios", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderForm();

    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it("asocia el mensaje de error a su campo para lectores de pantalla", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    const nameField = screen.getByLabelText(/nombre completo/i);
    await waitFor(() => expect(nameField).toHaveAttribute("aria-invalid", "true"));
    expect(nameField).toHaveAccessibleDescription(/obligatorio/i);
  });

  it("rechaza un teléfono demasiado corto", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/nombre completo/i), "Sofía Rodríguez");
    await user.type(screen.getByLabelText("WhatsApp *"), "123");
    await user.click(screen.getByLabelText(/acepto que invifty me contacte/i));
    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    expect(await screen.findByText(/revisa el número/i)).toBeInTheDocument();
  });

  it("exige el consentimiento de contacto", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderForm();

    await user.type(screen.getByLabelText(/nombre completo/i), "Sofía Rodríguez");
    await user.type(screen.getByLabelText("WhatsApp *"), "8092693214");
    // Sin marcar la casilla de consentimiento.
    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    expect(await screen.findByText(/necesitamos tu permiso/i)).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it("limpia el error del campo al corregirlo", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /solicitar información/i }));
    const nameField = await screen.findByLabelText(/nombre completo/i);
    await waitFor(() => expect(nameField).toHaveAttribute("aria-invalid", "true"));

    await user.type(nameField, "Sofía");
    await waitFor(() => expect(nameField).toHaveAttribute("aria-invalid", "false"));
  });
});

describe("formulario de captación — envío por WhatsApp", () => {
  it("abre WhatsApp con el contexto del lead", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    await waitFor(() => expect(open).toHaveBeenCalledTimes(1));
    const url = decodeURIComponent(String(open.mock.calls[0][0]));
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+/);
    expect(url).toContain("Sofía Rodríguez");
    expect(url).toContain("+18092693214");
  });

  it("dice que se abrió WhatsApp, sin afirmar que el lead quedó guardado", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "open").mockImplementation(() => null);
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    // Sin backend, prometer "solicitud registrada" sería engañoso.
    expect(await screen.findByText(/se abrió whatsapp con tu solicitud/i)).toBeInTheDocument();
    expect(screen.getByText(/hasta entonces no la habremos recibido/i)).toBeInTheDocument();
  });

  it("permite reabrir WhatsApp si no se abrió solo", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "open").mockImplementation(() => null);
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    const retry = await screen.findByRole("link", { name: /abrir whatsapp de nuevo/i });
    expect(retry).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("no duplica el envío con un doble clic", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderForm();

    await fillValidForm(user);
    const submit = screen.getByRole("button", { name: /solicitar información/i });
    await user.dblClick(submit);

    await waitFor(() => expect(open).toHaveBeenCalledTimes(1));
  });
});

describe("formulario de captación — contexto conservado", () => {
  it("preselecciona el plan que el visitante eligió en la sección de precios", async () => {
    const premium = PRICING_PLANS.find((p) => p.id === "premium")!;
    sessionStorage.setItem("invifty:selection", JSON.stringify({ planId: premium.id }));

    renderForm();

    const select = screen.getByLabelText(/plan de interés/i) as HTMLSelectElement;
    expect(select.value).toBe(premium.id);
  });

  it("muestra e incluye la demo que inspiró al visitante", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    sessionStorage.setItem(
      "invifty:selection",
      JSON.stringify({ demoId: "boda-camila-y-lucas" })
    );

    renderForm();
    expect(screen.getByText(/boda-camila-y-lucas/)).toBeInTheDocument();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /solicitar información/i }));

    await waitFor(() => expect(open).toHaveBeenCalled());
    expect(decodeURIComponent(String(open.mock.calls[0][0]))).toContain("boda-camila-y-lucas");
  });

  it("ofrece todos los planes del catálogo más la opción de asesoría", () => {
    renderForm();
    const select = screen.getByLabelText(/plan de interés/i);
    // Un plan nuevo en el catálogo aparece aquí sin tocar el formulario.
    expect(select.querySelectorAll("option")).toHaveLength(PRICING_PLANS.length + 1);
  });
});
