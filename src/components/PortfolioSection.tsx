import { useState, useMemo } from "react";
import {
  DEMO_CATEGORY_LABELS,
  DemoCategory,
  PublicDemo,
  countByCategory,
  filterDemos,
  getPublicDemos,
  getUsedCategories,
} from "../services/demos";
import { ExternalLink, Check, Eye, Sparkles, Search, X, Grid, Heart, Crown, Building2, Baby, Cake, Church, Store, Filter, RotateCcw, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSelection } from "../context/SelectionContext";
import { PRICING_PLANS } from "../data/pricingData";
import { trackEvent } from "../services/analytics";

interface PortfolioSectionProps {
  onNavigateDemo: (demoPath: string) => void;
}

/** Nombre visible de un plan, desde el catálogo único. */
function planName(planId: string, isEs: boolean): string {
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return planId;
  return isEs ? plan.name.es : plan.name.en;
}

/** Icono por categoría. Las etiquetas viven en el servicio de demos. */
const CATEGORY_ICONS: Record<DemoCategory, typeof Grid> = {
  boda: Heart,
  quinceanera: Crown,
  cumpleanos: Cake,
  "baby-shower": Baby,
  bautizo: Church,
  "bridal-shower": Sparkles,
  corporativo: Building2,
  apertura: Store,
  otro: Grid,
};

export default function PortfolioSection({ onNavigateDemo }: PortfolioSectionProps) {
  const { language, lx } = useLanguage();
  const { selectDemo } = useSelection();
  const isEs = language === "es";

  // `null` = todas las categorías.
  const [activeCategory, setActiveCategory] = useState<DemoCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQuickViewItem, setSelectedQuickViewItem] = useState<PublicDemo | null>(null);

  // El catálogo llega ya como PublicDemo: este componente no conoce el formato
  // del archivo estático, así que podrá venir de Studio sin tocarlo.
  const allDemos = useMemo(() => getPublicDemos(), []);
  const categoryCounts = useMemo(() => countByCategory(allDemos), [allDemos]);
  const usedCategories = useMemo(() => getUsedCategories(allDemos), [allDemos]);

  const filteredItems = useMemo(
    () =>
      filterDemos(
        { category: activeCategory ?? undefined, query: searchQuery, language },
        allDemos
      ),
    [activeCategory, searchQuery, language, allDemos]
  );

  /**
   * "Quiero una invitación como esta": guarda la demo como contexto del lead y
   * lleva al formulario. Sin esto, el visitante llegaba al formulario sin que
   * quedara constancia de qué diseño le gustó.
   */
  const handleRequestLike = (demo: PublicDemo) => {
    selectDemo(demo.id);
    trackEvent("click_demo_lead", {
      demo_id: demo.id,
      category: demo.category,
      placement: "portfolio_card",
    });
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setActiveCategory(null);
    setSearchQuery("");
  };

  return (
    <section id="portafolio" className="py-24 bg-surface relative border-t border-white/5 scroll-mt-20">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            {isEs ? "Catálogo de Experiencias Interactivas" : "Interactive Experience Catalog"}
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Explora nuestras " : "Explore Our "} 
            <span className="italic font-light text-gold">
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
        <div className="bg-surface-raised p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl mb-12 space-y-5">
          
          {/* Top Bar: Search Input & Status Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEs ? "Buscar por lugar, título o función..." : "Search by venue, title or feature..."}
                className="w-full bg-surface-sunken border border-white/10 rounded-full pl-10 pr-9 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count & Reset Button */}
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="bg-surface-sunken border border-white/10 px-3.5 py-1.5 rounded-full font-mono text-[11px]">
                {isEs ? "Mostrando " : "Showing "}
                <strong className="text-gold font-bold">{filteredItems.length}</strong>
                {isEs ? ` de ${allDemos.length} muestras` : ` of ${allDemos.length} demos`}
              </span>

              {(activeCategory !== null || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-gold hover:underline flex items-center gap-1 font-medium transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {isEs ? "Limpiar filtros" : "Clear filters"}
                </button>
              )}
            </div>

          </div>

          {/* Category Pill Tabs with Icons & Badge Counters */}
          <div className="flex overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 pt-2 pb-1 border-t border-white/5 touch-pan-x">
            {([null, ...usedCategories] as (DemoCategory | null)[]).map((cat) => {
              const isActive = activeCategory === cat;
              const IconComp = cat ? CATEGORY_ICONS[cat] : Grid;
              const count = cat ? categoryCounts[cat] ?? 0 : allDemos.length;
              const label = cat
                ? lx(DEMO_CATEGORY_LABELS[cat])
                : isEs
                  ? "Todas las muestras"
                  : "All demos";

              return (
                <button
                  key={cat ?? "todas"}
                  aria-pressed={isActive}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (cat) {
                      trackEvent("filter_demo", { category: cat, filter_value: cat, placement: "portfolio_filter" });
                    }
                  }}
                  className={`shrink-0 whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 border active:scale-95 ${
                    isActive
                      ? "bg-gold text-black border-gold font-bold shadow-lg shadow-gold/20"
                      : "bg-surface-sunken text-white/70 hover:text-white border-white/10 hover:border-white/30"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-gold"}`} />
                  <span>{label}</span>
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
                className="bg-surface-card border border-white/10 hover:border-gold flex flex-col group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.25)] relative"
              >
                {/* Image Preview Banner */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-surface-hover">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/30 to-transparent"></div>

                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/85 backdrop-blur-md text-gold text-[10px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 border border-gold/40 rounded-full shadow-lg">
                      {lx(item.eventTypeLabel)}
                    </span>
                  </div>

                  {/* Interactive Sample Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-gold to-gold-hover text-black text-[9px] uppercase tracking-[0.2em] font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-black" /> {isEs ? "MUESTRA EN VIVO" : "LIVE DEMO"}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-white mb-1.5 group-hover:text-gold transition-colors leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-[11px] text-gold uppercase tracking-wider font-medium mb-5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.subtitle}</span>
                    </p>

                    {/* Plan que reproduce lo que enseña esta muestra */}
                    {item.minimumPlan && (
                      <p className="text-[10px] text-white/60 mb-4 -mt-2">
                        {isEs ? "Disponible desde el plan " : "Available from the "}
                        <strong className="text-gold font-semibold">{planName(item.minimumPlan, isEs)}</strong>
                        {isEs ? "" : " plan"}
                      </p>
                    )}

                    {/* Features Checklist */}
                    <div className="space-y-2 mb-6 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest block mb-2">
                        {isEs ? "Funciones incluidas en esta muestra:" : "Features in this sample:"}
                      </span>
                      {item.features.slice(0, 5).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-white/80 font-light leading-snug">
                          <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{lx(feature)}</span>
                        </div>
                      ))}
                      {item.features.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setSelectedQuickViewItem(item)}
                          className="text-[10px] text-gold font-medium pt-1 hover:underline block"
                        >
                          + {item.features.length - 5} {isEs ? "funciones adicionales (Ver resumen)" : "more features (Quick inspect)"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => onNavigateDemo(item.demoUrl)}
                      className="w-full py-3.5 bg-gold hover:bg-gold-hover text-black font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-98 group/btn"
                    >
                      <Eye className="w-4 h-4 text-black" />
                      {isEs ? "Ver demo" : "View demo"}
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-black/70 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* CTA comercial contextual: conserva la demo elegida para que
                        el formulario y el mensaje de WhatsApp lleguen con contexto. */}
                    <button
                      onClick={() => handleRequestLike(item)}
                      className="w-full py-3 border border-gold/50 text-gold hover:bg-gold/10 font-semibold text-[11px] uppercase tracking-[0.2em] transition-colors rounded-xl flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      {isEs ? "Quiero una invitación como esta" : "I want an invitation like this"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when zero results match filter */
          <div className="bg-surface-raised border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
            <Filter className="w-10 h-10 text-gold mx-auto mb-3 opacity-60" />
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
              className="px-6 py-2.5 bg-gold text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gold-hover transition-colors"
            >
              {isEs ? "Ver Todas las Muestras" : "View All Demos"}
            </button>
          </div>
        )}

      </div>

      {/* QUICK VIEW INSPECTOR MODAL */}
      {selectedQuickViewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-gold rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedQuickViewItem(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-1">
              {lx(selectedQuickViewItem.eventTypeLabel)}
            </span>
            <h3 className="font-serif text-2xl text-white mb-2">{selectedQuickViewItem.title}</h3>
            <p className="text-xs text-white/50 mb-6 italic">{selectedQuickViewItem.subtitle}</p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {isEs ? "Lista Completa de Funcionalidades:" : "Complete Feature List:"}
            </h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-6">
              {selectedQuickViewItem.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                  <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{lx(feat)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const path = selectedQuickViewItem.demoUrl;
                setSelectedQuickViewItem(null);
                onNavigateDemo(path);
              }}
              className="w-full bg-gold text-black font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-gold-hover transition-colors flex items-center justify-center gap-2"
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

