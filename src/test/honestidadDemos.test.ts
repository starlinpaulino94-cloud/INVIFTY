import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const DEMOS_DIR = join(process.cwd(), "src/demos");
const demoFiles = readdirSync(DEMOS_DIR).filter(
  (f) => f.endsWith(".tsx") && !f.includes(".test.")
);

function read(file: string): string {
  return readFileSync(join(DEMOS_DIR, file), "utf8");
}

/**
 * Elimina comentarios antes de buscar frases prohibidas.
 *
 * Lo que importa es el texto que ve el visitante. Un comentario que explica
 * *por qué* una frase sería engañosa no es una infracción — y sin esta limpieza
 * la propia documentación del arreglo hacía fallar la prueba.
 */
function visibleText(file: string): string {
  return read(file)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/**
 * Las demos no tienen backend: su formulario de RSVP únicamente abre WhatsApp
 * con el mensaje redactado. Afirmar que los datos quedaron guardados es
 * engañoso para el visitante, y era el caso en tres muestras
 * (`CumpleDemo` decía «Hemos registrado tu respuesta»).
 */
describe("honestidad del RSVP en las demos", () => {
  const MISLEADING = [
    /hemos registrado/i,
    /hemos procesado/i,
    /datos guardados/i,
    /respuesta guardada/i,
    /registro (confirmado|completado|guardado)/i,
    /we (have )?(saved|recorded|stored)/i,
    /your (rsvp|data) (has been|was) (saved|recorded|stored)/i,
  ];

  it("ninguna demo afirma que guarda o procesa los datos", () => {
    const offenders: string[] = [];

    for (const file of demoFiles) {
      const source = visibleText(file);
      for (const pattern of MISLEADING) {
        const match = source.match(pattern);
        if (match) offenders.push(`${file}: "${match[0]}"`);
      }
    }

    expect(
      offenders,
      `estas demos prometen que los datos quedan guardados:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("toda demo con RSVP explica que sólo se abre WhatsApp", () => {
    const offenders: string[] = [];

    for (const file of demoFiles) {
      const source = read(file);
      const hasRsvp = /createRsvpWhatsAppUrl/.test(source);
      if (!hasRsvp) continue;

      // Vale con el componente compartido o con un texto propio equivalente.
      const explains =
        /DemoRsvpNotice/.test(source) ||
        /se abri[óo] WhatsApp/i.test(source) ||
        /WhatsApp opened/i.test(source) ||
        /qued[óo] redactad/i.test(source) ||
        /opened in WhatsApp/i.test(source);

      if (!explains) offenders.push(file);
    }

    expect(
      offenders,
      `estas demos envían el RSVP sin explicar que sólo se abre WhatsApp: ${offenders.join(", ")}`
    ).toEqual([]);
  });
});

describe("elementos obligatorios de cada demo", () => {
  it("ofrece siempre una vía de retorno a la web", () => {
    for (const file of demoFiles) {
      expect(read(file), `${file} no permite volver al inicio`).toContain("onBackToHome");
    }
  });

  it("incluye la marca de agua para solicitar una invitación similar", () => {
    // Puede venir directamente o a través de DemoTopBar, que la incorpora.
    for (const file of demoFiles) {
      const source = read(file);
      const ofrece =
        source.includes("createDemoWatermarkWhatsAppUrl") || source.includes("DemoTopBar");
      expect(ofrece, `${file} no ofrece pedir una invitación similar`).toBe(true);
    }
  });

  it("arranca siempre con la música apagada", () => {
    // Una demo que suena sola al abrirse es intrusiva y la bloquea el navegador.
    for (const file of demoFiles) {
      const source = read(file);
      if (!/isPlayingMusic/.test(source)) continue;
      expect(
        source,
        `${file} no arranca con la música apagada`
      ).toMatch(/useState\(false\)[^\n]*\n?|isPlayingMusic.*useState\(false\)/);
      expect(source).toContain("useState(false)");
      expect(/isPlayingMusic.*useState\(true\)/.test(source), `${file} arranca sonando`).toBe(
        false
      );
    }
  });
});
