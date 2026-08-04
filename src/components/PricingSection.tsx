import { useEffect, useRef, useState } from "react";
import { PRICING_PLANS, PRICING_EXTRAS, PLAN_COMPARISON } from "../data/pricingData";
import { createPlanWhatsAppUrl } from "../utils/whatsapp";
import { trackEvent } from "../services/analytics";
import { Check, MessageCircle, Clock, RefreshCw, ChevronDown, Minus, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSelection } from "../context/SelectionContext";
import { PricingPlan } from "../types";

export default function PricingSection() {
  const { language, lx } = useLanguage();
  const { selectPlan } = useSelection();
  const isEs = language === "es";
  const [showComparison, setShowComparison] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const standardPlans = PRICING_PLANS.filter((plan) => !plan.isCustom);
  const customPlan = PRICING_PLANS.find((plan) => plan.isCustom) ?? null;

  const priceDisplay = (plan: PricingPlan): string => {
    const base = isEs ? `RD$ ${plan.priceDOP.toLocaleString()} DOP` : `$${plan.priceUSD} USD`;
    return plan.isCustom ? (isEs ? `Desde ${base}` : `From ${base}`) : base;
  };

  // view_pricing: se registra una sola vez cuando la sección entra en pantalla
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEvent("view_pricing", { page_path: window.location.pathname });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="planes" ref={sectionRef} className="py-24 bg-surface-raised border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
            {isEs ? "Inversión Transparente" : "Transparent Investment"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Planes Diseñados para tu " : "Choose Your "}
            <span className="italic font-light text-gold">
              {isEs ? "Celebración" : "Celebration Plan"}
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light italic">
            {isEs
              ? "Invitados ilimitados y un solo pago por tu evento: sin costos ocultos, sin suscripciones mensuales y sin cobrar por invitado."
              : "Unlimited guests and a single payment per event: no hidden costs, no monthly fees and no per-guest charges."}
          </p>
          <p className="text-white/60 text-[11px] mt-3 tracking-wide">
            {isEs
              ? "Precios en pesos dominicanos (DOP). ¿Pagas desde el exterior? También aceptamos USD, Zelle y PayPal."
              : "Prices shown in USD. Paying from the Dominican Republic? DOP pricing available — plus Zelle and PayPal."}
          </p>
        </div>

        {/* Pricing Cards Grid — tres planes comparables */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 items-stretch">
          {standardPlans.map((plan) => {
            const isPopular = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? "bg-gradient-to-b from-[#1F1F1F] via-surface-raised to-surface-sunken border-2 border-gold shadow-2xl shadow-gold/10 lg:-translate-y-2"
                    : "bg-surface-sunken border border-white/5 hover:border-gold/40"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1 shadow-md flex items-center gap-1 whitespace-nowrap">
                    ◆ {lx(plan.badge)}
                  </div>
                )}

                <div>
                  {/* Plan Name & Outcome */}
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-normal text-white mb-2">
                      {lx(plan.name)}
                    </h3>
                    <p className="text-xs text-white/60 font-light italic mb-4 min-h-[36px]">
                      {lx(plan.description)}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-gold font-semibold">
                        {isEs ? "RD$" : "$"}
                      </span>
                      <span className="font-serif text-4xl font-normal text-white">
                        {isEs ? plan.priceDOP.toLocaleString() : plan.priceUSD.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-white/60 uppercase tracking-wider ml-1">
                        {isEs ? "DOP / pago único" : "USD / one-time payment"}
                      </span>
                    </div>
                  </div>

                  {/* Límites visibles: entrega y revisiones */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-6 text-[10px] text-white/50 uppercase tracking-wider">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                      {isEs ? "Entrega" : "Delivery"}: {lx(plan.deliveryTime)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                      {plan.revisions}{" "}
                      {isEs
                        ? plan.revisions === 1 ? "revisión incluida" : "revisiones incluidas"
                        : plan.revisions === 1 ? "revision included" : "revisions included"}
                    </span>
                  </div>

                  {/* Por qué es el plan recomendado */}
                  {plan.whyRecommended && (
                    <p className="text-[11px] text-gold-hover/90 bg-gold/10 border border-gold/25 px-3 py-2.5 leading-snug mb-6">
                      {lx(plan.whyRecommended)}
                    </p>
                  )}

                  <hr className="border-white/5 mb-6" />

                  {/* Feature List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-white/70 font-light leading-snug">
                        <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{lx(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <a
                    href={createPlanWhatsAppUrl(lx(plan.name), priceDisplay(plan), isEs)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Conserva el plan elegido para que el formulario llegue prellenado.
                      selectPlan(plan.id);
                      trackEvent("select_plan", { plan_id: plan.id, placement: "pricing_card" });
                    }}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em] py-3.5 rounded-xl min-h-[48px] active:scale-95 transition-all duration-300 touch-manipulation shadow-md ${
                      isPopular
                        ? "bg-gold text-black hover:bg-gold-hover"
                        : "bg-surface-raised text-white border border-white/10 hover:border-gold hover:text-gold"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {lx(plan.ctaText)}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Opción "A medida" para eventos únicos */}
        {customPlan && (
          <div className="relative mb-8 border border-gold/40 bg-gradient-to-r from-surface-hover via-surface-raised to-surface-sunken p-8 lg:p-10 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/10 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Identidad del plan a medida */}
              <div className="lg:col-span-5">
                {customPlan.badge && (
                  <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 mb-5">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> {lx(customPlan.badge)}
                  </div>
                )}
                <h3 className="font-serif text-3xl font-normal text-white mb-3">
                  {lx(customPlan.name)}
                </h3>
                <p className="text-sm text-white/50 font-light italic mb-6">
                  {lx(customPlan.description)}
                </p>

                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-xs text-white/50 font-medium">
                    {isEs ? "Desde" : "From"}
                  </span>
                  <span className="text-xs text-gold font-semibold">{isEs ? "RD$" : "$"}</span>
                  <span className="font-serif text-5xl font-normal text-white">
                    {isEs ? customPlan.priceDOP.toLocaleString() : customPlan.priceUSD.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/60 uppercase tracking-wider">
                    {isEs ? "DOP / pago único" : "USD / one-time payment"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5 text-[10px] text-white/50 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    {isEs ? "Entrega" : "Delivery"}: {lx(customPlan.deliveryTime)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    {customPlan.revisions}{" "}
                    {isEs ? "revisiones incluidas" : "revisions included"}
                  </span>
                </div>

                <p className="text-[11px] text-white/60 italic leading-relaxed">
                  {isEs
                    ? "Ideal para bodas de gala, lanzamientos de marca y eventos donde cada detalle importa."
                    : "Ideal for black-tie weddings, brand launches and events where every detail matters."}
                </p>
              </div>

              {/* Características */}
              <div className="lg:col-span-4">
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest block mb-4">
                  {isEs ? "Incluye" : "Includes"}
                </span>
                <ul className="space-y-3">
                  {customPlan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-white/80 font-light leading-snug">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{lx(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="lg:col-span-3">
                <a
                  href={createPlanWhatsAppUrl(lx(customPlan.name), priceDisplay(customPlan), isEs)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    selectPlan(customPlan.id);
                    trackEvent("select_plan", { plan_id: customPlan.id, placement: "pricing_custom" });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold text-black font-bold text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl min-h-[48px] hover:bg-gold-hover active:scale-95 transition-all duration-300 touch-manipulation shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  {lx(customPlan.ctaText)}
                </a>
                <p className="text-center text-[10px] text-white/60 mt-3 italic">
                  {isEs ? "Cotización por WhatsApp · Sin compromiso" : "Quote via WhatsApp · No commitment"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparación completa desplegable */}
        <div className="text-center mb-16">
          <button
            type="button"
            onClick={() => {
              setShowComparison((prev) => {
                // Sólo interesa la apertura: cerrar la tabla no es una señal de interés.
                if (!prev) trackEvent("expand_plan_comparison", { placement: "pricing" });
                return !prev;
              });
            }}
            aria-expanded={showComparison}
            aria-controls="comparacion-planes"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/15 text-white/80 text-[11px] font-semibold uppercase tracking-[0.2em] hover:border-gold hover:text-gold active:scale-95 transition-all min-h-[48px] touch-manipulation"
          >
            {showComparison
              ? (isEs ? "Ocultar comparación" : "Hide comparison")
              : (isEs ? "Ver comparación completa" : "See full comparison")}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showComparison ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {showComparison && (
            <div id="comparacion-planes" className="mt-8 overflow-x-auto text-left">
              <table className="w-full min-w-[640px] border-collapse bg-surface-sunken border border-white/5">
                <caption className="sr-only">
                  {isEs
                    ? "Comparación de características entre los planes Esencial, Popular, Premium y A medida"
                    : "Feature comparison across the Essential, Popular, Premium and Custom plans"}
                </caption>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="p-4 text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">
                      {isEs ? "Característica" : "Feature"}
                    </th>
                    {PRICING_PLANS.map((plan) => (
                      <th
                        key={plan.id}
                        scope="col"
                        className={`p-4 text-center align-bottom ${plan.isPopular ? "bg-gold/5" : ""}`}
                      >
                        <span className="block font-serif text-base font-normal text-white">
                          {lx(plan.name)}
                        </span>
                        <span className="block text-[10px] text-gold font-semibold mt-1">
                          {isEs
                            ? `RD$ ${plan.priceDOP.toLocaleString()}`
                            : `$${plan.priceUSD.toLocaleString()} USD`}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_COMPARISON.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-white/5">
                      <th scope="row" className="p-4 text-xs text-white/70 font-light text-left leading-snug">
                        {lx(row.label)}
                      </th>
                      {row.values.map((value, colIdx) => (
                        <td
                          key={colIdx}
                          className={`p-4 text-center text-xs ${PRICING_PLANS[colIdx]?.isPopular ? "bg-gold/5" : ""}`}
                        >
                          {value === true ? (
                            <>
                              <Check className="w-4 h-4 text-gold inline-block" aria-hidden="true" />
                              <span className="sr-only">{isEs ? "Incluido" : "Included"}</span>
                            </>
                          ) : value === false ? (
                            <>
                              <Minus className="w-4 h-4 text-white/40 inline-block" aria-hidden="true" />
                              <span className="sr-only">{isEs ? "No incluido" : "Not included"}</span>
                            </>
                          ) : (
                            <span className="text-white/70">{lx(value)}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Extras Addons Section */}
        <div className="bg-surface-sunken border border-white/5 p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-gold font-serif text-lg">◆</span>
            <h3 className="font-serif text-xl font-normal text-white">
              {isEs ? "Servicios Opcionales Adicionales" : "Optional Additional Services"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_EXTRAS.map((extra) => (
              <div key={extra.id} className="bg-surface-raised p-5 border border-white/5 hover:border-gold/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-normal text-sm text-white font-serif">{lx(extra.title)}</h4>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                    {isEs ? `+RD$ ${extra.priceDOP.toLocaleString()}` : `+$${extra.priceUSD} USD`}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed italic">
                  {lx(extra.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
