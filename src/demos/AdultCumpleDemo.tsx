import { useState, useEffect, FormEvent } from "react";
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Check,
  Copy,
  GlassWater,
  Globe,
  Heart,
  MapPin,
  Music,
  Navigation,
  Quote,
  Send,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import DemoMusicToggle from "../components/common/DemoMusicToggle";
import DemoRsvpNotice from "../components/common/DemoRsvpNotice";
import Reveal from "../components/common/Reveal";
import { useLanguage } from "../context/LanguageContext";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface AdultCumpleDemoProps {
  onBackToHome: () => void;
}

/* -------------------------------------------------------------------------
 * Paleta náutica de gala: azul marino profundo, oro y arena.
 * Se declara aquí para que toda la muestra beba del mismo sitio.
 * ---------------------------------------------------------------------- */
const NAVY_DEEP = "#060D1F";
const NAVY = "#0B132B";
const NAVY_SOFT = "#151E3D";
const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F2D06B";
const SAND = "#E8DCC8";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1600";

const GALLERY = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900",
];

/** Separador editorial con rombo, para respirar entre secciones. */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <span className="h-px w-16 sm:w-28" style={{ background: `linear-gradient(to right, transparent, ${GOLD}80)` }} />
      <span className="rotate-45 block w-2 h-2 border" style={{ borderColor: GOLD }} />
      <span className="h-px w-16 sm:w-28" style={{ background: `linear-gradient(to left, transparent, ${GOLD}80)` }} />
    </div>
  );
}

/** Encabezado de sección: antetítulo, título serif y separador. */
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <span className="text-[10px] uppercase tracking-[0.45em] font-semibold block mb-3" style={{ color: GOLD }}>
        {eyebrow}
      </span>
      <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-4">{title}</h2>
      <Divider />
    </div>
  );
}

export default function AdultCumpleDemo({ onBackToHome }: AdultCumpleDemoProps) {
  const { language, setLanguage, t } = useLanguage();
  const isEs = language === "es";

  const targetDate = new Date("2026-12-05T20:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Muro de brindis: el subnav ya lo anunciaba, pero la sección no existía.
  const [toasts, setToasts] = useState([
    {
      id: "1",
      name: "Ing. Alejandro Sterling",
      text: "¡Felices 50, Roberto! Un brindis por décadas de amistad, negocios compartidos y sobremesas que no acababan nunca.",
      date: isEs ? "Hace 4 horas" : "4 hours ago",
    },
    {
      id: "2",
      name: "Familia Vicini",
      text: "Listos para celebrar en la Marina este hito inolvidable. ¡Que vengan otros cincuenta!",
      date: isEs ? "Ayer" : "Yesterday",
    },
    {
      id: "3",
      name: "Carmen & Luis Bermúdez",
      text: "Medio siglo y sigues siendo el primero en levantar la copa. Nos vemos en Portofino.",
      date: isEs ? "Hace 2 días" : "2 days ago",
    },
  ]);
  const [toastName, setToastName] = useState("");
  const [toastText, setToastText] = useState("");
  const [toastPublished, setToastPublished] = useState(false);

  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 2,
    menuPreference: isEs ? "Cena de gala" : "Gala dinner",
    dietaryNotes: "",
    songRequest: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const difference = targetDate - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Cierra la foto ampliada con Escape.
  useEffect(() => {
    if (!activePhoto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActivePhoto(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activePhoto]);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      audioCtx?.close();
      setAudioCtx(null);
      setIsPlayingMusic(false);
      return;
    }
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(196, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setAudioCtx(ctx);
      setIsPlayingMusic(true);
    } catch (err) {
      console.error("Audio error", err);
    }
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;
    const url = createRsvpWhatsAppUrl("50 Años Roberto Almánzar", rsvpData);
    setRsvpSubmitted(true);
    window.open(url, "_blank");
  };

  const handleAddToast = (e: FormEvent) => {
    e.preventDefault();
    if (!toastName.trim() || !toastText.trim()) return;
    setToasts([
      { id: String(Date.now()), name: toastName.trim(), text: toastText.trim(), date: isEs ? "Justo ahora" : "Just now" },
      ...toasts,
    ]);
    setToastName("");
    setToastText("");
    setToastPublished(true);
    setTimeout(() => setToastPublished(false), 4000);
  };

  const copyAccount = () => {
    navigator.clipboard?.writeText("Banco Popular · 794-28451-9 · Roberto Almánzar");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261206T000000Z",
      "DTEND:20261206T060000Z",
      "SUMMARY:50 Años de Roberto Almánzar",
      "LOCATION:Marina Casa de Campo, La Romana",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "roberto-50.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const timeline = [
    { year: "1976", es: "Nace en Santiago, el mayor de cuatro hermanos.", en: "Born in Santiago, eldest of four siblings." },
    { year: "1998", es: "Se gradúa de Ingeniería Industrial y funda su primer taller.", en: "Graduates in Industrial Engineering and opens his first workshop." },
    { year: "2004", es: "Se casa con Isabel, cómplice de todos los proyectos que vinieron.", en: "Marries Isabel, partner in every project that followed." },
    { year: "2011", es: "Nacen los mellizos. La casa nunca volvió a estar en silencio.", en: "The twins are born. The house was never quiet again." },
    { year: "2019", es: "Cruza el Atlántico a vela: un sueño de treinta años cumplido.", en: "Sails across the Atlantic: a thirty-year dream fulfilled." },
    { year: "2026", es: "Medio siglo. Y la mejor parte apenas empieza.", en: "Half a century. And the best part is just beginning." },
  ];

  const schedule = [
    { time: "8:00 PM", icon: Anchor, es: "Recepción en el muelle", en: "Dockside reception", detail_es: "Cóctel de bienvenida frente a los yates.", detail_en: "Welcome cocktail facing the yachts." },
    { time: "9:00 PM", icon: GlassWater, es: "Brindis de honor", en: "Toast of honour", detail_es: "Palabras de Isabel y los hijos.", detail_en: "Words from Isabel and the children." },
    { time: "9:30 PM", icon: Utensils, es: "Cena de gala", en: "Gala dinner", detail_es: "Menú de tres tiempos con maridaje.", detail_en: "Three-course menu with pairing." },
    { time: "11:00 PM", icon: Music, es: "Música en vivo & baile", en: "Live music & dancing", detail_es: "Son, salsa y los clásicos de siempre.", detail_en: "Son, salsa and the old classics." },
    { time: "12:30 AM", icon: Sparkles, es: "Cigar lounge & ron añejo", en: "Cigar lounge & aged rum", detail_es: "Sobremesa en la terraza, hasta que el cuerpo aguante.", detail_en: "Terrace nightcap, for as long as it lasts." },
  ];

  const palette = [
    { name: isEs ? "Azul marino" : "Navy", hex: "#0B132B" },
    { name: isEs ? "Oro viejo" : "Antique gold", hex: GOLD },
    { name: isEs ? "Arena" : "Sand", hex: SAND },
    { name: isEs ? "Blanco hueso" : "Off white", hex: "#F7F4EF" },
  ];

  const lx = (es: string, en: string) => (isEs ? es : en);

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const inputStyle = { background: NAVY_DEEP, border: `1px solid ${GOLD}33` };

  return (
    <div className="min-h-screen font-sans selection:bg-[#D4AF37]/30 relative" style={{ background: NAVY, color: SAND }}>
      {/* Control de audio persistente */}
      <div className="fixed bottom-6 left-6 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <DemoMusicToggle
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          isEs={isEs}
          labelOn={lx("Sonando", "Playing")}
          labelOff={lx("Reproducir música", "Play music")}
          className={`p-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
            isPlayingMusic ? "text-[#0B132B]" : "text-white/90 hover:bg-white/10"
          }`}
        />
      </div>

      {/* Barra de demostración */}
      <div
        className="text-white py-2 px-4 flex items-center justify-between text-xs font-medium sticky top-0 z-50 shadow-md"
        style={{ background: NAVY_SOFT }}
      >
        <button onClick={onBackToHome} className="flex items-center gap-1.5 text-white/70 hover:text-[#D4AF37] transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        <div className="flex items-center gap-1 bg-white/10 border rounded-full p-1 text-[10px] font-semibold" style={{ borderColor: `${GOLD}66` }}>
          <Globe className="w-3.5 h-3.5 ml-1 mr-0.5" style={{ color: GOLD }} aria-hidden="true" />
          <button
            onClick={() => setLanguage("es")}
            aria-pressed={isEs}
            className={`px-2 py-0.5 rounded-full transition-all ${isEs ? "text-black font-bold" : "text-white/70 hover:text-white"}`}
            style={isEs ? { background: GOLD } : undefined}
          >
            ES
          </button>
          <span className="text-white/30 text-[9px]" aria-hidden="true">|</span>
          <button
            onClick={() => setLanguage("en")}
            aria-pressed={!isEs}
            className={`px-2 py-0.5 rounded-full transition-all ${!isEs ? "text-black font-bold" : "text-white/70 hover:text-white"}`}
            style={!isEs ? { background: GOLD } : undefined}
          >
            EN
          </button>
        </div>

        <a
          href={createDemoWatermarkWhatsAppUrl("50 Años Roberto")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 transition-colors rounded-full"
          style={{ background: GOLD }}
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Navegación interna */}
      <nav
        className="backdrop-blur-md border-b sticky top-10 z-40 py-2.5 px-4 overflow-x-auto no-scrollbar"
        style={{ background: `${NAVY}E6`, borderColor: `${GOLD}4D` }}
        aria-label={lx("Secciones de la invitación", "Invitation sections")}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap">
          {[
            { id: "evento", es: "Celebración", en: "Celebration" },
            { id: "homenaje", es: "Medio Siglo", en: "Half a Century" },
            { id: "programa", es: "Programa", en: "Schedule" },
            { id: "lugar", es: "Ubicación", en: "Venue" },
            { id: "galeria", es: "Galería", en: "Gallery" },
            { id: "muro", es: "Muro de Brindis", en: "Toast Wall" },
          ].map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-[#D4AF37] transition-colors">
              {lx(item.es, item.en)}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("rsvp")}
            className="text-black px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm"
            style={{ background: GOLD }}
          >
            RSVP
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- HERO */}
      <header id="evento" className="relative min-h-[92vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.28 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${NAVY_DEEP}D9, ${NAVY}B3 45%, ${NAVY})` }} />
          {/* Brillo dorado que da profundidad a la escena */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full blur-3xl pointer-events-none"
            style={{ background: `${GOLD}1F` }}
          />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            {/* Monograma */}
            <div
              className="w-20 h-20 mx-auto mb-8 rounded-full border flex items-center justify-center"
              style={{ borderColor: `${GOLD}80` }}
            >
              <span className="font-serif text-2xl tracking-[0.1em]" style={{ color: GOLD }}>
                RA
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase mb-7 border"
              style={{ color: GOLD, borderColor: `${GOLD}66`, background: `${GOLD}14` }}
            >
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              {lx("50 Años de Elegancia", "50 Years of Elegance")}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-white mb-5 leading-[1.05]">
              Roberto
              <span className="block italic" style={{ color: GOLD }}>
                Almánzar
              </span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <Divider />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] font-semibold my-6" style={{ color: SAND }}>
              {lx("Sábado 5 de Diciembre, 2026", "Saturday, December 5, 2026")}
              <span className="block mt-2 text-white/50 tracking-[0.2em]">8:00 PM · Marina Casa de Campo</span>
            </p>
          </Reveal>

          <Reveal delay={340}>
            <p className="font-serif text-lg sm:text-2xl text-white/85 font-light italic max-w-xl mx-auto mb-10 leading-relaxed">
              {lx(
                "«Medio siglo celebrando la vida, la familia y la verdadera amistad.»",
                "«Half a century celebrating life, family and true friendship.»"
              )}
            </p>
          </Reveal>

          {/* Cuenta regresiva */}
          <Reveal delay={420}>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto mb-10">
              {[
                { v: timeLeft.days, l: t("boda.days") },
                { v: timeLeft.hours, l: t("boda.hours") },
                { v: timeLeft.minutes, l: t("boda.minutes") },
                { v: timeLeft.seconds, l: t("boda.seconds") },
              ].map((unit) => (
                <div
                  key={unit.l}
                  className="py-4 rounded-2xl border backdrop-blur-sm"
                  style={{ background: `${NAVY_SOFT}CC`, borderColor: `${GOLD}33` }}
                >
                  <span className="font-serif text-3xl sm:text-4xl block" style={{ color: GOLD }}>
                    {String(unit.v).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/60">{unit.l}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => scrollToSection("rsvp")}
                className="px-8 py-4 text-black font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: GOLD }}
              >
                {lx("Confirmar asistencia", "Confirm attendance")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={addToCalendar}
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white/5"
                style={{ borderColor: `${GOLD}80`, color: GOLD }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Guardar la fecha", "Save the date")}
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ----------------------------------------------------------- HOMENAJE */}
      <section id="homenaje" className="py-24 px-5" style={{ background: NAVY_DEEP }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Homenaje", "Tribute")} title={lx("Medio siglo en seis momentos", "Half a century in six moments")} />
          </Reveal>

          <div className="relative">
            {/* Línea vertical de la cronología */}
            <span
              className="absolute left-[15px] sm:left-1/2 top-2 bottom-2 w-px sm:-translate-x-1/2"
              style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}66, transparent)` }}
              aria-hidden="true"
            />
            <ol className="space-y-10">
              {timeline.map((item, idx) => (
                <li key={item.year}>
                  <Reveal delay={idx * 80} from={idx % 2 === 0 ? "left" : "right"}>
                    <div className={`relative pl-12 sm:pl-0 sm:w-1/2 ${idx % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"}`}>
                      <span
                        className={`absolute left-2 sm:left-auto top-2 w-3 h-3 rotate-45 border-2 ${
                          idx % 2 === 0 ? "sm:-right-1.5" : "sm:-left-1.5"
                        }`}
                        style={{ borderColor: GOLD, background: NAVY_DEEP }}
                        aria-hidden="true"
                      />
                      <span className="font-serif text-2xl block mb-1" style={{ color: GOLD }}>
                        {item.year}
                      </span>
                      <p className="text-sm text-white/75 leading-relaxed">{lx(item.es, item.en)}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- PROGRAMA */}
      <section id="programa" className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("La noche", "The night")} title={lx("Programa de la velada", "Evening schedule")} />
          </Reveal>

          <ol className="space-y-4">
            {schedule.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div
                    className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border transition-colors hover:border-[#D4AF37]/50"
                    style={{ background: NAVY_SOFT, borderColor: `${GOLD}26` }}
                  >
                    <div
                      className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center"
                      style={{ borderColor: `${GOLD}66`, background: `${GOLD}0F` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: GOLD }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: GOLD }}>
                        {item.time}
                      </span>
                      <h3 className="font-serif text-xl text-white mb-1">{lx(item.es, item.en)}</h3>
                      <p className="text-xs text-white/60 leading-relaxed">{lx(item.detail_es, item.detail_en)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------------- LUGAR */}
      <section id="lugar" className="py-24 px-5" style={{ background: NAVY_DEEP }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Dónde", "Where")} title={lx("Marina Casa de Campo", "Marina Casa de Campo")} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${GOLD}33` }}>
                <iframe
                  title={lx("Mapa de Marina Casa de Campo", "Map of Marina Casa de Campo")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.0!2d-68.9!3d18.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMarina%20Casa%20de%20Campo!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="space-y-5">
                <div className="p-7 rounded-3xl border" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <MapPin className="w-4 h-4" aria-hidden="true" /> {lx("Lugar", "Venue")}
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-1.5">Plaza Portofino</h3>
                  <p className="text-sm text-white/60 mb-6">
                    {lx("Lounge privado frente al muelle · La Romana", "Private dockside lounge · La Romana")}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Marina+Casa+de+Campo+La+Romana"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 text-black text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                      style={{ background: GOLD }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?q=Marina%20Casa%20de%20Campo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-white/5 transition-colors"
                      style={{ borderColor: `${GOLD}80`, color: GOLD }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                    </a>
                  </div>
                </div>

                {/* Dress code con paleta real */}
                <div className="p-7 rounded-3xl border" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {lx("Código de vestimenta", "Dress code")}
                  </div>
                  <h3 className="font-serif text-xl text-white mb-1.5">
                    {lx("Cocktail elegante", "Elegant cocktail")}
                  </h3>
                  <p className="text-sm text-white/60 mb-5">
                    {lx(
                      "Traje oscuro o guayabera de lino. Vestido largo o midi.",
                      "Dark suit or linen guayabera. Long or midi dress."
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    {palette.map((color) => (
                      <div key={color.hex} className="text-center">
                        <span
                          className="block w-11 h-11 rounded-full border mb-1.5"
                          style={{ background: color.hex, borderColor: "rgba(255,255,255,0.25)" }}
                          aria-hidden="true"
                        />
                        <span className="text-[9px] text-white/50 uppercase tracking-wider">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mesa de regalos */}
                <div className="p-7 rounded-3xl border" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Heart className="w-4 h-4" aria-hidden="true" /> {lx("Un detalle", "A gift")}
                  </div>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    {lx(
                      "Tu presencia es el regalo. Si aun así quieres tener un detalle, aquí tienes los datos.",
                      "Your presence is the gift. If you'd still like to give something, here are the details."
                    )}
                  </p>
                  <button
                    onClick={copyAccount}
                    className="w-full px-5 py-3.5 border text-[11px] font-semibold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-white/5 transition-colors"
                    style={{ borderColor: `${GOLD}80`, color: copiedAccount ? GOLD_LIGHT : GOLD }}
                  >
                    {copiedAccount ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                    {copiedAccount ? lx("¡Copiado!", "Copied!") : lx("Copiar datos bancarios", "Copy bank details")}
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ GALERÍA */}
      <section id="galeria" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Recuerdos", "Memories")} title={lx("Cincuenta años en imágenes", "Fifty years in pictures")} />
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {GALLERY.map((img, idx) => (
              <Reveal key={img} delay={idx * 60}>
                <button
                  type="button"
                  onClick={() => setActivePhoto(img)}
                  aria-label={lx(`Ampliar fotografía ${idx + 1}`, `Enlarge photo ${idx + 1}`)}
                  className="group relative block w-full h-44 sm:h-60 rounded-2xl overflow-hidden border focus-visible:outline-none focus-visible:ring-2"
                  style={{ borderColor: `${GOLD}33` }}
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
                      {lx("Ampliar", "Enlarge")}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- MURO DE BRINDIS */}
      <section id="muro" className="py-24 px-5" style={{ background: NAVY_DEEP }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Para Roberto", "For Roberto")} title={lx("Muro de brindis", "Toast wall")} />
          </Reveal>

          <Reveal>
            <form onSubmit={handleAddToast} className="p-6 sm:p-8 rounded-3xl border mb-8 space-y-4" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
              <div>
                <label htmlFor="toast-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                  {lx("Tu nombre", "Your name")}
                </label>
                <input
                  id="toast-name"
                  type="text"
                  value={toastName}
                  onChange={(e) => setToastName(e.target.value)}
                  placeholder={lx("Ej. Familia Bermúdez", "E.g. The Bermúdez family")}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="toast-text" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                  {lx("Tu brindis", "Your toast")}
                </label>
                <textarea
                  id="toast-text"
                  rows={3}
                  value={toastText}
                  onChange={(e) => setToastText(e.target.value)}
                  placeholder={lx("Escribe unas palabras para Roberto...", "Write a few words for Roberto...")}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 text-black font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                style={{ background: GOLD }}
              >
                <Send className="w-4 h-4" aria-hidden="true" /> {lx("Publicar brindis", "Post toast")}
              </button>
              {toastPublished && (
                <p role="status" aria-live="polite" className="text-xs text-center" style={{ color: GOLD_LIGHT }}>
                  {lx(
                    "Tu brindis aparece abajo. En una invitación real quedaría guardado para los anfitriones.",
                    "Your toast appears below. In a real invitation it would be saved for the hosts."
                  )}
                </p>
              )}
            </form>
          </Reveal>

          <div className="space-y-4">
            {toasts.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 60}>
                <article className="p-6 rounded-2xl border relative" style={{ background: NAVY_SOFT, borderColor: `${GOLD}26` }}>
                  <Quote className="w-7 h-7 absolute top-5 right-5" style={{ color: `${GOLD}33` }} aria-hidden="true" />
                  <p className="font-serif text-base sm:text-lg text-white/85 italic leading-relaxed mb-4 pr-8">“{item.text}”</p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                    <span className="font-semibold" style={{ color: GOLD }}>
                      {item.name}
                    </span>
                    <span className="text-white/40">{item.date}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- RSVP */}
      <section id="rsvp" className="py-24 px-5 pb-32">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Te esperamos", "We're expecting you")} title={lx("Confirma tu asistencia", "Confirm your attendance")} />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2 shadow-2xl" style={{ background: NAVY_SOFT, borderColor: GOLD }}>
              <p className="text-xs text-white/60 text-center mb-7">
                {lx("Agradecemos confirmar antes del 20 de noviembre", "Please confirm before November 20")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="rsvp-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    required
                    value={rsvpData.fullName}
                    onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                    placeholder={lx("Ej. Roberto & Isabel", "E.g. Roberto & Isabel")}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="rsvp-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select
                      id="rsvp-attendance"
                      value={rsvpData.attendance}
                      onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="Confirmado">{lx("¡Ahí estaré para brindar!", "I'll be there to toast!")}</option>
                      <option value="Declina">{lx("No podré asistir", "I can't make it")}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rsvp-guests" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Nº de personas", "Number of guests")}
                    </label>
                    <select
                      id="rsvp-guests"
                      value={rsvpData.guestCount}
                      onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="rsvp-menu" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Preferencia de menú", "Menu preference")}
                  </label>
                  <select
                    id="rsvp-menu"
                    value={rsvpData.menuPreference}
                    onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option>{lx("Cena de gala", "Gala dinner")}</option>
                    <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                    <option>{lx("Opción sin gluten", "Gluten-free option")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rsvp-notes" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Alergias o notas (opcional)", "Allergies or notes (optional)")}
                  </label>
                  <input
                    id="rsvp-notes"
                    type="text"
                    value={rsvpData.dietaryNotes}
                    onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })}
                    placeholder={lx("Ej. Alérgico a los mariscos", "E.g. Allergic to shellfish")}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="rsvp-song" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Pide una canción (opcional)", "Request a song (optional)")}
                  </label>
                  <input
                    id="rsvp-song"
                    type="text"
                    value={rsvpData.songRequest}
                    onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })}
                    placeholder={lx("Ej. Juan Luis Guerra — Bachata Rosa", "E.g. Juan Luis Guerra — Bachata Rosa")}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-black font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: GOLD }}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {lx("Enviar confirmación por WhatsApp", "Send confirmation via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && <DemoRsvpNotice isEs={isEs} tone="dark" />}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-xs text-white/45 mt-10 leading-relaxed">
              {lx("Con cariño, la familia Almánzar Reyes", "With love, the Almánzar Reyes family")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Foto ampliada */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lx("Fotografía ampliada", "Enlarged photo")}
        >
          <button
            onClick={() => setActivePhoto(null)}
            aria-label={lx("Cerrar", "Close")}
            className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <img
            src={activePhoto}
            alt=""
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}
