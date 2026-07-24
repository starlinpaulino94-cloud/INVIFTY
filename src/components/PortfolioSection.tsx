import { useState, useMemo } from "react";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import { PortfolioItem } from "../types";
import { 
  ExternalLink, Check, Eye, Sparkles, Search, X, 
  Grid, Heart, Crown, Building2, Baby, Cake, Filter, RotateCcw, MapPin
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface PortfolioSectionProps {
  onNavigateDemo: (demoPath: string) => void;
}

interface CategoryFilterOption {
  id: string;
  labelEs: string;
  labelEn: string;
  icon: typeof Grid;
  matchFn: (item: PortfolioItem) => boolean;
}

const CATEGORIES: CategoryFilterOption[] = [
  {
    id: "todas",
    labelEs: "Todas las Muestras",
    labelEn: "All Showcase Demos",
    icon: Grid,
    matchFn: () => true
  },
  {
    id: "bodas",
    labelEs: "Bodas & Matrimonios",
    labelEn: "Weddings & Marriages",
    icon: Heart,
    matchFn: (item) => item.eventType.toLowerCase().includes("boda")
  },
  {
    id: "quince",
    labelEs: "15 Años & Quinceañeras",
    labelEn: "Sweet 16 & Quinceañeras",
    icon: Crown,
    matchFn: (item) => item.eventType.toLowerCase().includes("15 años") || item.eventType.toLowerCase().includes("quince")
  },
  {
    id: "corporativo",
    labelEs: "Corporativo & Galas",
    labelEn: "Corporate & Galas",
    icon: Building2,
    matchFn: (item) => 
      item.eventType.toLowerCase().includes("corporativo") || 
      item.eventType.toLowerCase().includes("gala") || 
      item.eventType.toLowerCase().includes("lanzamiento")
  },
  {
    id: "babyshower",
    labelEs: "Baby Shower & Bautizos",
    labelEn: "Baby Shower & Baptisms",
    icon: Baby,
    matchFn: (item) => 
      item.eventType.toLowerCase().includes("baby shower") || 
      item.eventType.toLowerCase().includes("bautizo") || 
      item.eventType.toLowerCase().includes("comunión")
  },
  {
    id: "cumpleanos",
    labelEs: "Cumpleaños & Fiestas",
    labelEn: "Adult Birthdays & Parties",
    icon: Cake,
    matchFn: (item) => item.eventType.toLowerCase().includes("cumpleaños")
  },
  {
    id: "bridal",
    labelEs: "Bridal & Sociales",
    labelEn: "Bridal & Social Gatherings",
    icon: Sparkles,
    matchFn: (item) => item.eventType.toLowerCase().includes("bridal") || item.eventType.toLowerCase().includes("social")
  }
];

export default function PortfolioSection({ onNavigateDemo }: PortfolioSectionProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [activeCategory, setActiveCategory] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQuickViewItem, setSelectedQuickViewItem] = useState<PortfolioItem | null>(null);

  // Compute count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      counts[cat.id] = PORTFOLIO_ITEMS.filter(cat.matchFn).length;
    });
    return counts;
  }, []);

  // Filter items based on active category & search query
  const filteredItems = useMemo(() => {
    const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
    const query = searchQuery.trim().toLowerCase();

    return PORTFOLIO_ITEMS.filter(item => {
      const matchesCategory = currentCategoryObj.matchFn(item);
      if (!matchesCategory) return false;

      if (!query) return true;

      // Match against title, eventType, subtitle, and features list
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesType = item.eventType.toLowerCase().includes(query);
      const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
      const matchesFeature = item.features.some(f => f.toLowerCase().includes(query));

      return matchesTitle || matchesType || matchesSubtitle || matchesFeature;
    });
  }, [activeCategory, searchQuery]);

  const handleResetFilters = () => {
    setActiveCategory("todas");
    setSearchQuery("");
  };

  return (
    <section id="portafolio" className="py-24 bg-[#0F0F0F] relative border-t border-white/5 scroll-mt-20">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isEs ? "Catálogo de Experiencias Interactivas" : "Interactive Experience Catalog"}
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Explora nuestras " : "Explore Our "} 
            <span className="italic font-light text-[#D4AF37]">
              {isEs ? "Muestras en Vivo" : "Live Demo Gallery"}
            </span>
          </h2>
          
          <p className="text-white/50 text-sm sm:text-base font-light italic max-w-2xl mx-auto">
            {isEs 
              ? "Diseños adaptados para cada tipo de celebración. Haz clic en cualquiera de nuestras demos para experimentar todas sus funciones interactivas."
              : "Bespoke digital invitations built for every celebration type. Click any demo to preview full interactive features in real-time."}
          </p>
        </div>

        {/* CONTROLS BAR: Category Filter Pills + Search Input */}
        <div className="bg-[#151515] p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl mb-12 space-y-5">
          
          {/* Top Bar: Search Input & Status Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEs ? "Buscar por lugar, título o función..." : "Search by venue, title or feature..."}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-full pl-10 pr-9 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count & Reset Button */}
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="bg-[#0A0A0A] border border-white/10 px-3.5 py-1.5 rounded-full font-mono text-[11px]">
                {isEs ? "Mostrando " : "Showing "}
                <strong className="text-[#D4AF37] font-bold">{filteredItems.length}</strong>
                {isEs ? ` de ${PORTFOLIO_ITEMS.length} muestras` : ` of ${PORTFOLIO_ITEMS.length} demos`}
              </span>

              {(activeCategory !== "todas" || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-medium transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {isEs ? "Limpiar filtros" : "Clear filters"}
                </button>
              )}
            </div>

          </div>

          {/* Category Pill Tabs with Icons & Badge Counters */}
          <div className="flex overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 pt-2 pb-1 border-t border-white/5 touch-pan-x">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const IconComp = cat.icon;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 border active:scale-95 ${
                    isActive
                      ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-lg shadow-[#D4AF37]/20"
                      : "bg-[#0A0A0A] text-white/70 hover:text-white border-white/10 hover:border-white/30"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-[#D4AF37]"}`} />
                  <span>{isEs ? cat.labelEs : cat.labelEn}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-black/20 text-black font-bold" : "bg-white/10 text-white/60"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* SHOWCASE GRID */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#121212] border border-white/10 hover:border-[#D4AF37] flex flex-col group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.25)] relative"
              >
                {/* Image Preview Banner */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent"></div>

                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/85 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 border border-[#D4AF37]/40 rounded-full shadow-lg">
                      {item.eventType}
                    </span>
                  </div>

                  {/* Interactive Sample Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] text-black text-[9px] uppercase tracking-[0.2em] font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-black" /> {isEs ? "MUESTRA EN VIVO" : "LIVE DEMO"}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-white mb-1.5 group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider font-medium mb-5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.subtitle}</span>
                    </p>

                    {/* Features Checklist */}
                    <div className="space-y-2 mb-6 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest block mb-2">
                        {isEs ? "Funciones incluidas en esta muestra:" : "Features in this sample:"}
                      </span>
                      {item.features.slice(0, 5).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-white/80 font-light leading-snug">
                          <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                      {item.features.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setSelectedQuickViewItem(item)}
                          className="text-[10px] text-[#D4AF37] font-medium pt-1 hover:underline block"
                        >
                          + {item.features.length - 5} {isEs ? "funciones adicionales (Ver resumen)" : "more features (Quick inspect)"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateDemo(item.demoPath)}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#F2D06B] text-black font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-98 group/btn"
                    >
                      <Eye className="w-4 h-4 text-black" />
                      {isEs ? "Explorar Muestra Completa" : "View Full Interactive Demo"}
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-black/70 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when zero results match filter */
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
            <Filter className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
            <h4 className="font-serif text-xl text-white mb-2">
              {isEs ? "No se encontraron muestras" : "No demos found"}
            </h4>
            <p className="text-xs text-white/50 mb-6 font-light italic">
              {isEs 
                ? `No hay invitaciones que coincidan con "${searchQuery}" en esta categoría.`
                : `No invitations matched "${searchQuery}" under this category.`}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#F2D06B] transition-colors"
            >
              {isEs ? "Ver Todas las Muestras" : "View All Demos"}
            </button>
          </div>
        )}

      </div>

      {/* QUICK VIEW INSPECTOR MODAL */}
      {selectedQuickViewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151515] border border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedQuickViewItem(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
              {selectedQuickViewItem.eventType}
            </span>
            <h3 className="font-serif text-2xl text-white mb-2">{selectedQuickViewItem.title}</h3>
            <p className="text-xs text-white/50 mb-6 italic">{selectedQuickViewItem.subtitle}</p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {isEs ? "Lista Completa de Funcionalidades:" : "Complete Feature List:"}
            </h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-6">
              {selectedQuickViewItem.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const path = selectedQuickViewItem.demoPath;
                setSelectedQuickViewItem(null);
                onNavigateDemo(path);
              }}
              className="w-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#F2D06B] transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-black" />
              {isEs ? "Abrir Muestra Interactiva" : "Launch Interactive Demo"}
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

