import { useState } from "react";
import { FAQ_ITEMS } from "../data/faqData";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "../config";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#151515] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
            Respuestas Claras
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
            Preguntas <span className="italic font-light text-[#D4AF37]">Frecuentes</span>
          </h2>
          <p className="text-white/50 text-sm font-light italic">
            Todo lo que necesitas saber antes de solicitar tu invitación digital.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#0A0A0A] border border-white/5 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-base sm:text-lg font-normal text-white">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-none bg-[#151515] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#D4AF37] text-black" : "text-[#D4AF37]"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 text-xs text-white/60 leading-relaxed border-t border-white/5 font-light mt-2 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ WhatsApp Helper */}
        <div className="mt-12 text-center bg-[#0A0A0A] border border-[#D4AF37]/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-serif text-base text-white">¿Tienes alguna pregunta adicional?</h4>
            <p className="text-xs text-white/40 font-light italic">Estamos disponibles en WhatsApp para responder cualquier duda.</p>
          </div>
          <a
            href={buildWhatsAppUrl("Hola Invifty, tengo una consulta sobre las invitaciones digitales.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D4AF37] hover:bg-[#F2D06B] text-black font-semibold text-[10px] uppercase tracking-[0.2em] py-3.5 px-6 transition-colors flex items-center gap-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Oficial
          </a>
        </div>

      </div>
    </section>
  );
}
