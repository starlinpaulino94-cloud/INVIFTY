import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { MessageCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSelection } from "../context/SelectionContext";
import { PRICING_PLANS } from "../data/pricingData";
import { trackEvent } from "../services/analytics";
import {
  LeadPayload,
  LeadValidationErrors,
  hasErrors,
  submitLead,
  validateLead,
} from "../services/leads";

const ADVICE_PLAN_ID = "asesoria";

/** Etiqueta del plan construida desde el catálogo único (`pricingData`). */
function planLabel(planId: string, isEs: boolean): string {
  if (planId === ADVICE_PLAN_ID) {
    return isEs ? "Necesito asesoría personalizada" : "I need custom advice";
  }
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return planId;
  const name = isEs ? plan.name.es : plan.name.en;
  const price = isEs ? `RD$${plan.priceDOP.toLocaleString()} DOP` : `$${plan.priceUSD} USD`;
  const prefix = plan.isCustom ? (isEs ? "Desde " : "From ") : "";
  const recommended = plan.isPopular ? (isEs ? " (Recomendado)" : " (Recommended)") : "";
  return isEs
    ? `Plan ${name} — ${prefix}${price}${recommended}`
    : `${name} Plan — ${prefix}${price}${recommended}`;
}

/** Mensajes de error por identificador, en el idioma activo. */
function errorText(code: string | undefined, isEs: boolean): string | undefined {
  if (!code) return undefined;
  const messages: Record<string, { es: string; en: string }> = {
    required: { es: "Este campo es obligatorio.", en: "This field is required." },
    too_short: { es: "Escribe al menos 2 caracteres.", en: "Enter at least 2 characters." },
    invalid: {
      es: "Revisa el número: debe incluir el código de país o tener 10 dígitos.",
      en: "Check the number: include the country code or use 10 digits.",
    },
  };
  const message = messages[code];
  return message ? (isEs ? message.es : message.en) : undefined;
}

const FIELD_CLASS =
  "w-full bg-surface-raised border py-3.5 px-4 text-base sm:text-sm text-white placeholder-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors rounded-lg min-h-[48px]";

export default function InquiryForm() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const { planId: selectedPlanId, demoId: selectedDemoId } = useSelection();

  const defaultPlanId =
    PRICING_PLANS.find((p) => p.isPopular)?.id ?? PRICING_PLANS[0]?.id ?? ADVICE_PLAN_ID;

  const [formData, setFormData] = useState({
    name: "",
    eventType: "Boda / Matrimonio",
    eventDate: "",
    planInterest: selectedPlanId ?? defaultPlanId,
    phone: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState<LeadValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  // Si el visitante elige un plan en la sección de precios, el formulario lo
  // refleja al llegar aquí, sin que tenga que volver a seleccionarlo.
  useEffect(() => {
    if (selectedPlanId) {
      setFormData((prev) => ({ ...prev, planInterest: selectedPlanId }));
    }
  }, [selectedPlanId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const nextValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    // Limpia el error del campo en cuanto el visitante lo corrige.
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // start_lead_form: una sola vez, en el primer campo que recibe foco.
  const formStarted = useRef(false);
  const handleFormFocus = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackEvent("start_lead_form", { placement: "inquiry_form", language });
  };

  const buildPayload = (): LeadPayload => ({
    name: formData.name,
    phone: formData.phone,
    eventType: formData.eventType,
    eventDate: formData.eventDate || undefined,
    planId: formData.planInterest === ADVICE_PLAN_ID ? undefined : formData.planInterest,
    demoId: selectedDemoId,
    message: formData.message || undefined,
    language,
    source: "inquiry_form",
    consent: formData.consent,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Guarda contra envíos múltiples accidentales (doble clic, doble Enter).
    if (status === "sending") return;

    const payload = buildPayload();
    const validation = validateLead(payload);

    if (hasErrors(validation)) {
      setErrors(validation);
      setStatus("idle");
      trackEvent("lead_form_error", {
        placement: "inquiry_form",
        // Sólo el nombre del campo y el motivo. Nunca el valor introducido.
        error_reason: Object.entries(validation)
          .map(([field, code]) => `${field}:${code}`)
          .join(","),
      });
      // Lleva el foco al resumen para que un lector de pantalla lo anuncie.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("sending");

    const result = await submitLead(payload);

    if (!result.ok) {
      setStatus("error");
      trackEvent("lead_form_error", {
        placement: "inquiry_form",
        error_reason: result.reason,
        lead_submission_mode: result.mode,
      });
      return;
    }

    trackEvent("submit_lead_form", {
      placement: "inquiry_form",
      event_type: formData.eventType,
      plan_id: payload.planId,
      demo_id: payload.demoId,
      language,
      lead_submission_mode: result.mode,
    });

    if (result.mode === "whatsapp" && result.whatsappUrl) {
      setLastWhatsAppUrl(result.whatsappUrl);
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    }
    setStatus("success");
  };

  const nameError = errorText(errors.name, isEs);
  const phoneError = errorText(errors.phone, isEs);
  const consentError = errors.consent;

  return (
    <section id="contacto" className="py-24 bg-surface border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-sunken border border-white/10 p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
              {isEs ? "Solicitar información" : "Request information"}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
              {isEs ? "Cuéntanos de tu " : "Tell us about your "}
              <span className="italic font-light text-gold">{isEs ? "evento" : "event"}</span>
            </h2>
            <p className="text-white/60 text-sm">
              {isEs
                ? "Completa los datos y te respondemos por WhatsApp con la propuesta para tu celebración."
                : "Fill in your details and we'll reply on WhatsApp with a proposal for your celebration."}
            </p>
          </div>

          {status === "success" ? (
            <div className="bg-surface-raised border border-gold p-8 text-center">
              <div className="w-16 h-16 bg-gold/10 border border-gold flex items-center justify-center mx-auto mb-4 text-gold">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-white mb-2">
                {isEs ? "Se abrió WhatsApp con tu solicitud" : "WhatsApp opened with your request"}
              </h3>
              {/* Honestidad: sin backend, el lead sólo existe cuando el visitante
                  envía el mensaje. No se afirma que quedó registrado. */}
              <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
                {isEs
                  ? "Tu solicitud está redactada en WhatsApp. Envía el mensaje para que llegue a nuestro equipo; hasta entonces no la habremos recibido."
                  : "Your request is written out in WhatsApp. Send the message so it reaches our team; until then we haven't received it."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {lastWhatsAppUrl && (
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-placement="inquiry_form_retry"
                    className="bg-gold text-black font-semibold text-[11px] uppercase tracking-[0.2em] py-3.5 px-6 inline-flex items-center justify-center gap-2 min-h-[48px] rounded-lg"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    {isEs ? "Abrir WhatsApp de nuevo" : "Open WhatsApp again"}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setLastWhatsAppUrl(null);
                  }}
                  className="border border-white/20 text-white font-medium text-[11px] uppercase tracking-[0.2em] py-3.5 px-6 hover:bg-white/10 transition-colors min-h-[48px] rounded-lg"
                >
                  {isEs ? "Enviar otra solicitud" : "Send another request"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} onFocus={handleFormFocus} noValidate className="space-y-6">
              {hasErrors(errors) && (
                <div
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="bg-red-950/50 border border-red-500/60 text-red-100 text-sm p-4 rounded-lg flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {isEs
                      ? "Revisa los campos marcados para poder enviar tu solicitud."
                      : "Please review the highlighted fields to send your request."}
                  </span>
                </div>
              )}

              {status === "error" && (
                <div role="alert" className="bg-red-950/50 border border-red-500/60 text-red-100 text-sm p-4 rounded-lg">
                  {isEs
                    ? "No pudimos abrir WhatsApp. Inténtalo de nuevo o escríbenos directamente."
                    : "We couldn't open WhatsApp. Please try again or message us directly."}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="inquiry-name" className="block text-[11px] uppercase font-semibold tracking-[0.2em] text-white/85 mb-2">
                    {isEs ? "Tu nombre completo *" : "Your full name *"}
                  </label>
                  <input
                    type="text"
                    id="inquiry-name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(nameError)}
                    aria-describedby={nameError ? "inquiry-name-error" : undefined}
                    placeholder={isEs ? "Ej. Sofía Rodríguez" : "E.g. Sofia Rodriguez"}
                    className={`${FIELD_CLASS} ${nameError ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                  />
                  {nameError && (
                    <p id="inquiry-name-error" className="mt-1.5 text-xs text-red-300">
                      {nameError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="inquiry-phone" className="block text-[11px] uppercase font-semibold tracking-[0.2em] text-white/85 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="inquiry-phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? "inquiry-phone-error" : "inquiry-phone-hint"}
                    placeholder={isEs ? "Ej. 809 269 3214" : "E.g. +1 809 269 3214"}
                    className={`${FIELD_CLASS} ${phoneError ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                  />
                  {phoneError ? (
                    <p id="inquiry-phone-error" className="mt-1.5 text-xs text-red-300">
                      {phoneError}
                    </p>
                  ) : (
                    <p id="inquiry-phone-hint" className="mt-1.5 text-xs text-white/60">
                      {isEs ? "Si escribes 10 dígitos añadimos el +1." : "If you enter 10 digits we'll add +1."}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="inquiry-event-type" className="block text-[11px] uppercase font-semibold tracking-[0.2em] text-white/85 mb-2">
                    {isEs ? "Tipo de evento" : "Event type"}
                  </label>
                  <select
                    id="inquiry-event-type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className={`${FIELD_CLASS} border-white/10 focus:border-gold`}
                  >
                    <option value="Boda / Matrimonio">{isEs ? "Boda" : "Wedding"}</option>
                    <option value="15 Años / Quinceañera">{isEs ? "15 Años & Quinceañera" : "Quinceañera"}</option>
                    <option value="Gala / Evento Corporativo">{isEs ? "Gala & Evento Corporativo" : "Gala & Corporate Event"}</option>
                    <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                    <option value="Bautizo / Primera Comunión">{isEs ? "Bautizo / Primera Comunión" : "Baptism / First Communion"}</option>
                    <option value="Cumpleaños de Adulto">{isEs ? "Cumpleaños (30, 40, 50, 60+)" : "Birthday (30, 40, 50, 60+)"}</option>
                    <option value="Despedida de Soltera / Bridal Shower">{isEs ? "Despedida de Soltera" : "Bridal Shower"}</option>
                    <option value="Lanzamiento de Marca / Inauguración">{isEs ? "Lanzamiento / Inauguración" : "Brand Launch / Grand Opening"}</option>
                    <option value="Otro Evento Especial">{isEs ? "Otro evento especial" : "Other special event"}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inquiry-event-date" className="block text-[11px] uppercase font-semibold tracking-[0.2em] text-white/85 mb-2">
                    {isEs ? "Fecha aproximada" : "Approximate date"}
                  </label>
                  <input
                    type="date"
                    id="inquiry-event-date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={`${FIELD_CLASS} border-white/10 focus:border-gold`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-plan" className="block text-[11px] uppercase font-semibold tracking-[0.2em] text-white/85 mb-2">
                  {isEs ? "Plan de interés" : "Plan of interest"}
                </label>
                <select
                  id="inquiry-plan"
                  name="planInterest"
                  value={formData.planInterest}
                  onChange={handleChange}
                  className={`${FIELD_CLASS} border-white/10 focus:border-gold`}
                >
                  {PRICING_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {planLabel(plan.id, isEs)}
                    </option>
                  ))}
                  <option value={ADVICE_PLAN_ID}>{planLabel(ADVICE_PLAN_ID, isEs)}</option>
                </select>
                {selectedDemoId && (
                  <p className="mt-2 text-xs text-gold">
                    {isEs
                      ? `Incluiremos la muestra que viste: ${selectedDemoId}`
                      : `We'll include the sample you viewed: ${selectedDemoId}`}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="inquiry-message" className="block text-[11px] uppercase font-semibold tracking-[0.2em] text-white/85 mb-2">
                  {isEs ? "Detalles adicionales (opcional)" : "Additional details (optional)"}
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={isEs ? "Ciudad del evento, estilo que te gusta, preguntas..." : "Event city, style you like, questions..."}
                  className={`${FIELD_CLASS} border-white/10 focus:border-gold resize-none`}
                ></textarea>
              </div>

              {/* Consentimiento explícito de contacto */}
              <div>
                <label htmlFor="inquiry-consent" className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="inquiry-consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    aria-invalid={Boolean(consentError)}
                    aria-describedby={consentError ? "inquiry-consent-error" : undefined}
                    className="mt-0.5 w-5 h-5 shrink-0 accent-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  />
                  <span className="text-xs text-white/70 leading-relaxed">
                    {isEs
                      ? "Acepto que Invifty me contacte por WhatsApp para responder a esta solicitud."
                      : "I agree to be contacted by Invifty on WhatsApp regarding this request."}
                  </span>
                </label>
                {consentError && (
                  <p id="inquiry-consent-error" className="mt-1.5 text-xs text-red-300">
                    {isEs
                      ? "Necesitamos tu permiso para poder responderte."
                      : "We need your permission in order to reply."}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-gold text-black font-bold text-xs uppercase tracking-[0.2em] py-4 px-8 hover:bg-gold-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 rounded-xl min-h-[52px] shadow-lg touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    {isEs ? "Enviando..." : "Sending..."}
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    {isEs ? "Solicitar información" : "Request information"}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
