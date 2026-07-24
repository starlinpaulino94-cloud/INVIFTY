import { useState } from "react";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import { ExternalLink, Check, Eye, Sparkles } from "lucide-react";

interface PortfolioSectionProps {
  onNavigateDemo: (demoPath: string) => void;
}

export default function PortfolioSection({ onNavigateDemo }: PortfolioSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("Todas");

  const filterTabs = [
    "Todas",
    "Bodas",
    "15 Años",
    "Corporativo",
    "Baby Shower & Bautizos",
    "Cumpleaños & Fiestas",
    "Bridal & Sociales"
  ];

  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    if (selectedFilter === "Todas") return true;
    if (selectedFilter === "Bodas" && item.eventType.includes("Boda")) return true;
    if (selectedFilter === "15 Años" && item.eventType.includes("15 Años")) return true;
    if (selectedFilter === "Corporativo" && (item.eventType.includes("Corporativo") || item.eventType.includes("Lanzamientos"))) return true;
    if (selectedFilter === "Baby Shower & Bautizos" && (item.eventType.includes("Baby Shower") || item.eventType.includes("Bautizo"))) return true;
    if (selectedFilter === "Cumpleaños & Fiestas" && item.eventType.includes("Cumpleaños")) return true;
    if (selectedFilter === "Bridal & Sociales" && item.eventType.includes("Bridal")) return true;
    return true;
  });

  return (
    <section id="portafolio" className="py-24 bg-[#0F0F0F] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
            Muestras Editoriales Interactivas
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            Explora nuestra <span className="italic font-light text-[#D4AF37]">Colección de Muestras</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light italic">
            Diseños interactivos en vivo para todo tipo de celebraciones. Haz clic en cualquiera para visualizar la experiencia completa de nuestros trabajos.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 ${
                selectedFilter === tab
                  ? "bg-[#D4AF37] text-black shadow-lg"
                  : "bg-[#151515] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#121212] border border-white/10 hover:border-[#D4AF37] flex flex-col group rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(212,175,55,0.25)] relative"
            >
              {/* Image Preview Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-[#1A1A1A]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent"></div>

                {/* Event Type Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/85 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 border border-[#D4AF37]/40 rounded-full shadow-lg">
                    {item.eventType}
                  </span>
                </div>

                {/* Interactive Sample Tag */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] text-black text-[9px] uppercase tracking-[0.2em] font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-black" /> MUESTRA
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-white mb-1.5 group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#D4AF37] uppercase tracking-[0.2em] font-medium mb-5">
                    {item.subtitle}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-6 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest block mb-2">
                      Incluye en esta muestra:
                    </span>
                    {item.features.slice(0, 6).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-white/80 font-light leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {item.features.length > 6 && (
                      <p className="text-[10px] text-[#D4AF37] font-medium pt-1 italic">
                        + {item.features.length - 6} características interactivas adicionales
                      </p>
                    )}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => onNavigateDemo(item.demoPath)}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#F2D06B] text-black font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-98 group/btn"
                >
                  <Eye className="w-4 h-4 text-black" />
                  Explorar Muestra Completa
                  <ExternalLink className="w-3.5 h-3.5 ml-1 text-black/70 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
