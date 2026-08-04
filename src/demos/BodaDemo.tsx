import { useDemoFonts } from "../hooks/useDemoFonts";
import { parseAttendance } from "../utils/rsvp";
import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { MapPin, Calendar, Clock, Heart, Gift, CheckCircle2, Volume2, VolumeX, Copy, Check, Send, ExternalLink, ArrowLeft, Camera, X, MessageSquare, Sparkles, Navigation, Church, Wine, Utensils, Users, QrCode, ShieldCheck, Globe } from "lucide-react";
import coupleImg from "../assets/images/wedding_couple_demo.webp";
import { useLanguage } from "../context/LanguageContext";
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

export default function BodaDemo({ onBackToHome }: BodaDemoProps) {
  const { language, setLanguage, t } = useLanguage();
  useDemoFonts();

  // Target date: November 14, 2026 16:30:00 AST
  const targetDate = new Date("2026-11-14T16:30:00").getTime();


  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

  return (
    <div className="bg-[#FAF8F5] text-[#2C2825] min-h-screen font-serif-display selection:bg-[#D4AF37]/20 selection:text-[#0F1412] relative pb-20">
      
      {/* Top Floating Watermark Bar */}
      <div className="bg-[#0F1412] text-[#FFF1CB] py-2.5 px-4 sticky top-0 z-50 shadow-md border-b border-[#D4AF37]/30 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] font-sans-clean font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        {/* Language selector pill in demo watermark bar */}
        <div className="flex items-center gap-1 bg-white/10 border border-[#D4AF37]/40 rounded-full p-1 text-[10px] font-semibold font-sans-clean">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1 mr-0.5" />
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "es" ? "bg-[#D4AF37] text-black font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            ES
          </button>
          <span className="text-gray-600 text-[9px]">|</span>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "en" ? "bg-[#D4AF37] text-black font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>

        <a
          href={createDemoWatermarkWhatsAppUrl("Boda Camila & Lucas")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Internal Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E8D3C5] sticky top-10 z-40 py-2 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 sm:gap-4 text-[11px] font-sans-clean uppercase tracking-wider font-semibold whitespace-nowrap">
          <button onClick={() => scrollToSection("historia")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.story")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("lugares")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.venues")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("itinerario")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.schedule")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("padrinos")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.court")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("hospedaje")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.location")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("regalos")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.gifts")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("galeria")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.gallery")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("muro")} className="hover:text-[#D4AF37] transition-colors px-2 py-1">
            {t("boda.guestbook")}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("rsvp")} className="bg-[#0F1412] text-[#D4AF37] px-3.5 py-1 rounded-full text-[10px] font-bold">
            {t("boda.rsvp")}
          </button>
        </div>
      </div>


      {/* Music Audio Toggle Floating Widget */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={toggleAudio}
          className={`px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 border ${
            isPlayingMusic
              ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold"
              : "bg-[#0F1412] text-[#D4AF37] border-[#D4AF37]/50"
          }`}
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
      <header className="relative min-h-[85vh] flex items-center justify-center text-center p-6 bg-[#0F1412] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={coupleImg}
            alt="Camila & Lucas"
            className="w-full h-full object-cover object-center opacity-35 filter scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F1412]/80 via-[#0F1412]/60 to-[#FAF8F5]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 pt-12">
          {/* Custom Crest Monogram */}
          <div className="w-16 h-16 border-2 border-[#D4AF37] rounded-full mx-auto flex items-center justify-center bg-black/40 backdrop-blur-md text-[#D4AF37] font-serif text-xl tracking-widest shadow-xl">
            C & L
          </div>

          <span className="text-xs font-sans-clean uppercase tracking-[0.35em] text-[#D4AF37] block font-semibold">
            NUESTRA BODA DE GALA
          </span>

          <h1 className="text-5xl sm:text-7xl font-normal font-serif-display tracking-tight text-white leading-tight">
            Camila <span className="font-script text-6xl sm:text-8xl text-[#D4AF37] font-normal">&</span> Lucas
          </h1>

          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto opacity-70"></div>

          <p className="font-cormorant italic text-xl sm:text-2xl text-[#E8E6E1] font-light max-w-lg mx-auto">
            "Hay momentos en la vida que son inolvidables, pero compartirlos con quienes más amamos los hace eternos."
          </p>

          <div className="pt-4 font-sans-clean text-xs uppercase tracking-widest text-[#FFF1CB] font-semibold flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#D4AF37]" /> Sábado, 14.NOV.2026</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Altos de Chavón, La Romana</span>
          </div>
        </div>
      </header>

      {/* COUNTDOWN TIMER & CALENDAR */}
      <section className="max-w-3xl mx-auto -mt-16 relative z-20 px-4">
        <div className="bg-white border border-[#E8D3C5] rounded-3xl p-6 sm:p-8 shadow-xl text-center">
          <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-4">
            CUÁNTO FALTA PARA EL GRAN DÍA
          </span>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-md mx-auto mb-6">
            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8D3C5]/60">
              <span className="block text-2xl sm:text-4xl font-bold text-[#0F1412]">{timeLeft.days}</span>
              <span className="text-[10px] sm:text-xs font-sans-clean uppercase tracking-wider text-gray-500">Días</span>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8D3C5]/60">
              <span className="block text-2xl sm:text-4xl font-bold text-[#0F1412]">{timeLeft.hours}</span>
              <span className="text-[10px] sm:text-xs font-sans-clean uppercase tracking-wider text-gray-500">Horas</span>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8D3C5]/60">
              <span className="block text-2xl sm:text-4xl font-bold text-[#0F1412]">{timeLeft.minutes}</span>
              <span className="text-[10px] sm:text-xs font-sans-clean uppercase tracking-wider text-gray-500">Min</span>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8D3C5]/60">
              <span className="block text-2xl sm:text-4xl font-bold text-[#0F1412]">{timeLeft.seconds}</span>
              <span className="text-[10px] sm:text-xs font-sans-clean uppercase tracking-wider text-gray-500">Seg</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0F1412] text-[#D4AF37] font-sans-clean text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#2A3631] transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" /> Agregar a mi Google Calendar
            </a>

            <button
              onClick={() => setShowVipPassModal(true)}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0F1412] font-sans-clean text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#FFF1CB] transition-colors shadow-sm"
            >
              <QrCode className="w-4 h-4" /> Ver Pase VIP Digital QR
            </button>
          </div>
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section id="historia" className="py-20 px-4 max-w-4xl mx-auto text-center scroll-mt-20">
        <Heart className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
        <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-2">
          NUESTRO CAMINO
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1412] mb-6">
          Nuestra Historia de Amor
        </h2>
        <p className="text-base text-[#4A4540] leading-relaxed max-w-2xl mx-auto font-light font-sans-clean mb-12">
          Nos conocimos en Santo Domingo hace 5 años. Entre viajes a las playas de las Terrenas y tazas de café por las mañanas, supimos que queríamos caminar juntos para siempre. En Diciembre de 2025, bajo las estrellas de Altos de Chavón, dijimos ¡SÍ! al compromiso.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5]/60 shadow-sm relative overflow-hidden">
            <div className="w-2 h-full bg-[#D4AF37] absolute top-0 left-0"></div>
            <span className="text-xs font-sans-clean font-bold text-[#D4AF37] block mb-1">2021</span>
            <h4 className="font-bold text-lg mb-2">Nos Conocimos</h4>
            <p className="text-xs text-gray-600 font-sans-clean leading-relaxed">
              Un primer café en la Zona Colonial que se convirtió en horas de conversación inolvidables.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5]/60 shadow-sm relative overflow-hidden">
            <div className="w-2 h-full bg-[#D4AF37] absolute top-0 left-0"></div>
            <span className="text-xs font-sans-clean font-bold text-[#D4AF37] block mb-1">2025</span>
            <h4 className="font-bold text-lg mb-2">El Compromiso</h4>
            <p className="text-xs text-gray-600 font-sans-clean leading-relaxed">
              Una noche mágica en Altos de Chavón con la respuesta más esperada de nuestras vidas.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5]/60 shadow-sm relative overflow-hidden">
            <div className="w-2 h-full bg-[#D4AF37] absolute top-0 left-0"></div>
            <span className="text-xs font-sans-clean font-bold text-[#D4AF37] block mb-1">2026</span>
            <h4 className="font-bold text-lg mb-2">¡Nuestra Boda!</h4>
            <p className="text-xs text-gray-600 font-sans-clean leading-relaxed">
              Celebraremos el inicio de nuestro nuevo capítulo rodeados de todos ustedes.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN SEPARADA DE CEREMONIA & RECEPCIÓN */}
      <section id="lugares" className="py-20 bg-[#F3EDE2] border-y border-[#E8D3C5] scroll-mt-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-2">
            PUNTOS DE ENCUENTRO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1412] mb-12">
            Ceremonia Religiosa & Gran Recepción
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Card Ceremonia */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0F1412] text-[#D4AF37] flex items-center justify-center mb-6 shadow-md">
                  <Church className="w-6 h-6" />
                </div>
                <span className="text-xs font-sans-clean uppercase font-bold text-[#D4AF37] tracking-widest block mb-1">
                  1. SAGRADO MATRIMONIO
                </span>
                <h3 className="text-2xl font-bold text-[#0F1412] mb-2">Ceremonia Religiosa</h3>
                <p className="text-xs font-sans-clean text-gray-500 font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" /> 04:30 PM (Puntualidad solicitada)
                </p>

                <p className="text-xs font-sans-clean text-gray-600 leading-relaxed mb-6">
                  Nos uniremos ante el altar en la emblemática <strong>Iglesia San Estanislao de Kotska</strong>, construida en piedra en el corazón de Altos de Chavón.
                </p>

                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8D3C5]/80 mb-6">
                  <p className="text-[11px] font-sans-clean text-gray-700">
                    📍 <strong>Lugar:</strong> Iglesia San Estanislao, Altos de Chavón, La Romana.
                  </p>
                  <p className="text-[10px] font-sans-clean text-gray-500 mt-1">
                    🎶 Música sacra interpretada por cuarteto de cuerdas en vivo.
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Iglesia+San+Estanislao+Altos+de+Chavon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0F1412] text-white font-sans-clean text-xs font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-[#2A3631] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" /> Abrir Ubicación de la Iglesia
              </a>
            </div>

            {/* Card Recepción */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#0F1412] flex items-center justify-center mb-6 shadow-md">
                  <Wine className="w-6 h-6" />
                </div>
                <span className="text-xs font-sans-clean uppercase font-bold text-[#D4AF37] tracking-widest block mb-1">
                  2. CELEBRACIÓN & FIESTA
                </span>
                <h3 className="text-2xl font-bold text-[#0F1412] mb-2">Gran Recepción & Gala</h3>
                <p className="text-xs font-sans-clean text-gray-500 font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" /> 06:00 PM (Inmediatamente después)
                </p>

                <p className="text-xs font-sans-clean text-gray-600 leading-relaxed mb-6">
                  Celebraremos nuestro banquete en el <strong>Salón Principal & Terrazas del Anfiteatro</strong>, disfrutando de brisas tropicales y vista espectacular al Río Chavón.
                </p>

                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8D3C5]/80 mb-6">
                  <p className="text-[11px] font-sans-clean text-gray-700">
                    🥂 <strong>Cóctel de Bienvenida:</strong> Terrazas del Anfiteatro.
                  </p>
                  <p className="text-[10px] font-sans-clean text-gray-500 mt-1">
                    🍽️ Banquete gourmet 3 tiempos, orquesta en vivo y Hora Loca.
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Altos+de+Chavon+La+Romana"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#D4AF37] text-[#0F1412] font-sans-clean text-xs font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-[#FFF1CB] transition-colors"
              >
                <Utensils className="w-3.5 h-3.5" /> Abrir Ubicación del Salón de Fiestas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ITINERARIO DEL DÍA */}
      <section id="itinerario" className="py-20 px-4 max-w-3xl mx-auto text-center scroll-mt-20">
        <Clock className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
        <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-2">
          CRONOGRAMA OFICIAL
        </span>
        <h2 className="text-3xl font-bold text-[#0F1412] mb-10">Itinerario de la Celebración</h2>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-[#D4AF37]/40">
          {[
            { time: "04:30 PM", title: "Ceremonia Religiosa", detail: "Iglesia San Estanislao, Altos de Chavón" },
            { time: "05:45 PM", title: "Cóctel de Bienvenida & Fotografía", detail: "Terraza del Anfiteatro con vista al Río Chavón" },
            { time: "07:30 PM", title: "Entrada Triunfal & Primer Baile", detail: "Primer baile de esposos y brindis de honor" },
            { time: "08:15 PM", title: "Cena de Gala 3 Tiempos", detail: "Salón Principal Altos de Chavón" },
            { time: "09:30 PM", title: "Apertura de Pista & Orquesta", detail: "Música en vivo con orquesta bailable" },
            { time: "11:30 PM", title: "Hora Loca Venetian & DJ Set", detail: "Sorpresas, cotillón y fiesta hasta la madrugada" }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 bg-white p-6 rounded-2xl border border-[#E8D3C5] max-w-md mx-auto shadow-sm text-center">
              <span className="inline-block bg-[#0F1412] text-[#FFF1CB] text-xs font-sans-clean font-bold px-3.5 py-1 rounded-full mb-2">
                {item.time}
              </span>
              <h3 className="font-bold text-lg text-[#0F1412]">{item.title}</h3>
              <p className="text-xs text-gray-600 font-sans-clean mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORTE DE HONOR & PADRINOS */}
      <section id="padrinos" className="py-20 bg-[#F8F4EE] border-y border-[#E8D3C5] scroll-mt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
          <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-2">
            ACOMPAÑANTES ESPECIALES
          </span>
          <h2 className="text-3xl font-bold text-[#0F1412] mb-10">Corte de Honor & Padrinos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Padrinos */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5] shadow-sm">
              <h3 className="font-bold text-lg text-[#0F1412] mb-4 flex items-center gap-2 border-b border-[#E8D3C5] pb-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Padrinos de Boda
              </h3>
              <div className="space-y-3 font-sans-clean text-xs">
                <div>
                  <span className="text-[#D4AF37] font-bold block">Padrino de Honor</span>
                  <p className="text-gray-800 font-bold">D. Manuel Rodríguez</p>
                </div>
                <div>
                  <span className="text-[#D4AF37] font-bold block">Madrina de Honor</span>
                  <p className="text-gray-800 font-bold">Dña. Carmen Almanzar</p>
                </div>
              </div>
            </div>

            {/* Damas de Honor & Best Men */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5] shadow-sm">
              <h3 className="font-bold text-lg text-[#0F1412] mb-4 flex items-center gap-2 border-b border-[#E8D3C5] pb-2">
                <Heart className="w-4 h-4 text-[#D4AF37]" /> Damas de Honor & Caballeros
              </h3>
              <div className="grid grid-cols-2 gap-4 font-sans-clean text-xs">
                <div>
                  <span className="text-[#D4AF37] font-bold block mb-1">Damas de Honor</span>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Valeria Rodríguez</li>
                    <li>• Sofía Almanzar</li>
                    <li>• Mariana Gómez</li>
                  </ul>
                </div>
                <div>
                  <span className="text-[#D4AF37] font-bold block mb-1">Best Men</span>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Gabriel Martínez</li>
                    <li>• Fernando De la Rosa</li>
                    <li>• Carlos Henríquez</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRESS CODE & UBICACIÓN */}
      <section id="hospedaje" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Ubicación Mapa */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-md flex flex-col justify-between">
            <div>
              <MapPin className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-2xl font-bold text-[#0F1412] mb-1">Lugar de Celebración</h3>
              <p className="text-sm font-sans-clean text-gray-700 font-medium mb-1">Altos de Chavón</p>
              <p className="text-xs font-sans-clean text-gray-500 mb-6">La Romana</p>
              
              <div className="rounded-2xl overflow-hidden border border-[#E8D3C5] h-52 mb-6 shadow-inner">
                <iframe
                  title="Mapa de Altos de Chavón"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.8966838842426!2d-68.89136122398418!3d18.41164928266205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea24d14a6015555%3A0x6a0c59828ef05001!2sAltos%20de%20Chav%C3%B3n!5e0!3m2!1ses!2sdo!4v1700000000000!5m2!1ses!2sdo"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://maps.google.com/?q=Altos+de+Chavon+La+Romana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F1412] text-white font-sans-clean text-xs font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-[#2A3631] transition-colors"
              >
                Google Maps <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
              <a
                href="https://waze.com/ul?q=Altos+de+Chavon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4AF37] text-[#0F1412] font-sans-clean text-xs font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-[#FFF1CB] transition-colors"
              >
                Abrir Waze <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Dress Code */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[#D4AF37] font-serif text-2xl block mb-2">◆</span>
              <h3 className="text-2xl font-bold text-[#0F1412] mb-2">Código de Vestimenta</h3>
              <p className="text-sm font-sans-clean text-[#D4AF37] font-bold uppercase tracking-wider mb-4">
                Rigurosa Etiqueta / Black Tie
              </p>
              <p className="text-xs font-sans-clean text-gray-600 leading-relaxed mb-6">
                Queremos que todos lucen espectaculares. Damas con vestido largo formal y caballeros en smoking o traje oscuro elegante.
              </p>

              <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8D3C5]/60 mb-6">
                <span className="text-[11px] font-sans-clean uppercase font-bold text-gray-500 block">
                  Paleta de colores inspiradora:
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1A2521] border-2 border-gray-400 shadow-sm" title="Negro / Esmoquin"></div>
                  <div className="w-9 h-9 rounded-full bg-[#C5A059] border-2 border-white shadow-sm" title="Dorado / Champagne"></div>
                  <div className="w-9 h-9 rounded-full bg-[#4A0E17] border-2 border-white shadow-sm" title="Vino Tinto"></div>
                  <div className="w-9 h-9 rounded-full bg-[#1B2A4A] border-2 border-white shadow-sm" title="Azul Noche"></div>
                </div>
                <p className="text-[11px] text-gray-500 italic mt-2">
                  ⚠️ El color blanco y tonos crema están reservados exclusivamente para la novia.
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 font-sans-clean text-center italic">
              Agradecemos su comprensión y elegancia para este día tan especial.
            </div>
          </div>

        </div>
      </section>

      {/* QR MODAL PREVIEW */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#FAF8F5] border border-[#D4AF37] p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F1412] text-[#D4AF37] rounded-full text-[10px] font-bold uppercase font-sans-clean">
              <ShieldCheck className="w-3.5 h-3.5" /> Pase VIP Acreditado
            </div>

            <h3 className="text-2xl font-bold text-[#0F1412]">Boda Camila & Lucas</h3>
            <p className="text-xs font-sans-clean text-gray-600">Acreditación Personal para Ceremonia & Gala</p>

            <div className="bg-white p-4 rounded-2xl border-4 border-[#D4AF37] w-48 h-48 mx-auto flex flex-col items-center justify-center gap-2 shadow-lg">
              <QrCode className="w-32 h-32 text-[#0F1412]" />
              <span className="text-[10px] font-mono text-[#0F1412] font-bold">WEDDING-C&L-2026</span>
            </div>

            <p className="text-[11px] font-sans-clean text-gray-500">
              Muestre este pase digital en el control de acceso de Altos de Chavón para ingreso fluido.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-[#0F1412] text-[#D4AF37] font-sans-clean font-bold text-xs uppercase py-3 rounded-xl"
            >
              Cerrar Pase Digital
            </button>
          </div>
        </div>
      )}

      {/* MESA DE REGALOS */}
      <section id="regalos" className="py-20 bg-[#F3EDE2] border-y border-[#E8D3C5] scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Gift className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-[#0F1412] mb-3">Mesa de Regalos & Luna de Miel</h2>
          <p className="text-xs font-sans-clean text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
            Su presencia es nuestro mejor regalo. Sin embargo, si desean hacernos un obsequio, agradeceremos enormemente una contribución para nuestro fondo de luna de miel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {/* Banco Popular */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5] shadow-sm">
              <span className="text-xs font-sans-clean font-bold text-[#D4AF37] block mb-1">BANCO POPULAR (RD$)</span>
              <p className="text-sm font-bold text-gray-900">Cuenta de Ahorros</p>
              <p className="text-xs font-mono text-gray-600 my-2">No. 823-492019-3</p>
              <p className="text-[11px] text-gray-500 mb-4">Titular: Camila Rodríguez</p>
              
              <button
                onClick={() => copyToClipboard("8234920193", "popular")}
                className="w-full bg-[#0F1412] text-white font-sans-clean text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2A3631] transition-colors"
              >
                {copiedAccount === "popular" ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                {copiedAccount === "popular" ? "¡Número Copiado!" : "Copiar Cuenta Bancaria"}
              </button>
            </div>

            {/* Zelle */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8D3C5] shadow-sm">
              <span className="text-xs font-sans-clean font-bold text-[#D4AF37] block mb-1">ZELLE / DÓLARES (US$)</span>
              <p className="text-sm font-bold text-gray-900">Transferencia Zelle</p>
              <p className="text-xs font-mono text-gray-600 my-2">camilaylucas2026@gmail.com</p>
              <p className="text-[11px] text-gray-500 mb-4">Titular: Lucas Almanzar</p>
              
              <button
                onClick={() => copyToClipboard("camilaylucas2026@gmail.com", "zelle")}
                className="w-full bg-[#D4AF37] text-[#0F1412] font-sans-clean text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFF1CB] transition-colors"
              >
                {copiedAccount === "zelle" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedAccount === "zelle" ? "¡Correo Copiado!" : "Copiar Correo Zelle"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA DE FOTOS */}
      <section id="galeria" className="py-20 px-4 max-w-5xl mx-auto text-center scroll-mt-20">
        <Camera className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
        <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-2">
          ÁLBUM DE RECUERDOS
        </span>
        <h2 className="text-3xl font-bold text-[#0F1412] mb-8">Nuestros Momentos</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(img)}
              className="relative h-60 sm:h-72 rounded-2xl overflow-hidden cursor-pointer group border border-[#E8D3C5] shadow-sm"
            >
              <img
                src={img}
                alt={`Galería ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-sans-clean font-bold bg-black/70 px-4 py-2 rounded-full border border-white/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Ampliar Foto
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-[#D4AF37] p-2"
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
      <section id="muro" className="py-20 px-4 bg-[#F8F4EE] border-t border-[#E8D3C5] scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <MessageSquare className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <span className="text-xs uppercase font-sans-clean tracking-widest text-[#A37E2C] font-semibold block mb-2">
              LIBRO DE FIRMAS DIGITAL
            </span>
            <h2 className="text-3xl font-bold text-[#0F1412] mb-2">Muro de Felicitaciones</h2>
            <p className="text-xs text-gray-600 font-sans-clean max-w-md mx-auto">
              Deja un mensaje con tus mejores deseos para Camila & Lucas en este día tan especial.
            </p>
          </div>

          {/* New Message Form */}
          <form onSubmit={handleGuestbookSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D3C5] shadow-md mb-10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans-clean uppercase font-bold text-gray-700 mb-1">
                  Tu Nombre o Familia *
                </label>
                <input
                  type="text"
                  required
                  value={newMessage.name}
                  onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                  placeholder="Ej. Familia Martínez"
                  className="w-full bg-[#FAF8F5] border border-[#E8D3C5] rounded-xl p-3 text-xs text-gray-900 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-clean uppercase font-bold text-gray-700 mb-1">
                  Relación con los novios
                </label>
                <input
                  type="text"
                  value={newMessage.relationship}
                  onChange={(e) => setNewMessage({ ...newMessage, relationship: e.target.value })}
                  placeholder="Ej. Amigos de la infancia"
                  className="w-full bg-[#FAF8F5] border border-[#E8D3C5] rounded-xl p-3 text-xs text-gray-900 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans-clean uppercase font-bold text-gray-700 mb-1">
                Tu Mensaje de Felicitación *
              </label>
              <textarea
                required
                rows={3}
                value={newMessage.message}
                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                placeholder="Escribe tus palabras y deseos para los novios aquí..."
                className="w-full bg-[#FAF8F5] border border-[#E8D3C5] rounded-xl p-3 text-xs text-gray-900 focus:border-[#D4AF37] focus:outline-none resize-none"
              ></textarea>
            </div>

            {messageSent && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Tu mensaje ha sido publicado en el muro de felicitaciones!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0F1412] text-[#D4AF37] font-sans-clean font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2A3631] transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Publicar Mensaje de Felicitación
            </button>
          </form>

          {/* Messages Feed */}
          <div className="space-y-4">
            {guestMessages.map((msg) => (
              <div key={msg.id} className="bg-white p-5 rounded-2xl border border-[#E8D3C5] shadow-sm text-left">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-[#0F1412]">{msg.name}</h4>
                    <span className="text-[10px] text-[#D4AF37] font-sans-clean font-semibold uppercase tracking-wider">
                      {msg.relationship}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-sans-clean">{msg.date}</span>
                </div>
                <p className="text-xs text-gray-600 font-sans-clean leading-relaxed italic">
                  "{msg.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP FORM */}
      <section id="rsvp" className="py-20 px-4 bg-[#0F1412] text-white scroll-mt-20">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase font-sans-clean tracking-widest text-[#D4AF37] font-semibold block mb-2">
            POR FAVOR CONFIRMA TU ASISTENCIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            ¿Nos Acompañas?
          </h2>
          <p className="text-xs text-[#E8E6E1]/80 font-sans-clean mb-8">
            Agradecemos confirmar antes del 1ro de Octubre de 2026.
          </p>

          {rsvpSubmitted ? (
            <div className="bg-[#161D1A] border border-[#D4AF37] p-8 rounded-3xl text-center">
              <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 animate-bounce" />
              <h3 className="text-2xl font-bold mb-2">Se abrió WhatsApp</h3>
              {/* El mensaje queda redactado, pero lo envía el invitado. */}
              <p className="text-xs text-gray-300 font-sans-clean mb-2">
                Tu confirmación quedó redactada en WhatsApp. Envía el mensaje para completarla.
              </p>
              <p className="text-[10px] text-gray-400 font-sans-clean mb-6">
                Es una muestra: los datos no se guardan en ningún sistema.
              </p>
              <button
                onClick={() => setRsvpSubmitted(false)}
                className="bg-[#D4AF37] text-[#0F1412] font-sans-clean font-bold text-xs uppercase px-6 py-3 rounded-xl"
              >
                Editar Respuesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="bg-[#161D1A] p-6 sm:p-8 rounded-3xl border border-[#2A3631] text-left space-y-5">
              <div>
                <label className="block text-xs font-sans-clean uppercase font-bold text-gray-300 mb-2">
                  Nombre Completo del Invitado Principal *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpData.fullName}
                  onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#0F1412] border border-[#2A3631] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans-clean uppercase font-bold text-gray-300 mb-2">
                    ¿Asistirás?
                  </label>
                  <select
                    value={rsvpData.attendance}
                    onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })}
                    className="w-full bg-[#0F1412] border border-[#2A3631] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Confirmado">✅ Sí, asistiré</option>
                    <option value="Declina">❌ No podré asistir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans-clean uppercase font-bold text-gray-300 mb-2">
                    Número de Pases Asignados
                  </label>
                  <select
                    value={rsvpData.guestCount}
                    onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                    className="w-full bg-[#0F1412] border border-[#2A3631] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value={1}>Solo yo (1 pase)</option>
                    <option value={2}>2 Pases (Acompañante)</option>
                    <option value={3}>3 Pases</option>
                    <option value={4}>4 Pases (Familia)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans-clean uppercase font-bold text-gray-300 mb-2">
                  Preferencia de Menú de Gala
                </label>
                <select
                  value={rsvpData.menuPreference}
                  onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })}
                  className="w-full bg-[#0F1412] border border-[#2A3631] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="Corte de Res Angus a las Tres Pimientas">🥩 Corte de Res Angus a las Tres Pimientas</option>
                  <option value="Filete de Dorado en Salsa de Maracuyá">🐟 Filete de Dorado en Salsa de Maracuyá</option>
                  <option value="Risotto de Hongos Silvestres (Vegetariano)">🍄 Risotto de Hongos Silvestres (Vegetariano)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans-clean uppercase font-bold text-gray-300 mb-2">
                  Alergias o Restricciones Alimentarias
                </label>
                <input
                  type="text"
                  value={rsvpData.dietaryNotes}
                  onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })}
                  placeholder="Ej. Alergia a mariscos / Intolerante al gluten"
                  className="w-full bg-[#0F1412] border border-[#2A3631] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-clean uppercase font-bold text-gray-300 mb-2">
                  ¿Qué canción no puede faltar en la fiesta?
                </label>
                <input
                  type="text"
                  value={rsvpData.songRequest}
                  onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })}
                  placeholder="Ej. Juan Luis Guerra — Las Avispas"
                  className="w-full bg-[#0F1412] border border-[#2A3631] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#0F1412] font-sans-clean font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              >
                <Send className="w-4 h-4" />
                Confirmar Asistencia por WhatsApp
              </button>
            </form>
          )}

        </div>
      </section>

      {/* DISCRETE BOTTOM WATERMARK */}
      <footer className="bg-[#0B0E0D] py-8 text-center border-t border-[#2A3631]">
        <a
          href={createDemoWatermarkWhatsAppUrl("Boda Camila & Lucas")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-sans-clean text-[#D4AF37] hover:underline font-semibold"
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
          eventLocation="Grand Palladium Resort, Cap Cana"
          onClose={() => setShowVipPassModal(false)}
        />
      )}

    </div>
  );
}
