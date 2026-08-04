import { useDemoFonts } from "../hooks/useDemoFonts";
import { parseAttendance } from "../utils/rsvp";
import { useState, useEffect, useRef, ReactNode, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { ArrowLeft, Clock, Navigation, Send, CheckCircle2, Sparkles, Music2, GlassWater, PartyPopper } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * MUESTRA — QUINCE AÑOS CELESTIAL "AMARA"
 * =======================================
 * Estilo celestial del nuevo sistema de diseño: cielo azul noche,
 * plata lunar, estrellas y tipografía imperial. Datos ficticios.
 */

const NOCHE = "#0B1026";
const NOCHE_SUAVE = "#131A40";
const PLATA = "#C9D4E8";
const PLATA_TENUE = "#8E9CC9";

/** Posiciones fijas del cielo estrellado (deterministas, sin saltos de layout). */
const ESTRELLAS: Array<[number, number, number, number]> = [
  [8, 12, 2, 0], [22, 6, 1.5, 400], [37, 15, 2.5, 800], [52, 8, 1.5, 200],
  [66, 14, 2, 600], [80, 7, 1.5, 1000], [91, 16, 2, 300], [14, 28, 1.5, 700],
  [45, 25, 2, 100], [72, 30, 1.5, 900], [88, 26, 2.5, 500], [5, 45, 1.5, 250],
  [30, 42, 2, 650], [60, 46, 1.5, 50], [95, 44, 2, 850], [18, 60, 2, 450],
];

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

interface DemoProps {
  onBackToHome: () => void;
}

export default function QuinceCelestialDemo({ onBackToHome }: DemoProps) {
  const { language } = useLanguage();
  useDemoFonts();
  const isEs = language === "es";

  // Cuenta regresiva al 21 de noviembre de 2026, 8:00 PM
  const targetDate = new Date("2026-11-21T20:00:00").getTime();
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

  const [rsvp, setRsvp] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
  });
  const [rsvpEnviado, setRsvpEnviado] = useState(false);

  const enviarRsvp = (e: FormEvent) => {
    e.preventDefault();
    window.open(createRsvpWhatsAppUrl("XV de Amara (Muestra)", rsvp), "_blank", "noopener");
    setRsvpEnviado(true);
  };

  const cuenta = [
    { v: timeLeft.days, l: isEs ? "Días" : "Days" },
    { v: timeLeft.hours, l: isEs ? "Horas" : "Hours" },
    { v: timeLeft.minutes, l: isEs ? "Min" : "Min" },
    { v: timeLeft.seconds, l: isEs ? "Seg" : "Sec" },
  ];

  const itinerario = [
    { hora: "8:00 PM", icono: GlassWater, titulo: isEs ? "Recepción y cóctel" : "Welcome & cocktail" },
    { hora: "9:00 PM", icono: Music2, titulo: isEs ? "Vals y brindis" : "Waltz & toast" },
    { hora: "10:00 PM", icono: PartyPopper, titulo: isEs ? "Cena y fiesta bajo las estrellas" : "Dinner & party under the stars" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 20%, ${NOCHE_SUAVE}, ${NOCHE} 70%)`, color: PLATA }}>

      {/* Cielo estrellado fijo */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {ESTRELLAS.map(([x, y, size, delay], i) => (
          <span
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: PLATA,
              animationDelay: `${delay}ms`,
              animationDuration: "2800ms",
            }}
          ></span>
        ))}
      </div>

      {/* Barra superior */}
      <header className="sticky top-0 z-40 backdrop-blur-sm border-b" style={{ background: `${NOCHE}E6`, borderColor: `${PLATA_TENUE}40` }}>
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold hover:opacity-70 transition-opacity min-h-[44px]"
            style={{ color: PLATA }}
          >
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver a Invifty" : "Back to Invifty"}
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans-clean font-semibold" style={{ color: PLATA_TENUE }}>
            ◆ {isEs ? "Muestra" : "Sample"}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-5 pb-40">

        {/* Portada */}
        <section className="text-center pt-20 pb-16">
          <Revelar>
            <p className="text-[11px] uppercase tracking-[0.5em] mb-8 font-sans-clean" style={{ color: PLATA_TENUE }}>
              {isEs ? "Una noche escrita en las estrellas" : "A night written in the stars"}
            </p>
            <p className="font-serif-display text-[9rem] sm:text-[11rem] leading-none text-white" aria-hidden="true">XV</p>
            <h1 className="font-cormorant text-5xl sm:text-6xl italic mt-2 mb-6 text-white">Amara Isabel</h1>
            <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
              <span className="block w-16 h-px" style={{ background: PLATA_TENUE }}></span>
              <span style={{ color: PLATA }}>✦</span>
              <span className="block w-16 h-px" style={{ background: PLATA_TENUE }}></span>
            </div>
            <p className="font-cormorant text-lg italic max-w-md mx-auto leading-relaxed opacity-90">
              {isEs
                ? "Una noche para soñar, brillar y compartir el comienzo de una nueva etapa."
                : "A night to dream, to shine, and to celebrate the beginning of a new chapter."}
            </p>
            <p className="text-sm uppercase tracking-[0.35em] mt-8 font-sans-clean">
              {isEs ? "Sábado 21 de noviembre de 2026 · 8:00 PM" : "Saturday, November 21, 2026 · 8:00 PM"}
            </p>
          </Revelar>
        </section>

        {/* Cuenta regresiva */}
        <Revelar>
          <section className="border py-10 px-6 text-center mb-20 rounded-2xl" style={{ borderColor: `${PLATA_TENUE}55`, background: `${NOCHE_SUAVE}80` }}>
            <p className="text-[11px] uppercase tracking-[0.4em] mb-6 font-sans-clean" style={{ color: PLATA_TENUE }}>
              {isEs ? "Faltan" : "Countdown"}
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {cuenta.map((c, i) => (
                <div key={i}>
                  <span className="block font-cormorant text-4xl sm:text-5xl text-white">{c.v}</span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] mt-1 font-sans-clean" style={{ color: PLATA_TENUE }}>{c.l}</span>
                </div>
              ))}
            </div>
          </section>
        </Revelar>

        {/* Itinerario */}
        <Revelar>
          <section className="mb-20">
            <h2 className="font-cormorant text-center text-3xl italic text-white mb-10">
              {isEs ? "La Noche, Paso a Paso" : "The Night, Step by Step"}
            </h2>
            <ol className="space-y-4 max-w-md mx-auto">
              {itinerario.map((item, i) => {
                const Icono = item.icono;
                return (
                  <li key={i} className="flex items-center gap-5 border rounded-xl px-6 py-5" style={{ borderColor: `${PLATA_TENUE}40`, background: `${NOCHE_SUAVE}66` }}>
                    <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center border" style={{ borderColor: PLATA_TENUE }}>
                      <Icono className="w-5 h-5" style={{ color: PLATA }} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="block text-[11px] uppercase tracking-[0.25em] font-sans-clean" style={{ color: PLATA_TENUE }}>{item.hora}</span>
                      <span className="block font-cormorant text-xl text-white">{item.titulo}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </Revelar>

        {/* Lugar */}
        <Revelar>
          <section className="text-center mb-20">
            <h2 className="font-cormorant text-3xl italic text-white mb-6">{isEs ? "El Lugar" : "The Venue"}</h2>
            <p className="font-cormorant text-2xl italic mb-1">Salón Estelar · Hotel Jaragua</p>
            <p className="text-sm opacity-70 mb-6">Av. George Washington 367, Santo Domingo</p>
            <a
              href="https://maps.google.com/?q=Hotel%20Jaragua%2C%20Santo%20Domingo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-sans-clean font-bold px-8 py-3.5 rounded-full transition-opacity hover:opacity-85 min-h-[48px]"
              style={{ background: PLATA, color: NOCHE }}
            >
              <Navigation className="w-4 h-4" />
              {isEs ? "Cómo llegar" : "Get directions"}
            </a>
          </section>
        </Revelar>

        {/* Dress code */}
        <Revelar>
          <section className="text-center mb-20 border-y py-12" style={{ borderColor: `${PLATA_TENUE}33` }}>
            <p className="text-[11px] uppercase tracking-[0.4em] mb-4 font-sans-clean" style={{ color: PLATA_TENUE }}>
              {isEs ? "Código de vestimenta" : "Dress code"}
            </p>
            <p className="font-cormorant text-2xl italic text-white mb-6">
              {isEs ? "Formal — bajo un cielo de gala" : "Formal — under a gala sky"}
            </p>
            <div className="flex items-center justify-center gap-3" aria-hidden="true">
              {["#0B1026", "#232B5E", "#5C6BC0", PLATA, "#FFFFFF"].map((color) => (
                <span key={color} className="w-8 h-8 rounded-full border border-white/20" style={{ background: color }}></span>
              ))}
            </div>
            <p className="text-xs font-sans-clean mt-4 opacity-60 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {isEs ? "Reservamos el azul noche para la quinceañera" : "Midnight blue is reserved for the birthday girl"}
            </p>
          </section>
        </Revelar>

        {/* RSVP */}
        <Revelar>
          <section className="mb-16">
            <h2 className="font-cormorant text-center text-3xl italic text-white mb-3">
              {isEs ? "Confirma tu Asistencia" : "Confirm Your Attendance"}
            </h2>
            <p className="text-center text-sm font-cormorant italic opacity-70 mb-8">
              {isEs ? "Confirma antes del 1 de noviembre de 2026." : "Please confirm by November 1, 2026."}
            </p>

            {rsvpEnviado ? (
              <div className="max-w-md mx-auto text-center border rounded-xl p-8 font-sans-clean" style={{ borderColor: PLATA_TENUE }}>
                <CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: PLATA }} />
                <p className="text-sm font-semibold mb-1 text-white">
                  {isEs ? "¡Qué alegría contar contigo!" : "So happy you can join us!"}
                </p>
                <p className="text-xs opacity-60">
                  {isEs
                    ? "Tu confirmación se abrió en WhatsApp. Solo envía el mensaje para completarla."
                    : "Your confirmation opened in WhatsApp. Just send the message to complete it."}
                </p>
              </div>
            ) : (
              <form onSubmit={enviarRsvp} className="max-w-md mx-auto space-y-4 font-sans-clean">
                <div>
                  <label htmlFor="qc-nombre" className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">
                    {isEs ? "Nombre completo" : "Full name"}
                  </label>
                  <input
                    id="qc-nombre"
                    type="text"
                    required
                    value={rsvp.fullName}
                    onChange={(e) => setRsvp({ ...rsvp, fullName: e.target.value })}
                    placeholder={isEs ? "Escribe tu nombre como aparece en la invitación" : "Type your name as it appears on the invitation"}
                    className="w-full border rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
                    style={{ borderColor: `${PLATA_TENUE}66`, background: `${NOCHE_SUAVE}99` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="qc-asistencia" className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">
                      {isEs ? "Asistencia" : "Attendance"}
                    </label>
                    <select
                      id="qc-asistencia"
                      value={rsvp.attendance}
                      onChange={(e) => setRsvp({ ...rsvp, attendance: parseAttendance(e.target.value) })}
                      className="w-full border rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
                      style={{ borderColor: `${PLATA_TENUE}66`, background: NOCHE_SUAVE }}
                    >
                      <option value="Confirmado">{isEs ? "¡Ahí estaré!" : "I'll be there!"}</option>
                      <option value="Declina">{isEs ? "No podré asistir" : "Can't make it"}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="qc-acomp" className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">
                      {isEs ? "Personas" : "Guests"}
                    </label>
                    <select
                      id="qc-acomp"
                      value={rsvp.guestCount}
                      onChange={(e) => setRsvp({ ...rsvp, guestCount: Number(e.target.value) })}
                      className="w-full border rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
                      style={{ borderColor: `${PLATA_TENUE}66`, background: NOCHE_SUAVE }}
                    >
                      {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold py-4 rounded-full transition-opacity hover:opacity-85 min-h-[48px]"
                  style={{ background: PLATA, color: NOCHE }}
                >
                  <Send className="w-4 h-4" />
                  {isEs ? "Confirmar por WhatsApp" : "Confirm via WhatsApp"}
                </button>
                <p className="text-[11px] text-center opacity-50">
                  {isEs
                    ? "Usaremos esta información únicamente para organizar el evento."
                    : "We will use this information solely to organize the event."}
                </p>
              </form>
            )}
          </section>
        </Revelar>

        {/* Cierre */}
        <Revelar>
          <footer className="text-center pt-8">
            <p className="font-serif-display text-4xl text-white mb-2" aria-hidden="true">✦ XV ✦</p>
            <p className="font-cormorant text-sm italic opacity-60">
              {isEs ? "Te espero para brillar juntos — Amara" : "Come shine with me — Amara"}
            </p>
          </footer>
        </Revelar>
      </main>

      {/* Marca de agua */}
      <a
        href={createDemoWatermarkWhatsAppUrl(isEs ? "Quince Celestial — Amara" : "Celestial Quinceañera — Amara", isEs)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 inset-x-0 z-40 text-center py-3.5 text-[11px] uppercase tracking-[0.25em] font-sans-clean font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        style={{ background: PLATA, color: NOCHE }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isEs ? "◆ Muestra de exhibición — Cotizar este diseño" : "◆ Showcase sample — Get a quote for this design"}
      </a>
    </div>
  );
}
