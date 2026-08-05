import { describe, expect, it } from "vitest";
import { CLIENT_REVIEWS, averageRating, ClientReview } from "../../data/reviewsData";
import {
  MAX_QUOTE_LENGTH,
  MIN_QUOTE_LENGTH,
  ReviewSubmission,
  buildReviewMessage,
  submitReview,
  validateReview,
} from "./index";

function makeSubmission(overrides: Partial<ReviewSubmission> = {}): ReviewSubmission {
  return {
    author: "Camila R.",
    eventType: "Boda",
    rating: 5,
    quote: "Nuestros invitados quedaron encantados con la invitación y todo llegó a tiempo.",
    consentToPublish: true,
    language: "es",
    ...overrides,
  };
}

describe("validación de reseñas", () => {
  it("acepta una reseña completa", () => {
    expect(validateReview(makeSubmission())).toEqual([]);
  });

  it("exige el permiso de publicación", () => {
    // Sin autorización la reseña no se puede publicar, así que tampoco se envía.
    expect(validateReview(makeSubmission({ consentToPublish: false }))).toContain("consent");
  });

  it("rechaza textos demasiado cortos o demasiado largos", () => {
    expect(validateReview(makeSubmission({ quote: "Bien" }))).toContain("quote");
    expect(validateReview(makeSubmission({ quote: "x".repeat(MAX_QUOTE_LENGTH + 1) }))).toContain(
      "quote"
    );
    expect(validateReview(makeSubmission({ quote: "x".repeat(MIN_QUOTE_LENGTH) }))).toEqual([]);
  });

  it("no acepta un nombre o un evento vacíos", () => {
    expect(validateReview(makeSubmission({ author: " " }))).toContain("author");
    expect(validateReview(makeSubmission({ eventType: "" }))).toContain("eventType");
  });
});

describe("mensaje de WhatsApp", () => {
  it("incluye la autorización por escrito", () => {
    // Queda registrada en la conversación, que es donde debe poder consultarse
    // antes de publicar la reseña.
    const message = buildReviewMessage(makeSubmission());
    expect(message).toContain("Autorizo a Invifty a publicar esta reseña");
  });

  it("refleja la valoración elegida", () => {
    expect(buildReviewMessage(makeSubmission({ rating: 3 }))).toContain("(3/5)");
  });

  it("no inventa datos que la persona no escribió", () => {
    const message = buildReviewMessage(
      makeSubmission({ author: "Ana", eventType: "Bautizo", quote: "x".repeat(MIN_QUOTE_LENGTH) })
    );
    expect(message).toContain("Ana");
    expect(message).toContain("Bautizo");
    // El teléfono no se pide en este formulario: no debe aparecer un campo vacío.
    expect(message).not.toContain("Teléfono");
    expect(message).not.toContain("undefined");
  });

  it("se traduce al inglés", () => {
    const message = buildReviewMessage(makeSubmission({ language: "en" }));
    expect(message).toContain("CLIENT REVIEW");
    expect(message).toContain("I authorise Invifty to publish");
  });
});

describe("envío", () => {
  it("devuelve la URL de WhatsApp y no la abre", () => {
    const result = submitReview(makeSubmission());
    expect(result.ok).toBe(true);
    expect(result.whatsappUrl).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  it("no devuelve URL si la reseña es inválida", () => {
    const result = submitReview(makeSubmission({ consentToPublish: false }));
    expect(result.ok).toBe(false);
    expect(result.whatsappUrl).toBeUndefined();
  });
});

describe("catálogo de reseñas publicadas", () => {
  it("no publica reseñas inventadas", () => {
    // Esta web ya tuvo testimonios falsos con nombre, ciudad y cinco estrellas.
    // Mientras no haya opiniones reales autorizadas, el catálogo debe estar
    // vacío y la sección decirlo, en vez de rellenar el hueco.
    expect(CLIENT_REVIEWS).toEqual([]);
    expect(averageRating()).toBeNull();
  });

  it("calcula la media sólo cuando hay reseñas", () => {
    const sample: ClientReview[] = [
      {
        id: "a",
        author: "Ana",
        eventType: { es: "Boda", en: "Wedding" },
        eventDate: { es: "Marzo 2026", en: "March 2026" },
        quote: { es: "Excelente", en: "Excellent" },
        rating: 5,
      },
      {
        id: "b",
        author: "Luis",
        eventType: { es: "15 años", en: "Quinceañera" },
        eventDate: { es: "Abril 2026", en: "April 2026" },
        quote: { es: "Muy bien", en: "Very good" },
        rating: 4,
      },
    ];
    expect(averageRating(sample)).toBe(4.5);
  });
});
