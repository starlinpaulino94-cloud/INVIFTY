import { useState, useEffect, useRef, ReactNode } from "react";
import { createDemoWatermarkWhatsAppUrl } from "../utils/whatsapp";
import { buildWhatsAppUrl } from "../config";
import { ArrowLeft, Navigation, Sparkles, Disc3, Mic2, Martini, Shirt, MessageCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * MUESTRA — CUMPLEAÑOS NEÓN "MARCOS 40"
 * =====================================
 * Estilo neón social del nuevo sistema de diseño: negro profundo,
 * magenta y cian con brillo eléctrico. Datos ficticios.
 */

const NEGRO = "#050505";
const MAGENTA = "#FF2D95";
const CIAN = "#22D3EE";

function reduceMotion(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Revelar({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion() || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const glowMagenta = { textShadow: `0 0 12px ${MAGENTA}99, 0 0 40px ${MAGENTA}55` };
const glowCian = { textShadow: `0 0 12px ${CIAN}99, 0 0 40px ${CIAN}55` };

/** RSVP rápido de la muestra: mensaje de confirmación pre-llenado. */
function buildRsvpQuickUrl(isEs: boolean): string {
  return buildWhatsAppUrl(
    isEs
      ? "💌 *RSVP — Neon Party Marcos 40 (Muestra Invifty)*\nHola, confirmo mi asistencia a la fiesta. ¡Ahí estaré!"
      : "💌 *RSVP — Neon Party Marcos 40 (Invifty Sample)*\nHi, I'm confirming my attendance to the party. I'll be there!"
  );
}

interface DemoProps {
  onBackToHome: () => void;
}

export default function NeonPartyDemo({ onBackToHome }: DemoProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Cuenta regresiva al 5 de septiembre de 2026, 9:00 PM
  const targetDate = new Date("2026-09-05T21:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const cuenta = [
    { v: timeLeft.days, l: isEs ? "Días" : "Days" },
    { v: timeLeft.hours, l: isEs ? "Horas" : "Hours" },
    { v: timeLeft.minutes, l: "Min" },
    { v: timeLeft.seconds, l: isEs ? "Seg" : "Sec" },
  ];

  const lineup = [
    { icono: Martini, hora: "9:00 PM", texto: isEs ? "Open bar y bienvenida" : "Open bar & welcome" },
    { icono: Disc3, hora: "10:00 PM", texto: isEs ? "DJ set — clásicos de los 2000" : "DJ set — 2000s classics" },
    { icono: Mic2, hora: "12:00 AM", texto: isEs ? "Karaoke y brindis de medianoche" : "Karaoke & midnight toast" },
  ];

  return (
    <div className="min-h-screen font-sans-clean" style={{ background: NEGRO, color: "#EAEAEA" }}>

      {/* Barra superior */}
      <header className="sticky top-0 z-40 backdrop-blur-sm border-b border-white/10" style={{ background: `${NEGRO}E6` }}>
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-white hover:opacity-70 transition-opacity min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver a Invifty" : "Back to Invifty"}
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: CIAN }}>
            ◆ {isEs ? "Muestra" : "Sample"}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pb-40">

        {/* Portada */}
        <section className="text-center pt-24 pb-16">
          <Revelar>
            <p className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: CIAN, ...glowCian }}>
              {isEs ? "No es una fiesta más" : "Not just another party"}
            </p>
            <p
              className="text-[8rem] sm:text-[11rem] font-extrabold leading-none"
              style={{ color: "transparent", WebkitTextStroke: `3px ${MAGENTA}`, ...glowMagenta }}
              aria-hidden="true"
            >
              40
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[0.2em] text-white mt-4 mb-6">
              MARCOS
            </h1>
            <p className="text-base max-w-md mx-auto leading-relaxed text-white/70">
              {isEs
                ? "Una vuelta más al sol merece buena música, buenos amigos y una celebración inolvidable."
                : "Another trip around the sun deserves good music, good friends and an unforgettable celebration."}
            </p>
            <p className="text-sm uppercase tracking-[0.35em] mt-8" style={{ color: CIAN }}>
              {isEs ? "Sábado 5 de septiembre de 2026 · 9:00 PM" : "Saturday, September 5, 2026 · 9:00 PM"}
            </p>
          </Revelar>
        </section>

        {/* Cuenta regresiva */}
        <Revelar>
          <section className="rounded-2xl py-10 px-6 text-center mb-20 border" style={{ borderColor: `${MAGENTA}55`, boxShadow: `0 0 40px ${MAGENTA}22 inset` }}>
            <p className="text-[11px] uppercase tracking-[0.4em] mb-6 text-white/50">
              {isEs ? "La cuenta regresiva empezó" : "The countdown has begun"}
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {cuenta.map((c, i) => (
                <div key={i}>
                  <span className="block text-4xl sm:text-5xl font-extrabold" style={i % 2 === 0 ? { color: MAGENTA, ...glowMagenta } : { color: CIAN, ...glowCian }}>
                    {c.v}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] mt-1 text-white/40">{c.l}</span>
                </div>
              ))}
            </div>
          </section>
        </Revelar>

        {/* Line-up */}
        <Revelar>
          <section className="mb-20">
            <h2 className="text-center text-2xl font-extrabold tracking-[0.15em] text-white mb-10 uppercase">
              {isEs ? "El plan de la noche" : "The night's line-up"}
            </h2>
            <ol className="space-y-4 max-w-md mx-auto">
              {lineup.map((item, i) => {
                const Icono = item.icono;
                const acento = i % 2 === 0 ? MAGENTA : CIAN;
                return (
                  <li key={i} className="flex items-center gap-5 rounded-xl px-6 py-5 border border-white/10 bg-white/[0.03]">
                    <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center border" style={{ borderColor: acento }}>
                      <Icono className="w-5 h-5" style={{ color: acento }} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="block text-[11px] uppercase tracking-[0.25em]" style={{ color: acento }}>{item.hora}</span>
                      <span className="block text-base font-semibold text-white">{item.texto}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </Revelar>

        {/* Dress code */}
        <Revelar>
          <section className="text-center mb-20 border-y border-white/10 py-12">
            <Shirt className="w-6 h-6 mx-auto mb-4" style={{ color: CIAN }} aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.4em] mb-3 text-white/50">Dress code</p>
            <p className="text-2xl font-extrabold text-white mb-2">
              {isEs ? "Negro total + un toque neón" : "All black + a neon touch"}
            </p>
            <p className="text-sm text-white/60 max-w-sm mx-auto">
              {isEs
                ? "Trae algo que brille: la pista tiene luz ultravioleta."
                : "Wear something that glows: the dance floor has UV light."}
            </p>
          </section>
        </Revelar>

        {/* Lugar */}
        <Revelar>
          <section className="text-center mb-20">
            <h2 className="text-2xl font-extrabold tracking-[0.15em] text-white mb-6 uppercase">
              {isEs ? "El lugar" : "The venue"}
            </h2>
            <p className="text-xl font-semibold mb-1" style={{ color: MAGENTA, ...glowMagenta }}>Sky Lounge 27</p>
            <p className="text-sm text-white/60 mb-6">{isEs ? "Torre Alto Naco, Piso 27 · Santo Domingo" : "Torre Alto Naco, 27th Floor · Santo Domingo"}</p>
            <a
              href="https://maps.google.com/?q=Naco%2C%20Santo%20Domingo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 rounded-full text-black transition-opacity hover:opacity-85 min-h-[48px]"
              style={{ background: CIAN }}
            >
              <Navigation className="w-4 h-4" />
              {isEs ? "Cómo llegar" : "Get directions"}
            </a>
          </section>
        </Revelar>

        {/* RSVP */}
        <Revelar>
          <section className="text-center mb-16">
            <h2 className="text-2xl font-extrabold tracking-[0.15em] text-white mb-3 uppercase">
              {isEs ? "¿Te apuntas?" : "Are you in?"}
            </h2>
            <p className="text-sm text-white/60 mb-8">
              {isEs ? "Confirma antes del 28 de agosto para reservar tu lugar en la lista." : "Confirm by August 28 to lock your spot on the list."}
            </p>
            <a
              href={buildRsvpQuickUrl(isEs)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] font-extrabold px-10 py-4 rounded-full text-black transition-transform hover:scale-105 active:scale-95 min-h-[48px]"
              style={{ background: `linear-gradient(90deg, ${MAGENTA}, ${CIAN})` }}
            >
              <MessageCircle className="w-4 h-4" />
              {isEs ? "Confirmar por WhatsApp" : "Confirm via WhatsApp"}
            </a>
          </section>
        </Revelar>

        {/* Cierre */}
        <Revelar>
          <footer className="text-center pt-8">
            <p className="text-3xl font-extrabold" style={{ color: "transparent", WebkitTextStroke: `2px ${CIAN}`, ...glowCian }} aria-hidden="true">
              4-0
            </p>
            <p className="text-xs text-white/40 mt-3">
              {isEs ? "Nos vemos en la pista — Marcos" : "See you on the dance floor — Marcos"}
            </p>
          </footer>
        </Revelar>
      </main>

      {/* Marca de agua */}
      <a
        href={createDemoWatermarkWhatsAppUrl(isEs ? "Neon Party — Marcos 40" : "Neon Party — Marcos 40", isEs)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 inset-x-0 z-40 text-center py-3.5 text-[11px] uppercase tracking-[0.25em] font-bold text-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${MAGENTA}, ${CIAN})` }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isEs ? "◆ Muestra de exhibición — Cotizar este diseño" : "◆ Showcase sample — Get a quote for this design"}
      </a>
    </div>
  );
}
