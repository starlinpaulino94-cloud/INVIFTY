import { useState, ChangeEvent, FormEvent } from "react";
import { InquiryFormData } from "../types";
import { createInquiryWhatsAppUrl } from "../utils/whatsapp";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PRICING_PLANS } from "../data/pricingData";

const ADVICE_PLAN_ID = "asesoria";

// Single source of truth: plan labels are built from pricingData,
// so price changes there are reflected here automatically.
function planLabel(planId: string, isEs: boolean): string {
  if (planId === ADVICE_PLAN_ID) {
    return isEs ? "Necesito asesoría personalizada" : "I need custom advice";
  }
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return planId;
  const price = isEs
    ? `RD$${plan.priceDOP.toLocaleString()} DOP`
    : `$${plan.priceUSD} USD`;
  const recommended = plan.isPopular ? (isEs ? " (Recomendado)" : " (Recommended)") : "";
  return isEs
    ? `Plan ${plan.name} — ${price}${recommended}`
    : `${plan.name} Plan — ${price}${recommended}`;
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
    const url = createInquiryWhatsAppUrl(buildSubmissionData());

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
              Solicitud Instantánea
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
              Cotiza tu invitación en <span className="italic font-light text-[#D4AF37]">minutos</span>
            </h2>
            <p className="text-white/50 text-sm font-light italic">
              Completa los datos de tu evento y nuestro equipo te responderá de inmediato por WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#151515] border border-[#D4AF37] p-8 text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-white mb-2">
                ¡Solicitud Enviada a WhatsApp!
              </h3>
              <p className="text-xs text-white/60 font-light max-w-md mx-auto mb-6">
                Se ha abierto WhatsApp con los datos de tu evento formateados. Si no se abrió automáticamente, haz clic abajo:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={createInquiryWhatsAppUrl(buildSubmissionData())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D4AF37] text-black font-semibold text-[10px] uppercase tracking-[0.2em] py-3.5 px-6 inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp Nuevamente
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="border border-white/20 text-white font-medium text-[10px] uppercase tracking-[0.2em] py-3.5 px-6 hover:bg-white/10 transition-colors"
                >
                  Llenar otra solicitud
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div role="alert" className="bg-red-900/40 border border-red-500/50 text-red-200 text-xs p-3 text-center">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="inquiry-name" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="inquiry-name"
                    name="name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Sofía Rodríguez"
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="inquiry-phone" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="inquiry-phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej. +1 800-555-0199"
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tipo de Evento */}
                <div>
                  <label htmlFor="inquiry-event-type" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    Tipo de Evento
                  </label>
                  <select
                    id="inquiry-event-type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white focus:outline-none transition-colors rounded-lg min-h-[44px]"
                  >
                    <option value="Boda / Matrimonio">Boda / Matrimonio Luxury</option>
                    <option value="15 Años / Quinceañera">15 Años & Quinceañera</option>
                    <option value="Gala / Evento Corporativo">Gala & Evento Corporativo</option>
                    <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                    <option value="Bautizo / Primera Comunión">Bautizo / Primera Comunión</option>
                    <option value="Cumpleaños de Adulto">Cumpleaños de Adulto / Aniversario (30, 40, 50, 60+)</option>
                    <option value="Despedida de Soltera / Bridal Shower">Despedida de Soltera / Bridal Shower</option>
                    <option value="Lanzamiento de Marca / Inauguración">Lanzamiento de Marca / Inauguración</option>
                    <option value="Otro Evento Especial">Otro Evento Especial</option>
                  </select>
                </div>

                {/* Fecha del Evento */}
                <div>
                  <label htmlFor="inquiry-event-date" className="block text-[10px] uppercase font-semibold tracking-[0.2em] text-white/80 mb-2">
                    Fecha del Evento (Aproximada)
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
                  Plan de Interés
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
                  Detalles Adicionales (Opcional)
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe aquí cualquier detalle especial, ciudad del evento o preguntas..."
                  className="w-full bg-[#151515] border border-white/10 focus:border-[#D4AF37] py-3.5 px-4 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none transition-colors resize-none rounded-lg"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.2em] py-4 px-8 hover:bg-[#F2D06B] active:scale-98 transition-all flex items-center justify-center gap-2 rounded-xl min-h-[50px] shadow-lg touch-manipulation"
              >
                <MessageCircle className="w-5 h-5 text-black" />
                Enviar Solicitud a WhatsApp
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
