import { Check, Clock, Eye, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getPublicDemos } from "../services/demos";
import { trackEvent } from "../services/analytics";

interface DemoSelectorProps {
  onNavigateDemo: (demoPath: string) => void;
}

/**
 * Muestras destacadas de la home, una por tipo de evento principal.
 *
 * Antes este componente mantenía su propia lista con títulos, capacidades,
 * imágenes y rutas copiadas del catálogo: dos fuentes de verdad que podían
 * divergir sin que nada avisara. Ahora sólo elige QUÉ destacar; el contenido
 * sale de `services/demos`.
 */
const FEATURED_DEMO_IDS = [
  "muestra-boda-editorial",
  "muestra-quince-celestial",
  "muestra-neon-party",
  "muestra-summit-aurora",
] as const;

export default function DemoSelector({ onNavigateDemo }: DemoSelectorProps) {
  const { language, lx } = useLanguage();
  const isEs = language === "es";

  // Conserva el orden declarado en FEATURED_DEMO_IDS y descarta los que ya no
  // existan en el catálogo, para no romper la home si se retira una muestra.
  const catalog = getPublicDemos();
  const featured = FEATURED_DEMO_IDS.map((id) => catalog.find((demo) => demo.id === id)).filter(
    (demo): demo is NonNullable<typeof demo> => demo !== undefined
  );

  return (
    <section id="demos" className="py-24 bg-surface border-t border-white/5 relative scroll-mt-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            {isEs ? "Prueba antes de pedir" : "Try before you order"}
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Mira cómo se siente " : "See how your "}
            <span className="italic font-light text-gold">
              {isEs ? "tu invitación" : "invitation feels"}
            </span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base font-light italic max-w-2xl mx-auto">
            {isEs
              ? "Cada tipo de evento tiene su propio estilo. Explora una muestra real y descubre qué incluye antes de decidir tu plan."
              : "Every event type has its own style. Explore a real sample and discover what's included before you pick a plan."}
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((demo) => (
            <article
              key={demo.id}
              className="bg-surface-card border border-white/10 hover:border-gold flex flex-col group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.25)]"
            >
              {/* Poster Image */}
              <div className="relative h-56 overflow-hidden bg-surface-hover">
                <img
                  src={demo.coverImage}
                  alt={isEs ? `Muestra de invitación: ${demo.title}` : `Invitation sample: ${demo.title}`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/20 to-transparent"></div>

                {/* Event type badge */}
                <span className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-gold text-[10px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 border border-gold/40 rounded-full shadow-lg">
                  {lx(demo.eventTypeLabel)}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-medium mb-3">
                    {lx(demo.style)}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {demo.features.slice(0, 3).map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-white/80 font-light leading-snug">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{lx(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-white/60 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Clock className="w-3 h-3 text-gold" aria-hidden="true" />
                    {isEs ? "Exploración" : "Exploration"}: ~2 min
                  </p>

                  <button
                    onClick={() => {
                      trackEvent("filter_demo", { category: demo.category, placement: "demo_selector" });
                      onNavigateDemo(demo.demoUrl);
                    }}
                    className="w-full py-3.5 bg-gold hover:bg-gold-hover text-black font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-98 touch-manipulation min-h-[44px]"
                  >
                    <Eye className="w-4 h-4 text-black" aria-hidden="true" />
                    {isEs ? "Ver demo" : "View demo"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
