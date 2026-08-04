import { useState, useEffect, useRef, ReactNode } from "react";
import { createDemoWatermarkWhatsAppUrl } from "../utils/whatsapp";
import { buildWhatsAppUrl } from "../config";
import { ArrowLeft, Navigation, Sparkles, CalendarPlus, QrCode, MessageCircle, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * MUESTRA — SUMMIT CORPORATIVO "AURORA 2027"
 * ==========================================
 * Estilo minimal corporativo del nuevo sistema de diseño: fondo claro,
 * tipografía geométrica y un acento de marca. Datos ficticios.
 */

const FONDO = "#FAFAFA";
const TINTA = "#101828";
const GRIS = "#475467";
const MARCA = "#3B4FE0";
const VERDE = "#2BB3A3";

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
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface DemoProps {
  onBackToHome: () => void;
}

export default function AuroraSummitDemo({ onBackToHome }: DemoProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Cuenta regresiva al 18 de marzo de 2027, 9:00 AM
  const targetDate = new Date("2027-03-18T09:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const agenda = [
    { hora: "9:00 AM", texto: isEs ? "Registro y acreditación con QR" : "Registration & QR check-in" },
    { hora: "10:00 AM", texto: isEs ? "Keynote: El futuro de la experiencia digital" : "Keynote: The future of digital experience" },
    { hora: "11:30 AM", texto: isEs ? "Panel: Innovación en el Caribe" : "Panel: Innovation in the Caribbean" },
    { hora: "1:00 PM", texto: isEs ? "Almuerzo ejecutivo y networking" : "Executive lunch & networking" },
    { hora: "3:00 PM", texto: isEs ? "Talleres simultáneos por industria" : "Parallel industry workshops" },
    { hora: "5:30 PM", texto: isEs ? "Cóctel de cierre" : "Closing cocktail" },
  ];

  const ponentes = [
    { iniciales: "LM", nombre: "Laura Medrano", cargo: isEs ? "Directora de Producto" : "Head of Product" },
    { iniciales: "JR", nombre: "José Rodríguez", cargo: isEs ? "CTO Regional" : "Regional CTO" },
    { iniciales: "AC", nombre: "Ana Castillo", cargo: isEs ? "Estratega de Innovación" : "Innovation Strategist" },
  ];

  const registroUrl = buildWhatsAppUrl(
    isEs
      ? "*REGISTRO — AURORA SUMMIT 2027 (Muestra Invifty)*\nHola, deseo reservar mi lugar en el summit. Nombre y empresa: "
      : "*REGISTRATION — AURORA SUMMIT 2027 (Invifty Sample)*\nHello, I would like to reserve my seat at the summit. Name & company: "
  );

  return (
    <div className="min-h-screen font-sans-clean" style={{ background: FONDO, color: TINTA }}>

      {/* Barra superior */}
      <header className="sticky top-0 z-40 backdrop-blur-sm border-b border-black/5" style={{ background: `${FONDO}E6` }}>
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-70 transition-opacity min-h-[44px]"
            style={{ color: TINTA }}
          >
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver a Invifty" : "Back to Invifty"}
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: MARCA }}>
            ◆ {isEs ? "Muestra" : "Sample"}
          </span>
        </div>
      </header>

      {/* Banda aurora */}
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${MARCA}, #7C5CE8, ${VERDE})` }} aria-hidden="true"></div>

      <main className="max-w-3xl mx-auto px-5 pb-40">

        {/* Portada */}
        <section className="pt-20 pb-14">
          <Revelar>
            <span className="inline-block w-14 h-1.5 mb-8" style={{ background: MARCA }} aria-hidden="true"></span>
            <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: GRIS }}>
              Vitrexi Technologies {isEs ? "presenta" : "presents"}
            </p>
            <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.05] mb-6">
              AURORA<br />SUMMIT <span style={{ color: MARCA }}>2027</span>
            </h1>
            <p className="text-base leading-relaxed max-w-lg mb-8" style={{ color: GRIS }}>
              {isEs
                ? "Una jornada de conocimiento, conversación y conexiones con los profesionales que están transformando la industria."
                : "A day of knowledge, conversation and connections with the professionals transforming the industry."}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: MARCA }} /> {isEs ? "Jueves 18 de marzo de 2027 · 9:00 AM" : "Thursday, March 18, 2027 · 9:00 AM"}</span>
            </div>
          </Revelar>
        </section>

        {/* Cuenta regresiva sobria */}
        <Revelar>
          <section className="rounded-2xl border border-black/10 bg-white p-8 mb-16 flex flex-wrap items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-8">
              {[
                { v: timeLeft.days, l: isEs ? "días" : "days" },
                { v: timeLeft.hours, l: isEs ? "horas" : "hours" },
                { v: timeLeft.minutes, l: "min" },
              ].map((c, i) => (
                <div key={i} className="text-center">
                  <span className="block text-4xl font-extrabold" style={{ color: MARCA }}>{c.v}</span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] mt-1" style={{ color: GRIS }}>{c.l}</span>
                </div>
              ))}
            </div>
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Aurora+Summit+2027&dates=20270318T130000Z/20270318T220000Z&location=Santo+Domingo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] border rounded-lg px-5 py-3 transition-colors hover:text-white min-h-[44px]"
              style={{ borderColor: MARCA, color: MARCA }}
              onMouseEnter={(e) => { e.currentTarget.style.background = MARCA; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <CalendarPlus className="w-4 h-4" />
              {isEs ? "Agendar" : "Add to calendar"}
            </a>
          </section>
        </Revelar>

        {/* Agenda */}
        <Revelar>
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold mb-8">{isEs ? "Agenda del día" : "Day agenda"}</h2>
            <ol className="border-l-2 pl-6 space-y-6" style={{ borderColor: `${MARCA}33` }}>
              {agenda.map((item, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? VERDE : MARCA }} aria-hidden="true"></span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color: MARCA }}>{item.hora}</span>
                  <span className="block text-base font-medium">{item.texto}</span>
                </li>
              ))}
            </ol>
          </section>
        </Revelar>

        {/* Ponentes */}
        <Revelar>
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold mb-8">{isEs ? "Ponentes destacados" : "Featured speakers"}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {ponentes.map((p, i) => (
                <article key={i} className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
                  <span
                    className="w-14 h-14 rounded-full inline-flex items-center justify-center text-white font-extrabold text-lg mb-3"
                    style={{ background: i === 1 ? VERDE : MARCA }}
                    aria-hidden="true"
                  >
                    {p.iniciales}
                  </span>
                  <h3 className="text-sm font-bold">{p.nombre}</h3>
                  <p className="text-xs mt-1" style={{ color: GRIS }}>{p.cargo}</p>
                </article>
              ))}
            </div>
          </section>
        </Revelar>

        {/* Acceso QR */}
        <Revelar>
          <section className="rounded-2xl p-8 mb-16 text-white" style={{ background: TINTA }}>
            <div className="flex items-start gap-5">
              <span className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `${MARCA}` }}>
                <QrCode className="w-6 h-6 text-white" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold mb-2">{isEs ? "Acceso con pase QR personal" : "Personal QR pass access"}</h2>
                <p className="text-sm leading-relaxed text-white/70">
                  {isEs
                    ? "Al confirmar tu registro recibirás un pase digital con código QR único. En la entrada solo lo escaneas: sin filas, sin listas en papel."
                    : "Once you confirm your registration you'll receive a digital pass with a unique QR code. Just scan it at the door: no lines, no paper lists."}
                </p>
              </div>
            </div>
          </section>
        </Revelar>

        {/* Lugar */}
        <Revelar>
          <section className="mb-16">
            <h2 className="text-2xl font-extrabold mb-4">{isEs ? "Sede" : "Venue"}</h2>
            <div className="rounded-2xl border border-black/10 bg-white p-8 flex flex-wrap items-center justify-between gap-6 shadow-sm">
              <div>
                <p className="text-lg font-bold">{isEs ? "Centro de Convenciones SD" : "SD Convention Center"}</p>
                <p className="text-sm" style={{ color: GRIS }}>Av. Winston Churchill 95, Santo Domingo</p>
                <p className="text-xs mt-2" style={{ color: GRIS }}>
                  {isEs ? "Parqueo con valet incluido para asistentes registrados." : "Valet parking included for registered attendees."}
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Av.%20Winston%20Churchill%2C%20Santo%20Domingo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white rounded-lg px-6 py-3.5 transition-opacity hover:opacity-90 min-h-[48px]"
                style={{ background: MARCA }}
              >
                <Navigation className="w-4 h-4" />
                {isEs ? "Cómo llegar" : "Get directions"}
              </a>
            </div>
          </section>
        </Revelar>

        {/* Registro */}
        <Revelar>
          <section className="text-center mb-12">
            <h2 className="text-2xl font-extrabold mb-3">{isEs ? "Reserva tu lugar" : "Reserve your seat"}</h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: GRIS }}>
              {isEs
                ? "Cupo limitado por aforo del salón principal. Confirma tu registro antes del 5 de marzo."
                : "Seating limited by main hall capacity. Confirm your registration by March 5."}
            </p>
            <a
              href={registroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] font-extrabold text-white px-10 py-4 rounded-lg transition-opacity hover:opacity-90 min-h-[48px]"
              style={{ background: `linear-gradient(90deg, ${MARCA}, #7C5CE8)` }}
            >
              <MessageCircle className="w-4 h-4" />
              {isEs ? "Registrarme por WhatsApp" : "Register via WhatsApp"}
            </a>
          </section>
        </Revelar>

        {/* Cierre */}
        <Revelar>
          <footer className="text-center pt-6 border-t border-black/10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] mt-6" style={{ color: GRIS }}>
              Vitrexi Technologies
            </p>
            <span className="inline-block w-10 h-1 mt-3" style={{ background: VERDE }} aria-hidden="true"></span>
          </footer>
        </Revelar>
      </main>

      {/* Marca de agua */}
      <a
        href={createDemoWatermarkWhatsAppUrl(isEs ? "Summit Corporativo — Aurora 2027" : "Corporate Summit — Aurora 2027", isEs)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 inset-x-0 z-40 text-center py-3.5 text-[11px] uppercase tracking-[0.25em] font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        style={{ background: TINTA }}
      >
        <Sparkles className="w-3.5 h-3.5" style={{ color: VERDE }} />
        {isEs ? "◆ Muestra de exhibición — Cotizar este diseño" : "◆ Showcase sample — Get a quote for this design"}
      </a>
    </div>
  );
}
