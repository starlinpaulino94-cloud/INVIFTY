import { ReactNode, useEffect, useState } from "react";
import { ArrowLeft, Globe, X } from "lucide-react";
import { createDemoWatermarkWhatsAppUrl } from "../../utils/whatsapp";

/**
 * KIT DE PIEZAS PARA LAS MUESTRAS
 * ===============================
 * Bloques compartidos por las invitaciones de demostración.
 *
 * Cada muestra vende un diseño distinto, así que estas piezas **no imponen
 * paleta**: reciben sus colores por props. Lo que sí unifican es la estructura,
 * la accesibilidad y el comportamiento, que antes se reescribían —con
 * variaciones y olvidos— en cada una de las doce demos.
 */

export interface DemoPalette {
  /** Color de acento de la muestra. */
  accent: string;
  /** Texto sobre el color de acento. */
  onAccent: string;
  /** Fondo de la barra superior. */
  bar: string;
}

/* ------------------------------------------------------------------ Divider */

export function DemoDivider({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <span className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${accent}80)` }} />
      <span className="rotate-45 block w-2 h-2 border" style={{ borderColor: accent }} />
      <span className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${accent}80)` }} />
    </div>
  );
}

/* ------------------------------------------------------------- SectionTitle */

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  accent: string;
  /** Clase del titular, para respetar la tipografía de cada muestra. */
  titleClassName?: string;
  subtitle?: string;
  /** Color del titular. Por defecto, blanco. */
  titleColor?: string;
}

export function DemoSectionTitle({
  eyebrow,
  title,
  accent,
  titleClassName = "font-serif text-3xl sm:text-5xl font-light",
  subtitle,
  titleColor = "#FFFFFF",
}: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      <span className="text-[10px] uppercase tracking-[0.45em] font-semibold block mb-3" style={{ color: accent }}>
        {eyebrow}
      </span>
      <h2 className={`${titleClassName} mb-4`} style={{ color: titleColor }}>
        {title}
      </h2>
      <DemoDivider accent={accent} />
      {subtitle && <p className="text-sm mt-5 max-w-xl mx-auto opacity-70">{subtitle}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- Countdown */

interface CountdownProps {
  /** Fecha objetivo en milisegundos. */
  target: number;
  accent: string;
  /** Fondo de cada casilla. */
  cell: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  numberClassName?: string;
}

/**
 * Cuenta regresiva. Al llegar la fecha se queda en ceros en vez de mostrar
 * números negativos, que es lo que hacía alguna muestra.
 */
export function DemoCountdown({ target, accent, cell, labels, numberClassName = "font-serif text-3xl sm:text-4xl" }: CountdownProps) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { v: left.days, l: labels.days },
    { v: left.hours, l: labels.hours },
    { v: left.minutes, l: labels.minutes },
    { v: left.seconds, l: labels.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
      {units.map((u) => (
        <div key={u.l} className="py-4 rounded-2xl border backdrop-blur-sm" style={{ background: cell, borderColor: `${accent}33` }}>
          <span className={`${numberClassName} block`} style={{ color: accent }}>
            {String(u.v).padStart(2, "0")}
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] opacity-60">{u.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Gallery */

interface GalleryProps {
  images: string[];
  accent: string;
  isEs: boolean;
  /** Alto de cada celda. */
  heightClassName?: string;
  columnsClassName?: string;
}

/**
 * Galería con vista ampliada. La imagen grande se cierra con Escape, con el
 * botón o pulsando fuera, y el diálogo tiene nombre accesible.
 */
export function DemoGallery({
  images,
  accent,
  isEs,
  heightClassName = "h-44 sm:h-60",
  columnsClassName = "grid-cols-2 md:grid-cols-3",
}: GalleryProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className={`grid ${columnsClassName} gap-3 sm:gap-4`}>
        {images.map((img, idx) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(img)}
            aria-label={isEs ? `Ampliar fotografía ${idx + 1}` : `Enlarge photo ${idx + 1}`}
            className={`group relative block w-full ${heightClassName} rounded-2xl overflow-hidden border focus-visible:outline-none focus-visible:ring-2`}
            style={{ borderColor: `${accent}33` }}
          >
            <img
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white border border-white/50 rounded-full px-4 py-1.5">
                {isEs ? "Ampliar" : "Enlarge"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={isEs ? "Fotografía ampliada" : "Enlarged photo"}
        >
          <button
            onClick={() => setActive(null)}
            aria-label={isEs ? "Cerrar" : "Close"}
            className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <img src={active} alt="" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" referrerPolicy="no-referrer" />
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------- TopBar */

interface TopBarProps {
  onBackToHome: () => void;
  /** Nombre con el que se identifica la muestra en el mensaje de WhatsApp. */
  sampleName: string;
  isEs: boolean;
  setLanguage: (lang: "es" | "en") => void;
  palette: DemoPalette;
}

/**
 * Barra superior de la muestra: volver, selector de idioma y marca de agua.
 *
 * Estaba copiada en las doce demos con variaciones, y una de ellas se había
 * quedado sin selector de idioma. Aquí es una sola pieza.
 */
export function DemoTopBar({ onBackToHome, sampleName, isEs, setLanguage, palette }: TopBarProps) {
  return (
    <div
      className="py-2.5 px-4 sticky top-0 z-50 shadow-md border-b flex items-center justify-between gap-3 text-xs"
      style={{ background: palette.bar, borderColor: `${palette.accent}4D` }}
    >
      <button onClick={onBackToHome} className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {isEs ? "Volver a Invifty" : "Back to Invifty"}
      </button>

      <div className="flex items-center gap-1 bg-white/10 border rounded-full p-1 text-[10px] font-semibold" style={{ borderColor: `${palette.accent}66` }}>
        <Globe className="w-3.5 h-3.5 ml-1 mr-0.5" style={{ color: palette.accent }} aria-hidden="true" />
        <button
          onClick={() => setLanguage("es")}
          aria-pressed={isEs}
          className={`px-2 py-0.5 rounded-full transition-all ${isEs ? "font-bold" : "text-white/70 hover:text-white"}`}
          style={isEs ? { background: palette.accent, color: palette.onAccent } : undefined}
        >
          ES
        </button>
        <span className="text-white/30 text-[9px]" aria-hidden="true">|</span>
        <button
          onClick={() => setLanguage("en")}
          aria-pressed={!isEs}
          className={`px-2 py-0.5 rounded-full transition-all ${!isEs ? "font-bold" : "text-white/70 hover:text-white"}`}
          style={!isEs ? { background: palette.accent, color: palette.onAccent } : undefined}
        >
          EN
        </button>
      </div>

      <a
        href={createDemoWatermarkWhatsAppUrl(sampleName)}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 rounded-full"
        style={{ background: palette.accent, color: palette.onAccent }}
      >
        ◆ {isEs ? "Cotizar este diseño" : "Quote this design"}
      </a>
    </div>
  );
}

/* ---------------------------------------------------------------- SubNav */

interface SubNavProps {
  items: { id: string; label: string }[];
  ctaId: string;
  ctaLabel: string;
  onNavigate: (id: string) => void;
  palette: DemoPalette;
  background: string;
  ariaLabel: string;
}

export function DemoSubNav({ items, ctaId, ctaLabel, onNavigate, palette, background, ariaLabel }: SubNavProps) {
  return (
    <nav
      className="backdrop-blur-md border-b sticky top-10 z-40 py-2.5 px-4 overflow-x-auto no-scrollbar"
      style={{ background, borderColor: `${palette.accent}4D` }}
      aria-label={ariaLabel}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap">
        {items.map((item) => (
          <button key={item.id} onClick={() => onNavigate(item.id)} className="transition-colors hover:opacity-70" style={{ color: palette.accent }}>
            {item.label}
          </button>
        ))}
        <button
          onClick={() => onNavigate(ctaId)}
          className="px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm"
          style={{ background: palette.accent, color: palette.onAccent }}
        >
          {ctaLabel}
        </button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------- Sección base */

export function DemoSection({
  id,
  children,
  background,
  className = "",
}: {
  id: string;
  children: ReactNode;
  background?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`py-24 px-5 ${className}`} style={background ? { background } : undefined}>
      {children}
    </section>
  );
}
