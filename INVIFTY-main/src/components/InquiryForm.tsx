import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { InquiryFormData } from "../types";
import { createInquiryWhatsAppUrl } from "../utils/whatsapp";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PRICING_PLANS } from "../data/pricingData";
import { trackEvent } from "../utils/analytics";

const ADVICE_PLAN_ID = "asesoria";

// Single source of truth: plan labels are built from pricingData,
// so price changes there are reflected here automatically.
function planLabel(planId: string, isEs: boolean): string {
  if (planId === ADVICE_PLAN_ID) {
    return isEs ? "Necesito asesoría personalizada" : "I need custom advice";
  }
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return planId;
  const name = isEs ? plan.name.es : plan.name.en;
  const price = isEs
    ? `RD$${plan.priceDOP.toLocaleString()} DOP`
    : `$${plan.priceUSD} USD`;
  const prefix = plan.isCustom ? (isEs ? "Desde " : "From ") : "";
  const recommended = plan.isPopular ? (isEs ? " (Recomendado)" : " (Recommended)") : "";
  return isEs
    ? `Plan ${name} — ${prefix}${price}${recommended}`
    : `${name} Plan — ${prefix}${price}${recommended}`;
}

export default function InquiryForm() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const defaultPlanId =
    PRICING_PLANS.find((p) => p.isPopular)?.id ?? PRICING_PLANS[0]?.id ?? ADVICE_PLAN_ID;

  // planInterest stores the plan id; the display label is resolved
  // with the active language at render/submit time.
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    eventType: "Boda / Matrimonio",
    eventDate: "",
    planInterest: defaultPlanId,
    phone: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage("");
  };

  const buildSubmissionData = (): InquiryFormData => ({
    ...formData,
    planInterest: planLabel(formData.planInterest, isEs)
  });

  // begin_brief: se registra una sola vez, en el primer campo que recibe foco
  const briefIniciado = useRef(false);
  const handleFormFocus = () => {
    if (briefIniciado.current) return;
    briefIniciado.current = true;
    trackEvent("begin_brief", { form: "inquiry" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage(isEs ? "Por favor ingresa tu nombre completo." : "Please enter your full name.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage(isEs ? "Por favor ingresa tu número de teléfono o WhatsApp." : "Please enter your phone or WhatsApp number.");
      return;
    }

    // Build WhatsApp URL
    const url = createInquiryWhatsAppUrl(buildSubmissionData(), isEs);

    trackEvent("submit_lead", {
      event_type: formData.eventType,
      plan_interest: formData.planInterest,
      lead_source: "inquiry_form",
      page_path: window.location.pathname,
    });

    // Open WhatsApp in new window
    window.open(url, "_blank", "noopener,noreferrer");

    // Show success confirmation state
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-24 bg-[#0F0F0F] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-[#0A0A0A] border border-white/10 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle Golden Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none"></div>

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
              {isEs ? "Solicitud Instantánea" : "Instant Request"}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
              {isEs ? "Cotiza tu invitación en " : "Get your quote in "}
              <span className="italic font-light text-[#D4AF37]">{isEs ? "minutos" : "minutes"}</span>
            </h2>
            <p className="text-white/50 text-sm font-light italic">
              {isEs
                ? "Completa los datos de tu evento y nuestro equipo te responderá de inmediato por WhatsApp."
                : "Fill in your event details and our team will reply right away on WhatsApp."}
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#151515] border border-[#D4AF37] p-8 text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-white mb-2">
                {isEs ? "¡Solicitud Enviada a WhatsApp!" : "Request Sent to WhatsApp!"}
              </h3>
              <p className="text-xs text-white/60 font-light max-w-md mx-auto mb-6">
                {isEs
                  ? "Se ha abierto WhatsApp con los datos de tu evento formateados. Si no se abrió automáticamente, haz clic abajo:"
                  : "WhatsApp opened with your event details pre-filled. If it didn't open automatically, click below:"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={createInquiryWhatsAppUrl(buildSubmissionData(), isEs)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D4AF37] text-black font-semibold text-[10px] uppercase tracking-[0.2em] py-3.5 px-6 inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {isEs ? "Abrir WhatsApp Nuevamente" : "Open WhatsApp Again"}
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="border border-white/20 text-white font-medium text-[10px] uppercase tracking-[0.2em] py-3.5 px-6 hover:bg-white/10 transition-colors"
                >
                  {isEs ? "Llenar otra solicitud" : "Fill another request"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-6">
              {errorMessage && (
                <div role="alert" className="bg-red-900/40 border border-red-500/50 text-red-200 text-xs p-3 text-center">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="inquiry-name" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    {isEs ? "Tu Nombre Completo *" : "Your Full Name *"}
                  </label>
                  <input
                    type="text"
                    id="inquiry-name"
                    name="name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isEs ? "Ej. Sofía Rodríguez" : "E.g. Sofia Rodriguez"}
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="inquiry-phone" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    {isEs ? "Teléfono / WhatsApp *" : "Phone / WhatsApp *"}
                  </label>
                  <input
                    type="tel"
                    id="inquiry-phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={isEs ? "Ej. +1 800-555-0199" : "E.g. +1 800-555-0199"}
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tipo de Evento */}
                <div>
                  <label htmlFor="inquiry-event-type" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    {isEs ? "Tipo de Evento" : "Event Type"}
                  </label>
                  <select
                    id="inquiry-event-type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  >
                    <option value="Boda / Matrimonio">{isEs ? "Boda / Matrimonio Luxury" : "Luxury Wedding / Marriage"}</option>
                    <option value="15 Años / Quinceañera">{isEs ? "15 Años & Quinceañera" : "Sweet 15 & Quinceañera"}</option>
                    <option value="Gala / Evento Corporativo">{isEs ? "Gala & Evento Corporativo" : "Gala & Corporate Event"}</option>
                    <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                    <option value="Bautizo / Primera Comunión">{isEs ? "Bautizo / Primera Comunión" : "Baptism / First Communion"}</option>
                    <option value="Cumpleaños de Adulto">{isEs ? "Cumpleaños de Adulto / Aniversario (30, 40, 50, 60+)" : "Adult Birthday / Anniversary (30, 40, 50, 60+)"}</option>
                    <option value="Despedida de Soltera / Bridal Shower">{isEs ? "Despedida de Soltera / Bridal Shower" : "Bridal Shower / Bachelorette"}</option>
                    <option value="Lanzamiento de Marca / Inauguración">{isEs ? "Lanzamiento de Marca / Inauguración" : "Brand Launch / Grand Opening"}</option>
                    <option value="Otro Evento Especial">{isEs ? "Otro Evento Especial" : "Other Special Event"}</option>
                  </select>
                </div>

                {/* Fecha del Evento */}
                <div>
                  <label htmlFor="inquiry-event-date" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    {isEs ? "Fecha del Evento (Aproximada)" : "Event Date (Approximate)"}
                  </label>
                  <input
                    type="date"
                    id="inquiry-event-date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              {/* Plan de Interés */}
              <div>
                <label htmlFor="inquiry-plan" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                  {isEs ? "Plan de Interés" : "Plan of Interest"}
                </label>
                <select
                  id="inquiry-plan"
                  name="planInterest"
                  value={formData.planInterest}
                  onChange={handleChange}
                  className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white focus:outline-none transition-colors rounded-lg min-h-[44px]"
                >
                  {PRICING_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {planLabel(plan.id, isEs)}
                    </option>
                  ))}
                  <option value={ADVICE_PLAN_ID}>{planLabel(ADVICE_PLAN_ID, isEs)}</option>
                </select>
              </div>

              {/* Mensaje Opcional */}
              <div>
                <label htmlFor="inquiry-message" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                  {isEs ? "Detalles Adicionales (Opcional)" : "Additional Details (Optional)"}
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={isEs ? "Escribe aquí cualquier detalle especial, ciudad del evento o preguntas..." : "Write any special details, event city or questions here..."}
                  className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none transition-colors resize-none rounded-lg"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.2em] py-4 px-8 hover:bg-[#F2D06B] active:scale-98 transition-all flex items-center justify-center gap-2 rounded-xl min-h-[50px] shadow-lg touch-manipulation"
              >
                <MessageCircle className="w-5 h-5 text-black" />
                {isEs ? "Enviar Solicitud a WhatsApp" : "Send Request via WhatsApp"}
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
