import { describe, expect, it } from "vitest";
import { translations } from "./LanguageContext";

describe("traducciones", () => {
  const esKeys = Object.keys(translations.es);
  const enKeys = Object.keys(translations.en);

  it("cubre en inglés todas las claves del español", () => {
    // Una clave sin traducir aparece en pantalla como el identificador crudo.
    const missing = esKeys.filter((key) => !enKeys.includes(key));
    expect(missing, `claves sin traducir al inglés: ${missing.join(", ")}`).toEqual([]);
  });

  it("no tiene claves en inglés que falten en español", () => {
    const missing = enKeys.filter((key) => !esKeys.includes(key));
    expect(missing, `claves sin versión en español: ${missing.join(", ")}`).toEqual([]);
  });

  it("no deja ningún texto vacío", () => {
    for (const [lang, dict] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${lang}.${key} está vacío`).not.toBe("");
      }
    }
  });

  it("ya no promete entregas en 48 horas", () => {
    // La promesa vigente es de 3 a 5 días hábiles; ver docs/consolidacion-repositorio.md.
    for (const [lang, dict] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value, `${lang}.${key} menciona 48 horas`).not.toMatch(/48\s*(horas|hours)/i);
      }
    }
  });
});
