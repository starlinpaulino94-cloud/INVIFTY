import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, MessageCircle, PenLine, Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { CLIENT_REVIEWS, ClientReview, averageRating } from "../data/reviewsData";
import { trackEvent, trackEventOnce } from "../services/analytics";
import {
  MAX_QUOTE_LENGTH,
  MIN_QUOTE_LENGTH,
  ReviewFieldError,
  ReviewSubmission,
  submitReview,
} from "../services/reviews";

const FIELD_CLASS =
  "w-full bg-surface-raised border py-3.5 px-4 text-base sm:text-sm text-white placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors rounded-lg min-h-[48px]";

/** Texto de cada error, por identificador. */
function errorText(code: ReviewFieldError, isEs: boolean): string {
  const messages: Record<ReviewFieldError, { es: string; en: string }> = {
    author: {
      es: "Escribe el nombre con el que quieres aparecer.",
      en: "Enter the name you want to appear under.",
    },
    eventType: {
      es: "Dinos qué evento celebraste.",
      en: "Tell us what event you celebrated.",
    },
    quote: {
      es: `Escribe entre ${MIN_QUOTE_LENGTH} y ${MAX_QUOTE_LENGTH} caracteres.`,
      en: `Write between ${MIN_QUOTE_LENGTH} and ${MAX_QUOTE_LENGTH} characters.`,
    },
    consent: {
      es: "Necesitamos tu permiso para poder publicarla.",
      en: "We need your permission before we can publish it.",
    },
  };
  return isEs ? messages[code].es : messages[code].en;
}

/** Estrellas de una reseña ya publicada. Decorativas: el valor va en el texto. */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={
            value <= rating ? "w-4 h-4 text-gold fill-gold" : "w-4 h-4 text-white/20"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, isEs }: { review: ClientReview; isEs: boolean }) {
  return (
    <li className="bg-surface-sunken border border-white/5 p-8 flex flex-col gap-4">
      <StarRow rating={review.rating} />
      <p className="sr-only">
        {isEs ? `Valoración: ${review.rating} de 5` : `Rating: ${review.rating} out of 5`}
      </p>
      <blockquote className="text-sm text-white/75 leading-relaxed italic">
        “{isEs ? review.quote.es : review.quote.en}”
      </blockquote>
      <footer className="mt-auto pt-2 border-t border-white/5">
        <p className="text-white font-serif text-base">{review.author}</p>
        <p className="text-xs text-white/50 mt-1">
          {isEs ? review.eventType.es : review.eventType.en}
          {" · "}
          {isEs ? review.eventDate.es : review.eventDate.en}
          {review.location ? ` · ${review.location}` : ""}
        </p>
      </footer>
    </li>
  );
}

/**
 * ESPACIO DE RESEÑAS
 * ==================
 * Muestra las reseñas reales publicadas y deja que un cliente envíe la suya.
 *
 * Tres decisiones que sostienen la sección:
 *
 * 1. **Sin reseñas inventadas.** `CLIENT_REVIEWS` está vacío hoy, y cuando lo
 *    está la sección lo dice en vez de rellenar el hueco. Ver `reviewsData.ts`.
 * 2. **Sin backend, sin mentir sobre ello.** La reseña se envía por WhatsApp,
 *    igual que los pedidos. Al enviarla NO queda publicada, y el mensaje de
 *    confirmación lo dice con esas palabras: se publica cuando Invifty la
 *    revisa y la añade.
 * 3. **El permiso es obligatorio**, no una casilla marcada por defecto. Sin él
 *    el formulario no envía nada, porque sin él la reseña no se puede publicar.
 */
export default function ReviewsSection() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const reviews = CLIENT_REVIEWS;
  const average = averageRating(reviews);
  const hasReviews = reviews.length > 0;

  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<ReviewFieldError[]>([]);
  const [form, setForm] = useState({
    author: "",
    eventType: "",
    rating: 5 as ReviewSubmission["rating"],
    quote: "",
    consentToPublish: false,
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEventOnce("view_reviews", { review_count: reviews.length }, "reviews");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reviews.length]);

  /**
   * Marcado de valoración para Google — **sólo si hay reseñas reales**.
   *
   * `AggregateRating` sobre opiniones inventadas es precisamente lo que Google
   * penaliza, así que el bloque no existe mientras el catálogo esté vacío. En
   * cuanto se publique la primera reseña real aparece solo, sin tocar nada.
   */
  useEffect(() => {
    if (!hasReviews || average === null) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "invifty-reviews-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Invifty",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: average,
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.map((review) => ({
        "@type": "Review",
        author: { "@type": "Person", name: review.author },
        reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
        reviewBody: isEs ? review.quote.es : review.quote.en,
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [hasReviews, average, reviews, isEs]);

  /** El primer cambio en el formulario cuenta como «empezó a escribir». */
  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("start_review_form");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const submission: ReviewSubmission = { ...form, language };
    const result = submitReview(submission);

    if (!result.ok) {
      setErrors(result.errors);
      trackEvent("review_form_error", { error_reason: result.errors.join(",") });
      return;
    }

    setErrors([]);
    trackEvent("submit_review", { rating: form.rating });
    setSent(true);

    // Abrir aquí, dentro del gesto del usuario: fuera de él el navegador lo bloquea.
    if (result.whatsappUrl) window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
  }

  const showError = (code: ReviewFieldError) => errors.includes(code);

  return (
    <section
      id="resenas"
      ref={sectionRef}
      className="py-24 bg-surface-sunken border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
            {isEs ? "Reseñas" : "Reviews"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Lo que dicen quienes " : "What people who "}
            <span className="italic font-light text-gold">
              {isEs ? "ya celebraron" : "already celebrated"}
            </span>
          </h2>

          {hasReviews && average !== null ? (
            <p className="text-white/60 text-sm sm:text-base">
              {isEs
                ? `${average} de 5 según ${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"} de clientes.`
                : `${average} out of 5 from ${reviews.length} client ${reviews.length === 1 ? "review" : "reviews"}.`}
            </p>
          ) : (
            <p className="text-white/60 text-sm sm:text-base">
              {isEs
                ? "Todavía no hay reseñas publicadas. Preferimos decirlo a inventarlas: cuando un cliente nos escriba y nos autorice a compartirlo, su opinión aparecerá aquí con su nombre y su evento."
                : "There are no published reviews yet. We would rather say so than invent them: when a client writes to us and allows us to share it, their words will appear here with their name and event."}
            </p>
          )}
        </div>

        {hasReviews && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} isEs={isEs} />
            ))}
          </ul>
        )}

        <div className="max-w-2xl mx-auto">
          {!open && !sent && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  markStarted();
                }}
                className="inline-flex items-center gap-2.5 border border-gold/50 hover:border-gold text-gold hover:bg-gold/10 px-8 py-4 text-sm tracking-wide transition-colors min-h-[48px]"
              >
                <PenLine className="w-4 h-4" aria-hidden="true" />
                {isEs ? "Escribir mi reseña" : "Write my review"}
              </button>
              <p className="text-xs text-white/40 mt-4">
                {isEs
                  ? "¿Ya celebraste tu evento con Invifty? Cuéntanos cómo fue."
                  : "Already celebrated your event with Invifty? Tell us how it went."}
              </p>
            </div>
          )}

          {sent && (
            <div className="bg-surface border border-gold/30 p-8 text-center">
              <MessageCircle className="w-8 h-8 text-gold mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-serif text-xl text-white mb-3">
                {isEs ? "Se abrió WhatsApp con tu reseña" : "WhatsApp opened with your review"}
              </h3>
              {/* Honestidad: no se ha guardado ni publicado nada todavía. */}
              <p className="text-sm text-white/60 leading-relaxed">
                {isEs
                  ? "Envíanos el mensaje para que nos llegue. Tu reseña aún no está publicada: la revisaremos y la añadiremos a esta página tal como la escribiste."
                  : "Send us the message so it reaches us. Your review is not published yet: we will review it and add it to this page exactly as you wrote it."}
              </p>
            </div>
          )}

          {open && !sent && (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-surface border border-white/10 p-6 sm:p-8 space-y-5"
            >
              <div>
                <label htmlFor="review-author" className="block text-xs text-white/60 mb-2">
                  {isEs ? "Nombre con el que quieres aparecer" : "Name you want to appear under"}
                </label>
                <input
                  id="review-author"
                  type="text"
                  value={form.author}
                  onChange={(e) => {
                    markStarted();
                    setForm({ ...form, author: e.target.value });
                  }}
                  placeholder={isEs ? "Camila R." : "Camila R."}
                  aria-invalid={showError("author")}
                  className={`${FIELD_CLASS} ${showError("author") ? "border-red-500/70" : "border-white/10"}`}
                />
                {showError("author") && (
                  <p className="text-xs text-red-400 mt-2">{errorText("author", isEs)}</p>
                )}
              </div>

              <div>
                <label htmlFor="review-event" className="block text-xs text-white/60 mb-2">
                  {isEs ? "¿Qué evento celebraste?" : "What event did you celebrate?"}
                </label>
                <input
                  id="review-event"
                  type="text"
                  value={form.eventType}
                  onChange={(e) => {
                    markStarted();
                    setForm({ ...form, eventType: e.target.value });
                  }}
                  placeholder={isEs ? "Boda, 15 años, bautizo…" : "Wedding, quinceañera, baptism…"}
                  aria-invalid={showError("eventType")}
                  className={`${FIELD_CLASS} ${showError("eventType") ? "border-red-500/70" : "border-white/10"}`}
                />
                {showError("eventType") && (
                  <p className="text-xs text-red-400 mt-2">{errorText("eventType", isEs)}</p>
                )}
              </div>

              <fieldset>
                <legend className="block text-xs text-white/60 mb-2">
                  {isEs ? "Tu valoración" : "Your rating"}
                </legend>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        markStarted();
                        setForm({ ...form, rating: value });
                      }}
                      aria-pressed={form.rating === value}
                      aria-label={
                        isEs ? `${value} de 5 estrellas` : `${value} out of 5 stars`
                      }
                      className="p-2 min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
                    >
                      <Star
                        className={
                          value <= form.rating
                            ? "w-6 h-6 text-gold fill-gold"
                            : "w-6 h-6 text-white/25"
                        }
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="review-quote" className="block text-xs text-white/60 mb-2">
                  {isEs ? "Tu reseña" : "Your review"}
                </label>
                <textarea
                  id="review-quote"
                  rows={5}
                  value={form.quote}
                  maxLength={MAX_QUOTE_LENGTH}
                  onChange={(e) => {
                    markStarted();
                    setForm({ ...form, quote: e.target.value });
                  }}
                  placeholder={
                    isEs
                      ? "Cuéntanos cómo fue trabajar con nosotros y qué tal recibieron tus invitados la invitación."
                      : "Tell us how it was working with us and how your guests received the invitation."
                  }
                  aria-invalid={showError("quote")}
                  className={`${FIELD_CLASS} resize-y ${showError("quote") ? "border-red-500/70" : "border-white/10"}`}
                />
                <div className="flex justify-between mt-2 gap-4">
                  {showError("quote") ? (
                    <p className="text-xs text-red-400">{errorText("quote", isEs)}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-white/40 shrink-0">
                    {form.quote.trim().length}/{MAX_QUOTE_LENGTH}
                  </p>
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consentToPublish}
                    onChange={(e) => {
                      markStarted();
                      setForm({ ...form, consentToPublish: e.target.checked });
                    }}
                    aria-invalid={showError("consent")}
                    className="mt-1 w-5 h-5 shrink-0 accent-gold"
                  />
                  <span className="text-xs text-white/60 leading-relaxed">
                    {isEs
                      ? "Autorizo a Invifty a publicar esta reseña en su página web con el nombre que he indicado. Puedo pedir que se retire cuando quiera escribiendo por WhatsApp."
                      : "I authorise Invifty to publish this review on their website under the name I gave. I can ask for it to be removed at any time via WhatsApp."}
                  </span>
                </label>
                {showError("consent") && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {errorText("consent", isEs)}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black font-semibold py-4 text-sm tracking-wide transition-colors min-h-[48px] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                {isEs ? "Enviar por WhatsApp" : "Send via WhatsApp"}
              </button>

              <p className="text-[11px] text-white/40 text-center leading-relaxed">
                {isEs
                  ? "Se abrirá WhatsApp con tu reseña escrita. Nada se guarda en esta página: la publicamos nosotros después de leerla."
                  : "WhatsApp will open with your review written out. Nothing is stored on this page: we publish it ourselves after reading it."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
