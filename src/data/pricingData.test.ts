import { describe, expect, it } from "vitest";
import { PLAN_COMPARISON, PRICING_EXTRAS, PRICING_PLANS } from "./pricingData";

describe("catálogo de planes", () => {
  it("expone los cuatro planes con ids estables", () => {
    // Los ids viajan en analítica y en el enlace de WhatsApp: cambiarlos rompe
    // el histórico de métricas y los leads en curso.
    expect(PRICING_PLANS.map((p) => p.id)).toEqual([
      "esencial",
      "popular",
      "premium",
      "a-medida",
    ]);
  });

  it("no tiene ids duplicados", () => {
    const ids = PRICING_PLANS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marca exactamente un plan como popular y uno como a medida", () => {
    expect(PRICING_PLANS.filter((p) => p.isPopular)).toHaveLength(1);
    expect(PRICING_PLANS.filter((p) => p.isCustom)).toHaveLength(1);
  });

  it("ordena los precios de menor a mayor", () => {
    const dop = PRICING_PLANS.map((p) => p.priceDOP);
    expect([...dop].sort((a, b) => a - b)).toEqual(dop);
  });

  it("da a cada plan los campos que la tarjeta necesita mostrar", () => {
    for (const plan of PRICING_PLANS) {
      expect(plan.name.es, `${plan.id}: falta nombre en ES`).toBeTruthy();
      expect(plan.name.en, `${plan.id}: falta nombre en EN`).toBeTruthy();
      expect(plan.description.es, `${plan.id}: falta descripción`).toBeTruthy();
      expect(plan.deliveryTime.es, `${plan.id}: falta tiempo de entrega`).toBeTruthy();
      expect(plan.deliveryTime.en, `${plan.id}: falta entrega en EN`).toBeTruthy();
      expect(plan.ctaText.es, `${plan.id}: falta CTA`).toBeTruthy();
      expect(plan.revisions, `${plan.id}: revisiones debe ser > 0`).toBeGreaterThan(0);
      expect(plan.features.length, `${plan.id}: sin capacidades`).toBeGreaterThan(0);
    }
  });

  it("traduce todas las capacidades a ambos idiomas", () => {
    for (const plan of PRICING_PLANS) {
      for (const feature of plan.features) {
        expect(feature.es, `${plan.id}: capacidad sin ES`).toBeTruthy();
        expect(feature.en, `${plan.id}: capacidad sin EN`).toBeTruthy();
      }
    }
  });
});

describe("coherencia entre tarjetas y tabla de comparación", () => {
  it("da a cada fila un valor por plan", () => {
    // Si la tabla y las tarjetas se desincronizan, el visitante ve precios o
    // límites distintos en dos sitios de la misma página.
    for (const row of PLAN_COMPARISON) {
      expect(row.values, `fila "${row.label.es}"`).toHaveLength(PRICING_PLANS.length);
    }
  });

  it("repite en la tabla el mismo tiempo de entrega que en la tarjeta", () => {
    const deliveryRow = PLAN_COMPARISON.find((row) =>
      row.label.es.toLowerCase().includes("entrega")
    );
    expect(deliveryRow, "no existe la fila de entrega").toBeDefined();

    PRICING_PLANS.forEach((plan, index) => {
      const cell = deliveryRow!.values[index];
      // La fila de entrega siempre lleva texto, nunca un ✓/—.
      expect(typeof cell, `entrega de ${plan.id} debe ser texto`).not.toBe("boolean");
      if (typeof cell === "boolean") return;
      expect(cell.es, `entrega de ${plan.id}`).toBe(plan.deliveryTime.es);
      expect(cell.en, `entrega EN de ${plan.id}`).toBe(plan.deliveryTime.en);
    });
  });

  it("traduce todas las filas de la comparación", () => {
    for (const row of PLAN_COMPARISON) {
      expect(row.label.es).toBeTruthy();
      expect(row.label.en).toBeTruthy();
      for (const value of row.values) {
        // Una celda es un texto traducido o un booleano (✓ / —).
        if (typeof value === "boolean") continue;
        expect(value.es, `fila "${row.label.es}" sin ES`).toBeTruthy();
        expect(value.en, `fila "${row.label.es}" sin EN`).toBeTruthy();
      }
    }
  });
});

describe("extras", () => {
  it("traduce y valora cada extra", () => {
    for (const extra of PRICING_EXTRAS) {
      expect(extra.title.es, `${extra.id}: falta título ES`).toBeTruthy();
      expect(extra.title.en, `${extra.id}: falta título EN`).toBeTruthy();
      expect(extra.description.es, `${extra.id}: falta descripción ES`).toBeTruthy();
      expect(extra.description.en, `${extra.id}: falta descripción EN`).toBeTruthy();
      expect(extra.priceDOP, `${extra.id}: precio DOP`).toBeGreaterThan(0);
      expect(extra.priceUSD, `${extra.id}: precio USD`).toBeGreaterThan(0);
    }
  });

  it("no repite ids de extras", () => {
    const ids = PRICING_EXTRAS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
