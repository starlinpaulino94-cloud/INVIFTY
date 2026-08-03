import { useState, useEffect, useRef, ReactNode, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import {
  ArrowLeft, Clock, Navigation, Send, CheckCircle2, Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * MUESTRA — BODA EDITORIAL "ELENA & GABRIEL"
 * ==========================================
 * Estilo editorial clásico del nuevo sistema de diseño de Invifty:
 * papel marfil, tipografía serif de revista, filetes dorados y
 * apertura de sobre lacrado. Toda la información es ficticia.
 */

const TINTA = "#1C1A17";
const ORO = "#B89B5E";
const PAPEL = "#F4EFE6";
const PAPEL_SOMBRA = "#EBE4D6";

function reduceMotion(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Aparece con un fundido suave al entrar en pantalla. */
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

/** Filete editorial: línea — rombo — línea. */
function Filete() {
  return (
    <div className="flex items-center justify-center gap-3 my-2" aria-hidden="true">
      <span className="block w-16 h-px" style={{ background: ORO }}></span>
      <span className="block w-1.5 h-1.5 rotate-45" style={{ background: ORO }}></span>
      <span className="block w-16 h-px" style={{ background: ORO }}></span>
    </div>
  );
}

interface DemoProps {
  onBackToHome: () => void;
}

export default function EditorialBodaDemo({ onBackToHome }: DemoProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Sobre lacrado: cerrado → abriéndose → retirado
  const [abierto, setAbierto] = useState(false);
  const [sobreRetirado, setSobreRetirado] = useState(false);

  const abrirSobre = () => {
    setAbierto(true);
    window.setTimeout(() => setSobreRetirado(true), reduceMotion() ? 0 : 900);
  };

  // Cuenta regresiva al 12 de diciembre de 2026, 5:30 PM
  const targetDate = new Date("2026-12-12T17:30:00").getTime();
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

  // RSVP compacto
  const [rsvp, setRsvp] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
  });
  const [rsvpEnviado, setRsvpEnviado] = useState(false);

  const enviarRsvp = (e: FormEvent) => {
    e.preventDefault();
    window.open(createRsvpWhatsAppUrl("Boda Elena & Gabriel (Muestra)", rsvp), "_blank", "noopener");
    setRsvpEnviado(true);
  };

  const cuenta = [
    { v: timeLeft.days, l: isEs ? "Días" : "Days" },
    { v: timeLeft.hours, l: isEs ? "Horas" : "Hours" },
    { v: timeLeft.minutes, l: isEs ? "Minutos" : "Minutes" },
    { v: timeLeft.seconds, l: isEs ? "Segundos" : "Seconds" },
  ];

  return (
    <div className="min-h-screen font-cormorant" style={{ background: PAPEL, color: TINTA }}>

      {/* ===== SOBRE LACRADO (portada de apertura) ===== */}
      {!sobreRetirado && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${
            abierto ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ background: PAPEL_SOMBRA }}
        >
          <div className="w-full max-w-sm border p-10 text-center relative" style={{ borderColor: ORO, background: PAPEL }}>
            <div className="absolute inset-2 border pointer-events-none" style={{ borderColor: `${ORO}66` }} aria-hidden="true"></div>
            <p className="text-[11px] uppercase tracking-[0.5em] mb-6" style={{ color: ORO }}>
              {isEs ? "Nuestra boda" : "Our wedding"}
            </p>
            <h1 className="text-5xl italic mb-2">Elena</h1>
            <p className="text-xl" style={{ color: ORO }}>&amp;</p>
            <h1 className="text-5xl italic mb-6">Gabriel</h1>
            <p className="text-sm tracking-[0.35em] mb-10">12 · 12 · 2026</p>

            {/* Sello de lacre */}
            <button
              type="button"
              onClick={abrirSobre}
              aria-label={isEs ? "Abrir la invitación" : "Open the invitation"}
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 animate-pulse-gold"
              style={{ background: `radial-gradient(circle at 35% 30%, ${ORO}, #8A7346)` }}
            >
              <span className="font-cormorant text-2xl italic" aria-hidden="true">E·G</span>
            </button>
            <p className="text-xs italic mt-5 opacity-60">
              {isEs ? "Toca el sello para abrir" : "Tap the seal to open"}
            </p>
          </div>
        </div>
      )}

      {/* ===== BARRA SUPERIOR ===== */}
      <header className="sticky top-0 z-40 backdrop-blur-sm border-b" style={{ background: `${PAPEL}E6`, borderColor: `${ORO}40` }}>
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans-clean font-semibold hover:opacity-70 transition-opacity min-h-[44px]"
            style={{ color: TINTA }}
          >
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver a Invifty" : "Back to Invifty"}
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans-clean font-semibold" style={{ color: ORO }}>
            ◆ {isEs ? "Muestra" : "Sample"}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pb-40">

        {/* ===== PORTADA EDITORIAL ===== */}
        <section className="text-center pt-20 pb-16">
          <Revelar>
            <p className="text-xs uppercase tracking-[0.5em] mb-8 font-sans-clean" style={{ color: ORO }}>
              {isEs ? "Con la bendición de nuestras familias" : "With the blessing of our families"}
            </p>
            <h1 className="text-6xl sm:text-8xl italic leading-none mb-1">Elena</h1>
            <p className="text-3xl my-3" style={{ color: ORO }}>&amp;</p>
            <h1 className="text-6xl sm:text-8xl italic leading-none mb-8">Gabriel</h1>
            <Filete />
            <p className="text-lg italic mt-6 max-w-md mx-auto leading-relaxed">
              {isEs
                ? "Con mucha alegría queremos compartir contigo el inicio de esta nueva etapa."
                : "With great joy, we want to share the beginning of this new chapter with you."}
            </p>
            <p className="text-sm uppercase tracking-[0.35em] mt-8 font-sans-clean">
              {isEs ? "Sábado 12 de diciembre de 2026 · 5:30 PM" : "Saturday, December 12, 2026 · 5:30 PM"}
            </p>
          </Revelar>
        </section>

        {/* ===== CUENTA REGRESIVA ===== */}
        <Revelar>
          <section className="border py-10 px-6 text-center mb-20" style={{ borderColor: ORO }}>
            <p className="text-[11px] uppercase tracking-[0.4em] mb-6 font-sans-clean" style={{ color: ORO }}>
              {isEs ? "Faltan" : "Countdown"}
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {cuenta.map((c, i) => (
                <div key={i}>
                  <span className="block text-4xl sm:text-5xl">{c.v}</span>
                  <span className="block text-[10px] uppercase tracking-[0.25em] mt-1 font-sans-clean opacity-60">{c.l}</span>
                </div>
              ))}
            </div>
          </section>
        </Revelar>

        {/* ===== CEREMONIA & RECEPCIÓN ===== */}
        <Revelar>
          <section className="mb-20">
            <h2 className="text-center text-3xl italic mb-2">{isEs ? "Ceremonia & Recepción" : "Ceremony & Reception"}</h2>
            <Filete />
            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {[
                {
                  titulo: isEs ? "Ceremonia" : "Ceremony",
                  lugar: "Iglesia Regina Angelorum",
                  direccion: isEs ? "Zona Colonial, Santo Domingo" : "Colonial Zone, Santo Domingo",
                  hora: "5:30 PM",
                },
                {
                  titulo: isEs ? "Recepción" : "Reception",
                  lugar: "Jardines del Hotel Embajador",
                  direccion: "Av. Sarasota 65, Santo Domingo",
                  hora: "7:30 PM",
                },
              ].map((sede, i) => (
                <article key={i} className="border p-8 text-center" style={{ borderColor: `${ORO}66`, background: "#FBF8F1" }}>
                  <p className="text-[11px] uppercase tracking-[0.4em] mb-4 font-sans-clean" style={{ color: ORO }}>{sede.titulo}</p>
                  <h3 className="text-2xl italic mb-1">{sede.lugar}</h3>
                  <p className="text-sm opacity-70 mb-2">{sede.direccion}</p>
                  <p className="text-sm inline-flex items-center gap-1.5 mb-6"><Clock className="w-4 h-4" style={{ color: ORO }} /> {sede.hora}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(sede.lugar + ", Santo Domingo")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-sans-clean font-semibold px-6 py-3 text-white transition-opacity hover:opacity-85 min-h-[44px] w-full sm:w-auto"
                    style={{ background: TINTA }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {isEs ? "Cómo llegar" : "Get directions"}
                  </a>
                </article>
              ))}
            </div>
          </section>
        </Revelar>

        {/* ===== DRESS CODE ===== */}
        <Revelar>
          <section className="text-center mb-20">
            <h2 className="text-3xl italic mb-2">{isEs ? "Código de Vestimenta" : "Dress Code"}</h2>
            <Filete />
            <p className="text-lg italic mt-6 mb-6 max-w-md mx-auto">
              {isEs
                ? "Etiqueta formal. Agradecemos reservar el color blanco para la novia."
                : "Formal attire. We kindly ask that white be reserved for the bride."}
            </p>
            <div className="flex items-center justify-center gap-3" aria-hidden="true">
              {["#1C1A17", "#4A4238", "#7A6A4F", ORO, "#9CA88A"].map((color) => (
                <span key={color} className="w-8 h-8 rounded-full border border-black/10" style={{ background: color }}></span>
              ))}
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] mt-3 font-sans-clean opacity-50">
              {isEs ? "Paleta sugerida" : "Suggested palette"}
            </p>
          </section>
        </Revelar>

        {/* ===== NUESTRA HISTORIA ===== */}
        <Revelar>
          <section className="text-center mb-20 border-y py-14" style={{ borderColor: `${ORO}40` }}>
            <p className="text-[11px] uppercase tracking-[0.4em] mb-6 font-sans-clean" style={{ color: ORO }}>
              {isEs ? "Nuestra historia" : "Our story"}
            </p>
            <p className="text-xl italic leading-relaxed max-w-lg mx-auto">
              {isEs
                ? "«Una historia construida con viajes, conversaciones y muchos sueños. Después de siete años caminando juntos, llegó el día de decir que sí.»"
                : "“A story built on travels, conversations and many dreams. After seven years walking together, the day to say yes has arrived.”"}
            </p>
          </section>
        </Revelar>

        {/* ===== RSVP ===== */}
        <Revelar>
          <section className="mb-16">
            <h2 className="text-center text-3xl italic mb-2">{isEs ? "Confirma tu Asistencia" : "Confirm Your Attendance"}</h2>
            <Filete />
            <p className="text-center text-sm italic opacity-70 mt-4 mb-8">
              {isEs ? "Por favor confirma antes del 15 de noviembre de 2026." : "Please confirm by November 15, 2026."}
            </p>

            {rsvpSubmittedView(rsvpEnviado, isEs) ?? (
              <form onSubmit={enviarRsvp} className="max-w-md mx-auto space-y-4 font-sans-clean">
                <div>
                  <label htmlFor="ed-nombre" className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">
                    {isEs ? "Nombre completo" : "Full name"}
                  </label>
                  <input
                    id="ed-nombre"
                    type="text"
                    required
                    value={rsvp.fullName}
                    onChange={(e) => setRsvp({ ...rsvp, fullName: e.target.value })}
                    placeholder={isEs ? "Escribe tu nombre como aparece en la invitación" : "Type your name as it appears on the invitation"}
                    className="w-full border bg-white px-4 py-3 text-sm focus:outline-none"
                    style={{ borderColor: `${ORO}80`, color: TINTA }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ed-asistencia" className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">
                      {isEs ? "Asistencia" : "Attendance"}
                    </label>
                    <select
                      id="ed-asistencia"
                      value={rsvp.attendance}
                      onChange={(e) => setRsvp({ ...rsvp, attendance: e.target.value as RsvpFormData["attendance"] })}
                      className="w-full border bg-white px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: `${ORO}80`, color: TINTA }}
                    >
                      <option value="Confirmado">{isEs ? "¡Ahí estaré!" : "I'll be there!"}</option>
                      <option value="No podré asistir">{isEs ? "No podré asistir" : "Can't make it"}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ed-acomp" className="block text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">
                      {isEs ? "Personas" : "Guests"}
                    </label>
                    <select
                      id="ed-acomp"
                      value={rsvp.guestCount}
                      onChange={(e) => setRsvp({ ...rsvp, guestCount: Number(e.target.value) })}
                      className="w-full border bg-white px-4 py-3 text-sm focus:outline-none"
                      style={{ borderColor: `${ORO}80`, color: TINTA }}
                    >
                      {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 text-white text-[11px] uppercase tracking-[0.25em] font-bold py-4 transition-opacity hover:opacity-85 min-h-[48px]"
                  style={{ background: TINTA }}
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

        {/* ===== CIERRE ===== */}
        <Revelar>
          <footer className="text-center pt-10">
            <p className="text-5xl italic mb-3" style={{ color: ORO }}>E · G</p>
            <p className="text-sm italic opacity-60">
              {isEs ? "Con amor, Elena & Gabriel" : "With love, Elena & Gabriel"}
            </p>
          </footer>
        </Revelar>
      </main>

      {/* ===== MARCA DE AGUA DE MUESTRA ===== */}
      <a
        href={createDemoWatermarkWhatsAppUrl(isEs ? "Boda Editorial — Elena & Gabriel" : "Editorial Wedding — Elena & Gabriel", isEs)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 inset-x-0 z-40 text-center py-3.5 text-[11px] uppercase tracking-[0.25em] font-sans-clean font-bold text-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        style={{ background: ORO }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isEs ? "◆ Muestra de exhibición — Cotizar este diseño" : "◆ Showcase sample — Get a quote for this design"}
      </a>
    </div>
  );
}

/** Mensaje de éxito del RSVP (null mientras no se ha enviado). */
function rsvpSubmittedView(enviado: boolean, isEs: boolean) {
  if (!enviado) return null;
  return (
    <div className="max-w-md mx-auto text-center border p-8 font-sans-clean" style={{ borderColor: "#B89B5E" }}>
      <CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: "#B89B5E" }} />
      <p className="text-sm font-semibold mb-1">
        {isEs ? "¡Qué alegría contar contigo!" : "So happy you can join us!"}
      </p>
      <p className="text-xs opacity-60">
        {isEs
          ? "Tu confirmación se abrió en WhatsApp. Solo envía el mensaje para completarla."
          : "Your confirmation opened in WhatsApp. Just send the message to complete it."}
      </p>
    </div>
  );
}
