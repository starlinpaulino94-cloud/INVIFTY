import { useDemoFonts } from "../hooks/useDemoFonts";
import { parseAttendance } from "../utils/rsvp";
import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { MapPin, Calendar, Clock, Heart, Gift, CheckCircle2, Volume2, VolumeX, Copy, Check, Send, ExternalLink, ArrowLeft, Camera, X, MessageSquare, Sparkles, Navigation, Church, Wine, Utensils, QrCode, ShieldCheck, Globe, Music2 } from "lucide-react";
import coupleImg from "../assets/images/wedding_couple_demo.webp";
import { useLanguage } from "../context/LanguageContext";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { Rama, EsquinaBotanica, Brote, SeparadorBotanico } from "../components/demo/Botanica";
import SobreApertura from "../components/demo/SobreApertura";
import VipPassModal from "../components/VipPassModal";

interface BodaDemoProps {
  onBackToHome: () => void;
}

interface GuestbookMessage {
  id: string;
  name: string;
  relationship: string;
  message: string;
  date: string;
}

/* -------------------------------------------------------------------------
 * SISTEMA VISUAL DE ESTA INVITACIÓN
 * =========================================================================
 * Papelería fina de boda: marfil, crema, verde muy oscuro y un dorado
 * apagado que funciona como acento, nunca como relleno. La serif editorial
 * (Cormorant) lleva los titulares; la sans (Montserrat) la información
 * funcional; la caligráfica se reserva para el "&" y pequeños gestos.
 * ---------------------------------------------------------------------- */
const VERDE = "#101713";
const VERDE_2 = "#1B2620";
const MARFIL = "#FAF8F4";
const CREMA = "#F4EDE1";
const CREMA_2 = "#F8F3EA";
const ORO = "#B3924F";
const ORO_CLARO = "#CBB077";
const LINEA = "#E5DAC8";
const TINTA = "#2E2A24";
const TINTA_SUAVE = "#6F675A";

/** Botón principal: verde profundo con texto marfil. */
const BTN_VERDE =
  "inline-flex items-center justify-center gap-2 bg-[#101713] text-[#F5EFE3] font-sans-clean text-[11px] font-semibold uppercase tracking-[0.18em] py-3.5 px-6 rounded-lg min-h-[48px] transition-all duration-300 hover:bg-[#243128] active:scale-[0.99] touch-manipulation";

/** Botón secundario: línea dorada sobre fondo claro. */
const BTN_LINEA =
  "inline-flex items-center justify-center gap-2 bg-transparent text-[#101713] font-sans-clean text-[11px] font-semibold uppercase tracking-[0.18em] py-3.5 px-6 rounded-lg min-h-[48px] border border-[#B3924F]/50 transition-all duration-300 hover:border-[#B3924F] hover:bg-[#B3924F]/10 active:scale-[0.99] touch-manipulation";

/** Encabezado editorial de sección: antetítulo, título serif y separador. */
function Encabezado({
  eyebrow,
  titulo,
  variante = "diamante",
  claro = false,
}: {
  eyebrow: string;
  titulo: string;
  variante?: "rama" | "diamante" | "estrella";
  claro?: boolean;
}) {
  return (
    <div className="text-center mb-14">
      <span
        className="text-[10px] uppercase font-sans-clean tracking-[0.4em] font-semibold block mb-4"
        style={{ color: claro ? ORO_CLARO : ORO }}
      >
        {eyebrow}
      </span>
      <h2
        className="font-cormorant text-4xl sm:text-5xl font-medium leading-tight mb-5"
        style={{ color: claro ? MARFIL : VERDE }}
      >
        {titulo}
      </h2>
      <SeparadorBotanico variante={variante} className={claro ? "text-[#CBB077]" : "text-[#B3924F]"} />
    </div>
  );
}

export default function BodaDemo({ onBackToHome }: BodaDemoProps) {
  const { language, setLanguage, t } = useLanguage();
  useSectionReveal();
  useDemoFonts();

  // Target date: November 14, 2026 16:30:00 AST
  const targetDate = new Date("2026-11-14T16:30:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // La invitación llega dentro de un sobre lacrado: hasta que el invitado lo
  // abre con un toque, no se muestra el contenido.
  const [sobreAbierto, setSobreAbierto] = useState(false);
  // La barra de secciones solo aparece al dejar atrás la portada: sobre el
  // hero no aporta nada y le quitaba elegancia a la primera impresión.
  const [showSectionNav, setShowSectionNav] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showVipPassModal, setShowVipPassModal] = useState(false);

  // Guestbook State (Muro de buenos deseos)
  const [guestMessages, setGuestMessages] = useState<GuestbookMessage[]>([
    {
      id: "1",
      name: "Tía Sofía & Tío Roberto",
      relationship: "Familia de la Novia",
      message: "¡Que la bendición de Dios acompañe cada paso de sus vidas! Estamos felices de acompañarles en esta hermosa unión.",
      date: "Hace 2 horas"
    },
    {
      id: "2",
      name: "Gabriel & Mariana",
      relationship: "Amigos de la Universidad",
      message: "¡Listos para celebrar en Altos de Chavón! Que su amor siga siendo tan inspirador como el primer día.",
      date: "Ayer"
    },
    {
      id: "3",
      name: "Lic. Fernando Almanzar",
      relationship: "Familia del Novio",
      message: "Un honor ver crecer este amor. ¡Nos vemos en el baile y la hora loca!",
      date: "Hace 3 días"
    }
  ]);
  const [newMessage, setNewMessage] = useState({ name: "", relationship: "", message: "" });
  const [messageSent, setMessageSent] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 2,
    menuPreference: "Corte de Res Angus a las Tres Pimientas",
    dietaryNotes: "",
    songRequest: ""
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Mostrar la barra de secciones al pasar la portada
  useEffect(() => {
    const onScroll = () => setShowSectionNav(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Gentle audio synthesizer for demo background music
  const toggleAudio = () => {
    if (!isPlayingMusic) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setAudioCtx(ctx);
        setIsPlayingMusic(true);
      } catch (e) {
        setIsPlayingMusic(true);
      }
    } else {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsPlayingMusic(false);
    }
  };

  const copyToClipboard = (text: string, accountName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(accountName);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const url = createRsvpWhatsAppUrl("Boda Camila & Lucas", rsvpData);
    window.open(url, "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const handleGuestbookSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;

    const addedMsg: GuestbookMessage = {
      id: Date.now().toString(),
      name: newMessage.name,
      relationship: newMessage.relationship || "Invitado Especial",
      message: newMessage.message,
      date: "Hace un momento"
    };

    setGuestMessages([addedMsg, ...guestMessages]);
    setNewMessage({ name: "", relationship: "", message: "" });
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Boda Camila & Lucas — Enlace Matrimonial");
    const details = encodeURIComponent("Celebración del enlace matrimonial de Camila & Lucas en Altos de Chavón, La Romana.");
    const location = encodeURIComponent("Altos de Chavón, La Romana");
    const start = "20261114T203000Z";
    const end = "20261115T040000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const galleryImages = [
    coupleImg,
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800"
  ];

  /** Alturas alternadas de la galería, para un mosaico editorial y no un catálogo. */
  const alturasGaleria = ["h-72 sm:h-96", "h-56 sm:h-72", "h-72 sm:h-80", "h-56 sm:h-80", "h-72 sm:h-72", "h-56 sm:h-96"];

  const cuenta = [
    { v: timeLeft.days, l: "Días" },
    { v: timeLeft.hours, l: "Horas" },
    { v: timeLeft.minutes, l: "Min" },
    { v: timeLeft.seconds, l: "Seg" },
  ];

  return (
    <div className="min-h-screen font-sans-clean selection:bg-[#B3924F]/25 relative pb-20" style={{ background: MARFIL, color: TINTA }}>

      {/* Sobre lacrado: portada de la invitación */}
      {!sobreAbierto && (
        <SobreApertura
          sello={
            <span className="flex items-center leading-none whitespace-nowrap">
              <span className="font-serif-display text-xl tracking-wide">C</span>
              <span className="font-script text-xl mx-0.5 translate-y-[2px]">&</span>
              <span className="font-serif-display text-xl tracking-wide">L</span>
            </span>
          }
          titulo={
            <>
              Camila <span className="font-script" style={{ color: ORO }}>&</span> Lucas
            </>
          }
          antetitulo={language === "es" ? "NUESTRA BODA DE GALA" : "OUR GALA WEDDING"}
          fecha="14 · NOV · 2026"
          indicacion={language === "es" ? "Toca el sello para abrir tu invitación" : "Tap the seal to open your invitation"}
          onAbierto={() => setSobreAbierto(true)}
        />
      )}

      {/* Top Floating Watermark Bar */}
      <div className="py-2.5 px-4 sticky top-0 z-50 shadow-md border-b flex items-center justify-between gap-3 text-xs" style={{ background: VERDE, borderColor: `${ORO}4D`, color: "#F5EFE3" }}>
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-[#F5EFE3]/75 hover:text-[#CBB077] font-sans-clean font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        {/* Language selector pill in demo watermark bar */}
        <div className="flex items-center gap-1 bg-white/10 border rounded-full p-1 text-[10px] font-semibold font-sans-clean" style={{ borderColor: `${ORO}66` }}>
          <Globe className="w-3.5 h-3.5 ml-1 mr-0.5" style={{ color: ORO_CLARO }} />
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "es" ? "font-bold" : "text-[#F5EFE3]/70 hover:text-white"
            }`}
            style={language === "es" ? { background: ORO_CLARO, color: VERDE } : undefined}
          >
            ES
          </button>
          <span className="text-[#F5EFE3]/30 text-[9px]">|</span>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "en" ? "font-bold" : "text-[#F5EFE3]/70 hover:text-white"
            }`}
            style={language === "en" ? { background: ORO_CLARO, color: VERDE } : undefined}
          >
            EN
          </button>
        </div>

        <a
          href={createDemoWatermarkWhatsAppUrl("Boda Camila & Lucas")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 transition-colors rounded-full"
          style={{ background: ORO_CLARO, color: VERDE }}
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Barra de secciones: aparece al dejar la portada, oscura y sin ruido */}
      <nav
        aria-label={language === "es" ? "Secciones de la invitación" : "Invitation sections"}
        className={`fixed top-10 inset-x-0 z-40 backdrop-blur-md border-b py-2.5 overflow-x-auto no-scrollbar transition-all duration-300 ${
          showSectionNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
        style={{ background: `${VERDE}F2`, borderColor: `${ORO}40` }}
      >
        <div className="w-max mx-auto px-4 flex items-center gap-1.5 sm:gap-3 text-[11px] font-sans-clean uppercase tracking-wider font-semibold whitespace-nowrap text-[#F5EFE3]/70">
          {[
            { id: "historia", label: t("boda.story") },
            { id: "lugares", label: t("boda.venues") },
            { id: "itinerario", label: t("boda.schedule") },
            { id: "padrinos", label: t("boda.court") },
            { id: "hospedaje", label: t("boda.location") },
            { id: "regalos", label: t("boda.gifts") },
            { id: "galeria", label: t("boda.gallery") },
            { id: "muro", label: t("boda.guestbook") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-[#CBB077] transition-colors px-2 py-1.5"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("rsvp")}
            className="px-3.5 py-1.5 rounded-full text-[10px] font-bold ml-1"
            style={{ background: ORO_CLARO, color: VERDE }}
          >
            {t("boda.rsvp")}
          </button>
        </div>
      </nav>

      {/* Music Audio Toggle Floating Widget */}
      <div className="fixed bottom-6 right-5 z-40">
        <button
          onClick={toggleAudio}
          className={`px-4 py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-all duration-300 border backdrop-blur-sm ${
            isPlayingMusic ? "font-bold" : ""
          }`}
          style={
            isPlayingMusic
              ? { background: ORO_CLARO, color: VERDE, borderColor: ORO_CLARO }
              : { background: `${VERDE}F0`, color: ORO_CLARO, borderColor: `${ORO}66` }
          }
          title={isPlayingMusic ? "Pausar música de fondo" : "Activar música de fondo"}
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-widest font-semibold leading-none">
              {isPlayingMusic ? "Sinfonía Romántica" : "Música de Fondo"}
            </span>
            <span className="text-[8px] opacity-80 leading-tight">
              {isPlayingMusic ? "Canon in D (Violin & Cello)" : "Haz clic para escuchar"}
            </span>
          </div>
        </button>
      </div>

      {/* HERO COVER */}
      <header className="relative min-h-[92vh] flex items-center justify-center text-center px-6 pt-12 pb-36 overflow-hidden" style={{ background: VERDE }}>
        <div className="absolute inset-0">
          <img
            src={coupleImg}
            alt="Camila & Lucas"
            className="w-full h-full object-cover object-center filter scale-105"
            style={{ opacity: 0.55 }}
            referrerPolicy="no-referrer"
          />
          {/* Velo oscuro degradado: garantiza contraste sin apagar la fotografía */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${VERDE}B3, ${VERDE}59 38%, ${VERDE}8C 62%, ${MARFIL})` }}></div>
        </div>

        {/* Ornamentación botánica de esquina, muy sutil sobre la foto */}
        <EsquinaBotanica className="absolute top-16 left-4 w-24 h-24 sm:w-32 sm:h-32 text-[#F5EFE3]" style={{ opacity: 0.35 }} />
        <EsquinaBotanica className="absolute top-16 right-4 w-24 h-24 sm:w-32 sm:h-32 text-[#F5EFE3] -scale-x-100" style={{ opacity: 0.35 }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Monograma: sello de doble anillo */}
          <div className="relative w-24 h-24 mx-auto mb-9">
            <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${ORO_CLARO}99` }}></div>
            <div className="absolute inset-1.5 rounded-full border flex items-center justify-center backdrop-blur-[2px]" style={{ borderColor: `${ORO_CLARO}55`, background: `${VERDE}66` }}>
              <span className="flex items-center leading-none whitespace-nowrap" aria-label="Camila y Lucas" style={{ color: ORO_CLARO }}>
                <span className="font-serif-display text-2xl tracking-wide">C</span>
                <span className="font-script text-2xl mx-1 translate-y-[2px]" aria-hidden="true">&</span>
                <span className="font-serif-display text-2xl tracking-wide">L</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-7" aria-hidden="true">
            <span className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, transparent, ${ORO_CLARO}B3)` }}></span>
            <span className="text-[10px] sm:text-xs font-sans-clean uppercase tracking-[0.4em] font-semibold whitespace-nowrap" style={{ color: ORO_CLARO }}>
              NUESTRA BODA DE GALA
            </span>
            <span className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, transparent, ${ORO_CLARO}B3)` }}></span>
          </div>

          <h1 className="font-cormorant text-6xl sm:text-8xl font-medium tracking-wide text-white leading-none mb-8">
            Camila <span className="font-script text-6xl sm:text-8xl font-normal align-middle" style={{ color: ORO_CLARO }}>&</span> Lucas
          </h1>

          <p className="font-cormorant italic text-xl sm:text-2xl text-[#F3EFE6] font-light max-w-lg mx-auto leading-relaxed mb-10">
            "Hay momentos en la vida que son inolvidables, pero compartirlos con quienes más amamos los hace eternos."
          </p>

          <div className="font-sans-clean text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F5EFE3] font-semibold flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-8">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" style={{ color: ORO_CLARO }} /> Sábado, 14.NOV.2026</span>
            <span className="hidden sm:block w-1 h-1 rotate-45" style={{ background: ORO_CLARO }} aria-hidden="true"></span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: ORO_CLARO }} /> Altos de Chavón, La Romana</span>
          </div>
        </div>
      </header>

      {/* COUNTDOWN TIMER & CALENDAR */}
      <section className="max-w-2xl mx-auto -mt-16 relative z-20 px-5">
        <div className="rounded-2xl px-6 py-9 sm:px-10 sm:py-10 shadow-[0_18px_50px_-20px_rgba(16,23,19,0.25)] text-center border" style={{ background: "#FCFAF5", borderColor: LINEA }}>
          <Brote className="w-5 h-8 mx-auto mb-3 text-[#B3924F]" />
          <span className="text-[10px] uppercase font-sans-clean tracking-[0.35em] font-semibold block mb-7" style={{ color: ORO }}>
            CUÁNTO FALTA PARA EL GRAN DÍA
          </span>

          <div className="flex items-stretch justify-center mb-9">
            {cuenta.map((u, idx) => (
              <div key={u.l} className={`flex-1 max-w-[96px] ${idx > 0 ? "border-l" : ""}`} style={{ borderColor: `${LINEA}` }}>
                <span className="block font-cormorant text-4xl sm:text-5xl font-medium" style={{ color: VERDE }}>{u.v}</span>
                <span className="text-[9px] sm:text-[10px] font-sans-clean uppercase tracking-[0.25em] mt-1 block" style={{ color: TINTA_SUAVE }}>{u.l}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN_VERDE} w-full sm:w-auto`}
            >
              <Calendar className="w-4 h-4" style={{ color: ORO_CLARO }} /> Agregar a mi Google Calendar
            </a>

            <button
              onClick={() => setShowVipPassModal(true)}
              className={`${BTN_LINEA} w-full sm:w-auto`}
            >
              <QrCode className="w-4 h-4" style={{ color: ORO }} /> Ver Pase VIP Digital QR
            </button>
          </div>
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section id="historia" className="py-24 sm:py-32 px-5 max-w-3xl mx-auto text-center scroll-mt-24">
        <Encabezado eyebrow="NUESTRO CAMINO" titulo="Nuestra Historia de Amor" variante="rama" />

        <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-16 font-light" style={{ color: TINTA_SUAVE }}>
          Nos conocimos en Santo Domingo hace 5 años. Entre viajes a las playas de las Terrenas y tazas de café por las mañanas, supimos que queríamos caminar juntos para siempre. En Diciembre de 2025, bajo las estrellas de Altos de Chavón, dijimos ¡SÍ! al compromiso.
        </p>

        {/* Línea del tiempo narrativa: hilo fino, rombos dorados, sin tarjetas */}
        <div className="relative">
          <span className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${ORO}66, ${ORO}66, transparent)` }} aria-hidden="true"></span>

          <div className="space-y-16">
            {[
              { year: "2021", title: "Nos Conocimos", text: "Un primer café en la Zona Colonial que se convirtió en horas de conversación inolvidables." },
              { year: "2025", title: "El Compromiso", text: "Una noche mágica en Altos de Chavón con la respuesta más esperada de nuestras vidas." },
              { year: "2026", title: "¡Nuestra Boda!", text: "Celebraremos el inicio de nuestro nuevo capítulo rodeados de todos ustedes." },
            ].map((hito) => (
              <div key={hito.year} className="relative z-10 px-4">
                <span className="block w-2.5 h-2.5 rotate-45 mx-auto mb-5 border" style={{ background: MARFIL, borderColor: ORO }} aria-hidden="true"></span>
                <span className="text-[11px] font-sans-clean font-bold tracking-[0.35em] block mb-2" style={{ color: ORO }}>{hito.year}</span>
                <h4 className="font-cormorant text-2xl sm:text-3xl font-medium mb-3" style={{ color: VERDE }}>{hito.title}</h4>
                <p className="text-xs sm:text-sm font-light leading-relaxed max-w-sm mx-auto" style={{ color: TINTA_SUAVE }}>
                  {hito.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN SEPARADA DE CEREMONIA & RECEPCIÓN */}
      <section id="lugares" className="py-24 sm:py-32 px-5 scroll-mt-24 border-y" style={{ background: CREMA, borderColor: `${LINEA}99` }}>
        <div className="max-w-4xl mx-auto text-center">
          <Encabezado eyebrow="PUNTOS DE ENCUENTRO" titulo="Ceremonia Religiosa & Gran Recepción" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0 md:divide-x" style={{ borderColor: LINEA }}>
            {/* Ceremonia */}
            <div className="md:px-10 flex flex-col items-center">
              <span className="w-14 h-14 rounded-full border flex items-center justify-center mb-6" style={{ borderColor: `${ORO}66` }}>
                <Church className="w-6 h-6" style={{ color: ORO }} />
              </span>
              <span className="text-[10px] font-sans-clean uppercase font-bold tracking-[0.3em] block mb-2" style={{ color: ORO }}>
                1. SAGRADO MATRIMONIO
              </span>
              <h3 className="font-cormorant text-3xl font-medium mb-2" style={{ color: VERDE }}>Ceremonia Religiosa</h3>
              <p className="text-[11px] font-sans-clean font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider" style={{ color: TINTA_SUAVE }}>
                <Clock className="w-4 h-4" style={{ color: ORO }} /> 04:30 PM (Puntualidad solicitada)
              </p>

              <p className="text-xs sm:text-sm font-light leading-relaxed mb-6 max-w-xs" style={{ color: TINTA_SUAVE }}>
                Nos uniremos ante el altar en la emblemática <strong className="font-semibold" style={{ color: TINTA }}>Iglesia San Estanislao de Kotska</strong>, construida en piedra en el corazón de Altos de Chavón.
              </p>

              <div className="text-left border-l pl-4 space-y-2 mb-8" style={{ borderColor: `${ORO}59` }}>
                <p className="text-[11px] font-sans-clean flex items-start gap-2" style={{ color: TINTA }}>
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: ORO }} />
                  <span><strong>Lugar:</strong> Iglesia San Estanislao, Altos de Chavón, La Romana.</span>
                </p>
                <p className="text-[11px] font-sans-clean flex items-start gap-2" style={{ color: TINTA_SUAVE }}>
                  <Music2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: ORO }} />
                  <span>Música sacra interpretada por cuarteto de cuerdas en vivo.</span>
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Iglesia+San+Estanislao+Altos+de+Chavon"
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_VERDE} w-full sm:w-auto`}
              >
                <Navigation className="w-3.5 h-3.5" style={{ color: ORO_CLARO }} /> Abrir Ubicación de la Iglesia
              </a>
            </div>

            {/* Recepción */}
            <div className="md:px-10 flex flex-col items-center">
              <span className="w-14 h-14 rounded-full border flex items-center justify-center mb-6" style={{ borderColor: `${ORO}66` }}>
                <Wine className="w-6 h-6" style={{ color: ORO }} />
              </span>
              <span className="text-[10px] font-sans-clean uppercase font-bold tracking-[0.3em] block mb-2" style={{ color: ORO }}>
                2. CELEBRACIÓN & FIESTA
              </span>
              <h3 className="font-cormorant text-3xl font-medium mb-2" style={{ color: VERDE }}>Gran Recepción & Gala</h3>
              <p className="text-[11px] font-sans-clean font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider" style={{ color: TINTA_SUAVE }}>
                <Clock className="w-4 h-4" style={{ color: ORO }} /> 06:00 PM (Inmediatamente después)
              </p>

              <p className="text-xs sm:text-sm font-light leading-relaxed mb-6 max-w-xs" style={{ color: TINTA_SUAVE }}>
                Celebraremos nuestro banquete en el <strong className="font-semibold" style={{ color: TINTA }}>Salón Principal & Terrazas del Anfiteatro</strong>, disfrutando de brisas tropicales y vista espectacular al Río Chavón.
              </p>

              <div className="text-left border-l pl-4 space-y-2 mb-8" style={{ borderColor: `${ORO}59` }}>
                <p className="text-[11px] font-sans-clean flex items-start gap-2" style={{ color: TINTA }}>
                  <Wine className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: ORO }} />
                  <span><strong>Cóctel de Bienvenida:</strong> Terrazas del Anfiteatro.</span>
                </p>
                <p className="text-[11px] font-sans-clean flex items-start gap-2" style={{ color: TINTA_SUAVE }}>
                  <Utensils className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: ORO }} />
                  <span>Banquete gourmet 3 tiempos, orquesta en vivo y Hora Loca.</span>
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Altos+de+Chavon+La+Romana"
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_LINEA} w-full sm:w-auto`}
              >
                <Utensils className="w-3.5 h-3.5" style={{ color: ORO }} /> Abrir Ubicación del Salón de Fiestas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ITINERARIO DEL DÍA */}
      <section id="itinerario" className="py-24 sm:py-32 px-5 max-w-2xl mx-auto text-center scroll-mt-24">
        <Encabezado eyebrow="CRONOGRAMA OFICIAL" titulo="Itinerario de la Celebración" variante="estrella" />

        {/* Línea temporal real: hilo central, rombos y aire entre momentos */}
        <div className="relative mt-4">
          <span className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px" style={{ background: `${ORO}4D` }} aria-hidden="true"></span>

          <div className="space-y-14">
            {[
              { time: "04:30 PM", title: "Ceremonia Religiosa", detail: "Iglesia San Estanislao, Altos de Chavón" },
              { time: "05:45 PM", title: "Cóctel de Bienvenida & Fotografía", detail: "Terraza del Anfiteatro con vista al Río Chavón" },
              { time: "07:30 PM", title: "Entrada Triunfal & Primer Baile", detail: "Primer baile de esposos y brindis de honor" },
              { time: "08:15 PM", title: "Cena de Gala 3 Tiempos", detail: "Salón Principal Altos de Chavón" },
              { time: "09:30 PM", title: "Apertura de Pista & Orquesta", detail: "Música en vivo con orquesta bailable" },
              { time: "11:30 PM", title: "Hora Loca Venetian & DJ Set", detail: "Sorpresas, cotillón y fiesta hasta la madrugada" }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 px-6">
                <span className="block w-2 h-2 rotate-45 mx-auto mb-4 border" style={{ background: MARFIL, borderColor: ORO }} aria-hidden="true"></span>
                <span className="block text-[11px] font-sans-clean font-bold tracking-[0.3em]" style={{ color: ORO }}>
                  {item.time}
                </span>
                <h3 className="font-cormorant text-2xl sm:text-[1.7rem] font-medium mt-1.5" style={{ color: VERDE }}>{item.title}</h3>
                <p className="text-xs font-light mt-1.5" style={{ color: TINTA_SUAVE }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORTE DE HONOR & PADRINOS */}
      <section id="padrinos" className="py-24 sm:py-32 px-5 scroll-mt-24 border-y" style={{ background: CREMA_2, borderColor: `${LINEA}99` }}>
        <div className="max-w-3xl mx-auto text-center">
          <Encabezado eyebrow="ACOMPAÑANTES ESPECIALES" titulo="Corte de Honor & Padrinos" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-0 md:divide-x" style={{ borderColor: LINEA }}>
            {/* Padrinos */}
            <div className="md:px-10">
              <h3 className="font-cormorant text-2xl font-medium mb-6 flex items-center justify-center gap-2" style={{ color: VERDE }}>
                <Sparkles className="w-4 h-4" style={{ color: ORO }} /> Padrinos de Boda
              </h3>
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-sans-clean font-bold uppercase tracking-[0.3em] block mb-1" style={{ color: ORO }}>Padrino de Honor</span>
                  <p className="font-cormorant text-xl" style={{ color: TINTA }}>D. Manuel Rodríguez</p>
                </div>
                <div>
                  <span className="text-[10px] font-sans-clean font-bold uppercase tracking-[0.3em] block mb-1" style={{ color: ORO }}>Madrina de Honor</span>
                  <p className="font-cormorant text-xl" style={{ color: TINTA }}>Dña. Carmen Almanzar</p>
                </div>
              </div>
            </div>

            {/* Damas de Honor & Best Men */}
            <div className="md:px-10 pt-2 md:pt-0">
              <h3 className="font-cormorant text-2xl font-medium mb-6 flex items-center justify-center gap-2" style={{ color: VERDE }}>
                <Heart className="w-4 h-4" style={{ color: ORO }} /> Damas de Honor & Caballeros
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-[10px] font-sans-clean font-bold uppercase tracking-[0.3em] block mb-3" style={{ color: ORO }}>Damas de Honor</span>
                  <ul className="font-cormorant text-lg space-y-2" style={{ color: TINTA }}>
                    <li>Valeria Rodríguez</li>
                    <li>Sofía Almanzar</li>
                    <li>Mariana Gómez</li>
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-sans-clean font-bold uppercase tracking-[0.3em] block mb-3" style={{ color: ORO }}>Best Men</span>
                  <ul className="font-cormorant text-lg space-y-2" style={{ color: TINTA }}>
                    <li>Gabriel Martínez</li>
                    <li>Fernando De la Rosa</li>
                    <li>Carlos Henríquez</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRESS CODE & UBICACIÓN */}
      <section id="hospedaje" className="py-24 sm:py-32 px-5 max-w-4xl mx-auto scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">

          {/* Ubicación Mapa */}
          <div className="text-center md:text-left">
            <span className="w-12 h-12 rounded-full border inline-flex items-center justify-center mb-5" style={{ borderColor: `${ORO}66` }}>
              <MapPin className="w-5 h-5" style={{ color: ORO }} />
            </span>
            <h3 className="font-cormorant text-3xl font-medium mb-1" style={{ color: VERDE }}>Lugar de Celebración</h3>
            <p className="text-sm font-sans-clean font-medium" style={{ color: TINTA }}>Altos de Chavón</p>
            <p className="text-xs font-sans-clean mb-6" style={{ color: TINTA_SUAVE }}>La Romana</p>

            <div className="rounded-xl overflow-hidden border h-52 mb-6" style={{ borderColor: LINEA }}>
              <iframe
                title="Mapa de Altos de Chavón"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.8966838842426!2d-68.89136122398418!3d18.41164928266205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea24d14a6015555%3A0x6a0c59828ef05001!2sAltos%20de%20Chav%C3%B3n!5e0!3m2!1ses!2sdo!4v1700000000000!5m2!1ses!2sdo"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://maps.google.com/?q=Altos+de+Chavon+La+Romana"
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_VERDE} !px-3`}
              >
                Google Maps <ExternalLink className="w-3.5 h-3.5" style={{ color: ORO_CLARO }} />
              </a>
              <a
                href="https://waze.com/ul?q=Altos+de+Chavon"
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_LINEA} !px-3`}
              >
                Abrir Waze <Navigation className="w-3.5 h-3.5" style={{ color: ORO }} />
              </a>
            </div>
          </div>

          {/* Dress Code: página de revista, sin tarjeta */}
          <div className="text-center md:text-left">
            <Brote className="w-5 h-9 mx-auto md:mx-0 mb-4 text-[#B3924F]" />
            <h3 className="font-cormorant text-3xl font-medium mb-2" style={{ color: VERDE }}>Código de Vestimenta</h3>
            <p className="text-[11px] font-sans-clean font-bold uppercase tracking-[0.3em] mb-5" style={{ color: ORO }}>
              Rigurosa Etiqueta / Black Tie
            </p>
            <p className="text-xs sm:text-sm font-light leading-relaxed mb-8" style={{ color: TINTA_SUAVE }}>
              Queremos que todos lucen espectaculares. Damas con vestido largo formal y caballeros en smoking o traje oscuro elegante.
            </p>

            <span className="text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] block mb-4" style={{ color: TINTA_SUAVE }}>
              Paleta de colores inspiradora
            </span>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
              {[
                { c: "#1A2521", n: "Negro / Esmoquin" },
                { c: "#C5A059", n: "Dorado / Champagne" },
                { c: "#4A0E17", n: "Vino Tinto" },
                { c: "#1B2A4A", n: "Azul Noche" },
              ].map((s) => (
                <span key={s.c} className="w-11 h-11 rounded-full border p-[3px] inline-flex" style={{ borderColor: `${ORO}59` }} title={s.n}>
                  <span className="w-full h-full rounded-full block" style={{ background: s.c }}></span>
                </span>
              ))}
            </div>
            <p className="text-[11px] italic font-light mb-10" style={{ color: TINTA_SUAVE }}>
              El color blanco y tonos crema están reservados exclusivamente para la novia.
            </p>

            <SeparadorBotanico variante="diamante" className="text-[#B3924F] md:justify-start" />
            <p className="text-xs font-cormorant italic mt-4" style={{ color: TINTA_SUAVE }}>
              Agradecemos su comprensión y elegancia para este día tan especial.
            </p>
          </div>

        </div>
      </section>

      {/* QR MODAL PREVIEW */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="border p-8 rounded-2xl max-w-sm w-full text-center relative shadow-2xl space-y-4" style={{ background: MARFIL, borderColor: ORO }}>
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase font-sans-clean" style={{ background: VERDE, color: ORO_CLARO }}>
              <ShieldCheck className="w-3.5 h-3.5" /> Pase VIP Acreditado
            </div>

            <h3 className="font-cormorant text-3xl font-medium" style={{ color: VERDE }}>Boda Camila & Lucas</h3>
            <p className="text-xs font-sans-clean" style={{ color: TINTA_SUAVE }}>Acreditación Personal para Ceremonia & Gala</p>

            <div className="bg-white p-4 rounded-xl border-2 w-48 h-48 mx-auto flex flex-col items-center justify-center gap-2" style={{ borderColor: ORO }}>
              <QrCode className="w-32 h-32" style={{ color: VERDE }} />
              <span className="text-[10px] font-mono font-bold" style={{ color: VERDE }}>WEDDING-C&L-2026</span>
            </div>

            <p className="text-[11px] font-sans-clean" style={{ color: TINTA_SUAVE }}>
              Muestre este pase digital en el control de acceso de Altos de Chavón para ingreso fluido.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className={`${BTN_VERDE} w-full`}
            >
              Cerrar Pase Digital
            </button>
          </div>
        </div>
      )}

      {/* MESA DE REGALOS */}
      <section id="regalos" className="py-24 sm:py-32 px-5 scroll-mt-24 border-y" style={{ background: CREMA, borderColor: `${LINEA}99` }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="w-12 h-12 rounded-full border inline-flex items-center justify-center mb-5" style={{ borderColor: `${ORO}66` }}>
            <Gift className="w-5 h-5" style={{ color: ORO }} />
          </span>
          <h2 className="font-cormorant text-4xl sm:text-5xl font-medium mb-4" style={{ color: VERDE }}>Mesa de Regalos & Luna de Miel</h2>
          <p className="text-xs sm:text-sm font-light max-w-lg mx-auto mb-12 leading-relaxed" style={{ color: TINTA_SUAVE }}>
            Su presencia es nuestro mejor regalo. Sin embargo, si desean hacernos un obsequio, agradeceremos enormemente una contribución para nuestro fondo de luna de miel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center max-w-2xl mx-auto">
            {/* Banco Popular */}
            <div className="rounded-xl border px-7 py-8" style={{ background: "#FCFAF5", borderColor: LINEA }}>
              <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] block mb-2" style={{ color: ORO }}>BANCO POPULAR (RD$)</span>
              <p className="font-cormorant text-xl" style={{ color: VERDE }}>Cuenta de Ahorros</p>
              <p className="text-sm font-mono my-2" style={{ color: TINTA }}>No. 823-492019-3</p>
              <p className="text-[11px] mb-6" style={{ color: TINTA_SUAVE }}>Titular: Camila Rodríguez</p>

              <button
                onClick={() => copyToClipboard("8234920193", "popular")}
                className={`${BTN_VERDE} w-full !py-3`}
              >
                {copiedAccount === "popular" ? <Check className="w-4 h-4" style={{ color: ORO_CLARO }} /> : <Copy className="w-4 h-4" style={{ color: ORO_CLARO }} />}
                {copiedAccount === "popular" ? "¡Número Copiado!" : "Copiar Cuenta Bancaria"}
              </button>
            </div>

            {/* Zelle */}
            <div className="rounded-xl border px-7 py-8" style={{ background: "#FCFAF5", borderColor: LINEA }}>
              <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] block mb-2" style={{ color: ORO }}>ZELLE / DÓLARES (US$)</span>
              <p className="font-cormorant text-xl" style={{ color: VERDE }}>Transferencia Zelle</p>
              <p className="text-sm font-mono my-2 break-all" style={{ color: TINTA }}>camilaylucas2026@gmail.com</p>
              <p className="text-[11px] mb-6" style={{ color: TINTA_SUAVE }}>Titular: Lucas Almanzar</p>

              <button
                onClick={() => copyToClipboard("camilaylucas2026@gmail.com", "zelle")}
                className={`${BTN_LINEA} w-full !py-3`}
              >
                {copiedAccount === "zelle" ? <Check className="w-4 h-4" style={{ color: ORO }} /> : <Copy className="w-4 h-4" style={{ color: ORO }} />}
                {copiedAccount === "zelle" ? "¡Correo Copiado!" : "Copiar Correo Zelle"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA DE FOTOS */}
      <section id="galeria" className="py-24 sm:py-32 px-5 max-w-5xl mx-auto text-center scroll-mt-24">
        <div className="flex items-center justify-center gap-4 mb-4" aria-hidden="true">
          <Rama className="w-16 h-4 text-[#B3924F] -scale-x-100 opacity-70" />
          <Camera className="w-6 h-6" style={{ color: ORO }} />
          <Rama className="w-16 h-4 text-[#B3924F] opacity-70" />
        </div>
        <span className="text-[10px] uppercase font-sans-clean tracking-[0.4em] font-semibold block mb-4" style={{ color: ORO }}>
          ÁLBUM DE RECUERDOS
        </span>
        <h2 className="font-cormorant text-4xl sm:text-5xl font-medium mb-12" style={{ color: VERDE }}>Nuestros Momentos</h2>

        {/* Mosaico editorial: alturas variadas, como un álbum, no un catálogo */}
        <div className="columns-2 md:columns-3 gap-4 sm:gap-5 [column-fill:_balance]">
          {galleryImages.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActivePhoto(img)}
              aria-label={`Ampliar fotografía ${idx + 1}`}
              className={`relative w-full ${alturasGaleria[idx % alturasGaleria.length]} rounded-xl overflow-hidden cursor-pointer group border mb-4 sm:mb-5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3924F]`}
              style={{ borderColor: LINEA }}
            >
              <img
                src={img}
                alt={`Galería ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute inset-0 bg-[#101713]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-[10px] font-sans-clean uppercase tracking-[0.25em] text-white border border-white/60 rounded-full px-5 py-2">
                  Ampliar
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-[#CBB077] p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={activePhoto}
            alt="Foto ampliada"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* MURO INTERACTIVO DE BUENOS DESEOS (GUESTBOOK) */}
      <section id="muro" className="py-24 sm:py-32 px-5 scroll-mt-24 border-t" style={{ background: CREMA_2, borderColor: `${LINEA}99` }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="w-12 h-12 rounded-full border inline-flex items-center justify-center mb-5" style={{ borderColor: `${ORO}66` }}>
              <MessageSquare className="w-5 h-5" style={{ color: ORO }} />
            </span>
            <span className="text-[10px] uppercase font-sans-clean tracking-[0.4em] font-semibold block mb-3" style={{ color: ORO }}>
              LIBRO DE FIRMAS DIGITAL
            </span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-medium mb-4" style={{ color: VERDE }}>Muro de Felicitaciones</h2>
            <p className="text-xs sm:text-sm font-light max-w-md mx-auto" style={{ color: TINTA_SUAVE }}>
              Deja un mensaje con tus mejores deseos para Camila & Lucas en este día tan especial.
            </p>
          </div>

          {/* New Message Form */}
          <form onSubmit={handleGuestbookSubmit} className="rounded-2xl border p-7 sm:p-9 mb-14 space-y-6" style={{ background: "#FCFAF5", borderColor: LINEA }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.2em] mb-2" style={{ color: TINTA_SUAVE }}>
                  Tu Nombre o Familia *
                </label>
                <input
                  type="text"
                  required
                  value={newMessage.name}
                  onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                  placeholder="Ej. Familia Martínez"
                  className="w-full bg-transparent border-0 border-b rounded-none px-0.5 py-2.5 text-sm focus:outline-none focus:border-[#B3924F] transition-colors"
                  style={{ borderColor: LINEA, color: TINTA }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.2em] mb-2" style={{ color: TINTA_SUAVE }}>
                  Relación con los novios
                </label>
                <input
                  type="text"
                  value={newMessage.relationship}
                  onChange={(e) => setNewMessage({ ...newMessage, relationship: e.target.value })}
                  placeholder="Ej. Amigos de la infancia"
                  className="w-full bg-transparent border-0 border-b rounded-none px-0.5 py-2.5 text-sm focus:outline-none focus:border-[#B3924F] transition-colors"
                  style={{ borderColor: LINEA, color: TINTA }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.2em] mb-2" style={{ color: TINTA_SUAVE }}>
                Tu Mensaje de Felicitación *
              </label>
              <textarea
                required
                rows={3}
                value={newMessage.message}
                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                placeholder="Escribe tus palabras y deseos para los novios aquí..."
                className="w-full bg-transparent border-0 border-b rounded-none px-0.5 py-2.5 text-sm focus:outline-none focus:border-[#B3924F] transition-colors resize-none"
                style={{ borderColor: LINEA, color: TINTA }}
              ></textarea>
            </div>

            {messageSent && (
              <div className="text-xs p-3.5 rounded-lg flex items-center gap-2 border" style={{ background: "#F0F4EC", color: "#3D5537", borderColor: "#C9D6BE" }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#5A7A50" }} />
                <span>¡Tu mensaje ha sido publicado en el muro de felicitaciones!</span>
              </div>
            )}

            <button type="submit" className={`${BTN_VERDE} w-full`}>
              <Send className="w-3.5 h-3.5" style={{ color: ORO_CLARO }} /> Publicar Mensaje de Felicitación
            </button>
          </form>

          {/* Dedicatorias: mensajes escritos para los novios, no tarjetas de app */}
          <div>
            {guestMessages.map((msg, idx) => (
              <article key={msg.id} className="text-center px-2">
                {idx > 0 && <SeparadorBotanico variante="estrella" className="text-[#B3924F] py-8" />}
                <p className="font-cormorant italic text-lg sm:text-xl leading-relaxed mb-4" style={{ color: TINTA }}>
                  "{msg.message}"
                </p>
                <p className="text-xs font-sans-clean font-semibold uppercase tracking-[0.2em]" style={{ color: VERDE }}>{msg.name}</p>
                <p className="text-[10px] font-sans-clean uppercase tracking-[0.2em] mt-1" style={{ color: ORO }}>
                  {msg.relationship} <span style={{ color: TINTA_SUAVE }} className="normal-case tracking-normal">· {msg.date}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP FORM */}
      <section id="rsvp" className="py-24 sm:py-32 px-5 scroll-mt-24 relative overflow-hidden" style={{ background: VERDE, color: "#F5EFE3" }}>
        <EsquinaBotanica className="absolute top-6 left-2 w-24 h-24 text-[#CBB077]" style={{ opacity: 0.18 }} />
        <EsquinaBotanica className="absolute bottom-6 right-2 w-24 h-24 text-[#CBB077] rotate-180" style={{ opacity: 0.18 }} />

        <div className="max-w-xl mx-auto text-center relative z-10">
          <span className="text-[10px] uppercase font-sans-clean tracking-[0.4em] font-semibold block mb-4" style={{ color: ORO_CLARO }}>
            POR FAVOR CONFIRMA TU ASISTENCIA
          </span>
          <h2 className="font-cormorant text-5xl sm:text-6xl font-medium text-white mb-4">
            ¿Nos Acompañas?
          </h2>
          <SeparadorBotanico variante="rama" className="text-[#CBB077]" />
          <p className="text-xs font-light mt-5 mb-12" style={{ color: "#F5EFE3B3" }}>
            Agradecemos confirmar antes del 1ro de Octubre de 2026.
          </p>

          {rsvpSubmitted ? (
            <div className="border p-9 rounded-2xl text-center" style={{ background: VERDE_2, borderColor: `${ORO_CLARO}80` }}>
              <CheckCircle2 className="w-11 h-11 mx-auto mb-4" style={{ color: ORO_CLARO }} />
              <h3 className="font-cormorant text-3xl font-medium mb-3 text-white">Se abrió WhatsApp</h3>
              {/* El mensaje queda redactado, pero lo envía el invitado. */}
              <p className="text-xs font-light mb-2" style={{ color: "#F5EFE3CC" }}>
                Tu confirmación quedó redactada en WhatsApp. Envía el mensaje para completarla.
              </p>
              <p className="text-[10px] font-light mb-7" style={{ color: "#F5EFE380" }}>
                Es una muestra: los datos no se guardan en ningún sistema.
              </p>
              <button
                onClick={() => setRsvpSubmitted(false)}
                className="inline-flex items-center justify-center font-sans-clean font-bold text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 rounded-lg min-h-[48px] transition-colors"
                style={{ background: ORO_CLARO, color: VERDE }}
              >
                Editar Respuesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="text-left space-y-7">
              <div>
                <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] mb-2" style={{ color: ORO_CLARO }}>
                  Nombre Completo del Invitado Principal *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpData.fullName}
                  onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-white/[0.05] border rounded-lg p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#CBB077] transition-colors min-h-[48px]"
                  style={{ borderColor: "#FFFFFF26" }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] mb-2" style={{ color: ORO_CLARO }}>
                    ¿Asistirás?
                  </label>
                  <select
                    value={rsvpData.attendance}
                    onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })}
                    className="w-full bg-white/[0.05] border rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-[#CBB077] transition-colors min-h-[48px]"
                    style={{ borderColor: "#FFFFFF26", background: VERDE_2 }}
                  >
                    <option value="Confirmado">✅ Sí, asistiré</option>
                    <option value="Declina">❌ No podré asistir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] mb-2" style={{ color: ORO_CLARO }}>
                    Número de Pases Asignados
                  </label>
                  <select
                    value={rsvpData.guestCount}
                    onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                    className="w-full bg-white/[0.05] border rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-[#CBB077] transition-colors min-h-[48px]"
                    style={{ borderColor: "#FFFFFF26", background: VERDE_2 }}
                  >
                    <option value={1}>Solo yo (1 pase)</option>
                    <option value={2}>2 Pases (Acompañante)</option>
                    <option value={3}>3 Pases</option>
                    <option value={4}>4 Pases (Familia)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] mb-2" style={{ color: ORO_CLARO }}>
                  Preferencia de Menú de Gala
                </label>
                <select
                  value={rsvpData.menuPreference}
                  onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })}
                  className="w-full bg-white/[0.05] border rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-[#CBB077] transition-colors min-h-[48px]"
                  style={{ borderColor: "#FFFFFF26", background: VERDE_2 }}
                >
                  <option value="Corte de Res Angus a las Tres Pimientas">🥩 Corte de Res Angus a las Tres Pimientas</option>
                  <option value="Filete de Dorado en Salsa de Maracuyá">🐟 Filete de Dorado en Salsa de Maracuyá</option>
                  <option value="Risotto de Hongos Silvestres (Vegetariano)">🍄 Risotto de Hongos Silvestres (Vegetariano)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] mb-2" style={{ color: ORO_CLARO }}>
                  Alergias o Restricciones Alimentarias
                </label>
                <input
                  type="text"
                  value={rsvpData.dietaryNotes}
                  onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })}
                  placeholder="Ej. Alergia a mariscos / Intolerante al gluten"
                  className="w-full bg-white/[0.05] border rounded-lg p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#CBB077] transition-colors min-h-[48px]"
                  style={{ borderColor: "#FFFFFF26" }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans-clean uppercase font-bold tracking-[0.25em] mb-2" style={{ color: ORO_CLARO }}>
                  ¿Qué canción no puede faltar en la fiesta?
                </label>
                <input
                  type="text"
                  value={rsvpData.songRequest}
                  onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })}
                  placeholder="Ej. Juan Luis Guerra — Las Avispas"
                  className="w-full bg-white/[0.05] border rounded-lg p-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#CBB077] transition-colors min-h-[48px]"
                  style={{ borderColor: "#FFFFFF26" }}
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 font-sans-clean font-bold text-[11px] uppercase tracking-[0.22em] py-4 rounded-lg min-h-[52px] transition-colors duration-300 hover:brightness-105"
                style={{ background: ORO_CLARO, color: VERDE }}
              >
                <Send className="w-4 h-4" />
                Confirmar Asistencia por WhatsApp
              </button>
            </form>
          )}
        </div>
      </section>

      {/* DISCRETE BOTTOM WATERMARK */}
      <footer className="py-10 text-center border-t" style={{ background: "#0B0E0D", borderColor: "#2A3631" }}>
        <a
          href={createDemoWatermarkWhatsAppUrl("Boda Camila & Lucas")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-sans-clean hover:underline font-semibold"
          style={{ color: ORO_CLARO }}
        >
          ◆ Diseñado por Invifty — Solicitud de invitaciones digitales para eventos
        </a>
      </footer>

      {/* VIP PASS MODAL FOR WEDDING */}
      {showVipPassModal && (
        <VipPassModal
          eventName="Boda Camila & Lucas"
          defaultGuestName="Tía Sofía & Tío Roberto"
          tableNumber="Mesa Imperial #02"
          eventDate="14 de Noviembre, 2026 — 4:30 PM"
          eventLocation="Altos de Chavón, La Romana"
          onClose={() => setShowVipPassModal(false)}
        />
      )}

    </div>
  );
}
