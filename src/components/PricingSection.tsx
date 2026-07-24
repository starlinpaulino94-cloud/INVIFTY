import { PRICING_PLANS, PRICING_EXTRAS } from "../data/pricingData";
import { CONFIG } from "../config";
import { createPlanWhatsAppUrl } from "../utils/whatsapp";
import { Check, MessageCircle } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="planes" className="py-24 bg-[#151515] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
            Inversión Transparente
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            Planes diseñados para cada <span className="italic font-light text-[#D4AF37]">Celebración</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light italic">
            Sin costos ocultos ni suscripciones mensuales. Un único pago por tu evento.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? "bg-gradient-to-b from-[#1F1F1F] via-[#151515] to-[#0A0A0A] border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/10 lg:-translate-y-2"
                    : "bg-[#0A0A0A] border border-white/5 hover:border-[#D4AF37]/40"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1 shadow-md flex items-center gap-1">
                    ◆ {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Price */}
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-normal text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/40 font-light italic mb-4 min-h-[36px]">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-[#D4AF37] font-semibold">{CONFIG.currency}</span>
                      <span className="font-serif text-4xl font-normal text-white">
                        {plan.priceRD.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider ml-1">USD / pago único</span>
                    </div>
                  </div>

                  <hr className="border-white/5 mb-6" />

                  {/* Feature List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-white/70 font-light leading-snug">
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <a
                    href={createPlanWhatsAppUrl(plan.name, plan.priceRD)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-[10px] uppercase tracking-[0.2em] py-3.5 transition-all duration-300 ${
                      isPopular
                        ? "bg-[#D4AF37] text-black hover:bg-[#F2D06B]"
                        : "bg-[#151515] text-white border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {plan.ctaText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extras Addons Section */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#D4AF37] font-serif text-lg">◆</span>
            <h3 className="font-serif text-xl font-normal text-white">
              Servicios Opcionales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_EXTRAS.map((extra) => (
              <div key={extra.id} className="bg-[#151515] p-5 border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-normal text-sm text-white font-serif">{extra.title}</h4>
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                    +{CONFIG.currency}{extra.priceRD} USD
                  </span>
                </div>
                <p className="text-xs text-white/40 font-light leading-relaxed italic">
                  {extra.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
