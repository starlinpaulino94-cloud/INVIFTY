import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

/**
 * HONESTIDAD DE LAS AFIRMACIONES COMERCIALES
 * ==========================================
 * Impide que vuelvan a colarse afirmaciones que la web hizo sin ser ciertas.
 *
 * No es una prueba de estilo. Cada regla de aquí corresponde a algo que
 * **estuvo publicado y era falso**, y que un cliente descubre justo en el peor
 * momento: al ir a pagar, o al buscar quién responde por el servicio.
 */

/** Archivos de la web comercial. Las demos son ficción y van aparte. */
function collectSource(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(join(ROOT, dir))) {
    const rel = `${dir}/${entry}`;
    if (statSync(join(ROOT, rel)).isDirectory()) {
      collectSource(rel, acc);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      acc.push(rel);
    }
  }
  return acc;
}

const COMMERCIAL_FILES = [
  ...collectSource("src/components"),
  ...collectSource("src/pages"),
  ...collectSource("src/data"),
  ...collectSource("src/config"),
];

/** Texto visible: se quitan los comentarios para no medir lo que explica el porqué. */
function visibleText(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
}

describe("medios de pago", () => {
  // Se anunciaban tarjetas de crédito/débito, Zelle y PayPal en cuatro sitios
  // (términos, FAQ, tabla de precios y una página SEO). El único medio
  // disponible es la transferencia bancaria. Prometer una forma de pago que no
  // existe rompe la venta exactamente en el momento de cobrar.
  const FORBIDDEN = [
    { pattern: /\bZelle\b/, label: "Zelle" },
    { pattern: /\bPayPal\b/i, label: "PayPal" },
    { pattern: /tarjetas?\s+de\s+cr[ée]dito/i, label: "tarjeta de crédito" },
    { pattern: /credit\/debit\s+cards?/i, label: "credit/debit card" },
  ];

  it("no anuncia medios de pago que Invifty no acepta", () => {
    const offenders: string[] = [];

    for (const file of COMMERCIAL_FILES) {
      const text = visibleText(readFileSync(join(ROOT, file), "utf8"));
      for (const { pattern, label } of FORBIDDEN) {
        if (pattern.test(text)) offenders.push(`${file}: menciona ${label}`);
      }
    }

    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});

describe("identidad de la empresa", () => {
  // El pie de página declaraba «Un producto de Vitrexi Technologies». Esa
  // empresa no existe y no tiene relación con este proyecto. Atribuir el
  // servicio a una matriz inexistente es una afirmación falsa sobre quién
  // responde por él, y es lo que un cliente comprueba antes de pagar por
  // adelantado.
  it("no atribuye Invifty a una empresa matriz inexistente", () => {
    const offenders: string[] = [];

    // Distingue mayúsculas a propósito: prohíbe el nombre tal como se MUESTRA
    // («Vitrexi Technologies»), no el fragmento en minúscula que aún queda en
    // dos slugs de muestras (`/muestra/gala-anual-vitrexi`). Cambiar esas dos
    // URLs es una decisión pendiente con coste propio —rompe cualquier enlace
    // ya compartido— y no debe bloquear esta comprobación.
    for (const file of COMMERCIAL_FILES) {
      const text = visibleText(readFileSync(join(ROOT, file), "utf8"));
      if (/Vitrexi/.test(text)) offenders.push(`${file}: nombra a Vitrexi`);
      if (/parentCompany/.test(text)) offenders.push(`${file}: declara una empresa matriz`);
    }

    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it("no inventa un registro mercantil", () => {
    // No hay entidad legal declarada. Un RNC inventado en unos términos es
    // mucho peor que no ponerlo: es un dato verificable y falso.
    const offenders: string[] = [];

    for (const file of COMMERCIAL_FILES) {
      const text = visibleText(readFileSync(join(ROOT, file), "utf8"));
      if (/\bRNC\b/.test(text)) offenders.push(`${file}: menciona un RNC`);
    }

    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});
