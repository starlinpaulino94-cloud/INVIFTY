import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Sparkles, Music, MapPin, Calendar, Clock, Gift, 
  CheckCircle2, Volume2, VolumeX, ArrowLeft, Send, 
  MessageSquare, Heart, PartyPopper, ExternalLink, Copy, Check,
  Camera, X, Navigation, Globe, Disc, Play, ThumbsUp, Radio
} from "lucide-react";
import quinceImg from "../assets/images/quince_valeria_demo.webp";
import { useLanguage } from "../context/LanguageContext";

interface CumpleDemoProps {
  onBackToHome: () => void;
}

export default function CumpleDemo({ onBackToHome }: CumpleDemoProps) {
  const { language, setLanguage, t } = useLanguage();

  // Target date: September 20, 2026 19:00:00 AST
  const targetDate = new Date("2026-09-20T19:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Playlist State
  const [songList, setSongList] = useState([
    { id: "1", title: "A Thousand Years (Instrumental)", artist: "The Piano Guys", votes: 42, requestedBy: "Valeria Sofía" },
    { id: "2", title: "Tití Me Preguntó", artist: "Bad Bunny", votes: 38, requestedBy: "Sofi & Mateo" },
    { id: "3", title: "Danza Kuduro", artist: "Don Omar", votes: 29, requestedBy: "Tío Carlos" },
    { id: "4", title: "Despacito", artist: "Luis Fonsi", votes: 25, requestedBy: "Camila" },
    { id: "5", title: "Bailando", artist: "Enrique Iglesias", votes: 21, requestedBy: "Familia Gómez" },
  ]);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [songAdded, setSongAdded] = useState(false);

  // Wishes Wall state
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; text: string; date: string }>>([
    { 
      id: "1", 
      name: "Tía Carmen & Tío Manuel", 
      text: language === "es" ? "¡Felices 15 años mi niña hermosa! Que Dios guíe cada uno de tus pasos y disfrutes esta noche inolvidable." : "Happy 15th Birthday sweet girl! May God guide every step of your life.", 
      date: "Hace 2 horas" 
    },
    { 
      id: "2", 
      name: "Sofi, Mateo & Camila", 
      text: language === "es" ? "¡Valeee! Contando las horas para bailar en el vals y la hora loca. Te queremos muchísimo 🎉✨" : "Counting the hours to dance at the party! We love you so much 🎉✨", 
      date: "Hace 5 horas" 
    },
    { 
      id: "3", 
      name: "Familia Gómez Rivas", 
      text: language === "es" ? "Un honor acompañarte a ti y a tus padres en este hermoso momento. ¡A celebrar en grande!" : "An honor to celebrate with you and your parents on this beautiful day!", 
      date: "Ayer" 
    }
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 2,
    menuPreference: "Cena Buffet Internacional",
    dietaryNotes: "",
    songRequest: ""
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

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

  const toggleAudio = () => {
    if (!isPlayingMusic) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
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

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const handleVoteSong = (id: string) => {
    setSongList(prev => prev.map(song => song.id === id ? { ...song, votes: song.votes + 1 } : song));
  };

  const handleAddSong = (e: FormEvent) => {
    e.preventDefault();
    if (!newSongTitle.trim()) return;

    setSongList(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newSongTitle.trim(),
        artist: newSongArtist.trim() || (language === "es" ? "Sugerida por Invitado" : "Guest Request"),
        votes: 1,
        requestedBy: language === "es" ? "Invitado VIP" : "VIP Guest"
      }
    ]);

    setNewSongTitle("");
    setNewSongArtist("");
    setSongAdded(true);
    setTimeout(() => setSongAdded(false), 4000);
  };

  const handleAddWish = (e: FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishText.trim()) return;

    setWishes([
      { id: Date.now().toString(), name: newWishName.trim(), text: newWishText.trim(), date: language === "es" ? "Hace un momento" : "Just now" },
      ...wishes
    ]);
    setNewWishName("");
    setNewWishText("");
    setWishPublished(true);
    setTimeout(() => setWishPublished(false), 4000);
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const url = createRsvpWhatsAppUrl("Mis 15 Años — Valeria Sofía", rsvpData);
    window.open(url, "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent("15 Años Valeria Sofía");
    const details = encodeURIComponent("Celebración de los 15 Años de Valeria Sofía en el Grand Ballroom Hotel Jaragua.");
    const location = encodeURIComponent("Hotel Jaragua, Av. George Washington");
    const start = "20260920T230000Z";
    const end = "20260921T070000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const galleryImages = [
    quinceImg,
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="bg-[#120B10] text-[#FBEAF0] min-h-screen font-sans selection:bg-[#E29578]/30 relative pb-20">
      
      {/* Top Floating Watermark Bar */}
      <div className="bg-[#0F1412] text-[#FFF1CB] py-2.5 px-4 sticky top-0 z-50 shadow-md border-b border-[#D4AF37]/30 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-white/10 border border-[#D4AF37]/40 rounded-full p-1 text-[10px] font-semibold">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1 mr-0.5" />
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "es" ? "bg-[#D4AF37] text-black font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            ES
          </button>
          <span className="text-gray-500 text-[9px]">|</span>
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
          href={createDemoWatermarkWhatsAppUrl("Mis 15 Años Valeria")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors rounded-full"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Sticky Internal Navigation Bar */}
      <div className="bg-[#1E1119]/90 backdrop-blur-md border-b border-[#E29578]/30 sticky top-10 z-40 py-2.5 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 sm:gap-5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap text-[#E29578]">
          <button onClick={() => scrollToSection("programa")} className="hover:text-white transition-colors">
            {language === "es" ? "Programa" : "Schedule"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("galeria")} className="hover:text-white transition-colors">
            {language === "es" ? "Fotos" : "Gallery"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("playlist")} className="hover:text-white transition-colors">
            {language === "es" ? "Playlist" : "Playlist"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("ubicacion")} className="hover:text-white transition-colors">
            {language === "es" ? "Ubicación" : "Venue"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("regalos")} className="hover:text-white transition-colors">
            {language === "es" ? "Lluvia de Sobres" : "Gifts"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("muro")} className="hover:text-white transition-colors">
            {language === "es" ? "Muro" : "Wishes"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("rsvp")} className="bg-[#E29578] text-[#120B10] px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            RSVP
          </button>
        </div>
      </div>

      {/* Floating Audio Toggle Widget */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={toggleAudio}
          className={`px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 border ${
            isPlayingMusic
              ? "bg-[#E29578] text-[#120B10] border-[#E29578] font-bold scale-105"
              : "bg-[#1E1119] text-[#E29578] border-[#E29578]/50 hover:bg-[#2A1823]"
          }`}
          title={isPlayingMusic ? "Pausar música" : "Activar música"}
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-widest font-bold leading-none">
              {isPlayingMusic ? (language === "es" ? "Música de 15 Años" : "Sweet 15 Music") : (language === "es" ? "Música de Fondo" : "Background Music")}
            </span>
            <span className="text-[8px] opacity-80 leading-tight">
              {isPlayingMusic ? "A Thousand Years (Instrumental)" : (language === "es" ? "Haz clic para escuchar" : "Click to play sound")}
            </span>
          </div>
        </button>
      </div>

      {/* HERO COVER */}
      <header className="relative min-h-[85vh] flex items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={quinceImg}
            alt="Valeria Sofía 15 Años"
            className="w-full h-full object-cover object-center opacity-40 filter scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#120B10]/80 via-[#120B10]/70 to-[#120B10]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 pt-12">
          {/* Monogram Badge */}
          <div className="w-16 h-16 border-2 border-[#E29578] rounded-full mx-auto flex items-center justify-center bg-black/50 backdrop-blur-md text-[#E29578] font-serif text-2xl tracking-widest shadow-2xl">
            V S
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E29578]/20 border border-[#E29578]/40 text-[#FFCAD4] text-xs font-bold uppercase tracking-widest">
            <PartyPopper className="w-4 h-4 text-[#E29578]" />
            {language === "es" ? "Mis Quince Años" : "Sweet Fifteen Celebration"}
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold font-serif tracking-tight text-white leading-tight">
            Valeria Sofía
          </h1>

          <div className="w-24 h-[1px] bg-[#E29578] mx-auto opacity-70"></div>

          <p className="font-serif italic text-xl sm:text-2xl text-[#FFCAD4] font-light max-w-lg mx-auto leading-relaxed">
            {language === "es" 
              ? "«15 años de risas, sueños e ilusiones... hoy celebro el inicio de la etapa más hermosa junto a las personas que más amo.»"
              : "«15 years of smiles, dreams, and joy. Today I celebrate the beginning of a beautiful journey surrounded by those I love most.»"}
          </p>

          <div className="pt-4 text-xs uppercase tracking-widest text-gray-300 font-semibold flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#E29578]" /> {language === "es" ? "Domingo, 20 de Septiembre de 2026" : "Sunday, September 20, 2026"}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#E29578]" /> Hotel Jaragua, Santo Domingo</span>
          </div>
        </div>
      </header>

      {/* COUNTDOWN TIMER */}
      <section className="max-w-3xl mx-auto -mt-12 relative z-20 px-4">
        <div className="bg-[#1E1119] border border-[#E29578]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-[#E29578] font-bold block mb-4">
            {language === "es" ? "CUÁNTO FALTA PARA MI FIESTA DE 15 AÑOS" : "COUNTDOWN TO MY SWEET 15 PARTY"}
          </span>

          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
            <div className="bg-[#120B10] p-3 rounded-2xl border border-[#E29578]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.days}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.days")}</span>
            </div>
            <div className="bg-[#120B10] p-3 rounded-2xl border border-[#E29578]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.hours")}</span>
            </div>
            <div className="bg-[#120B10] p-3 rounded-2xl border border-[#E29578]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.minutes")}</span>
            </div>
            <div className="bg-[#120B10] p-3 rounded-2xl border border-[#E29578]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.seconds")}</span>
            </div>
          </div>

          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#E29578] text-[#120B10] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#FFCAD4] transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4" /> {language === "es" ? "Agregar a mi Google Calendar" : "Add to Google Calendar"}
          </a>
        </div>
      </section>

      {/* ITINERARIO DE LA FIESTA */}
      <section id="programa" className="py-20 px-4 max-w-3xl mx-auto text-center scroll-mt-20">
        <Clock className="w-8 h-8 text-[#E29578] mx-auto mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#E29578] font-bold block mb-1">
          {language === "es" ? "CRONOGRAMA DE LA NOCHE" : "EVENING TIMELINE"}
        </span>
        <h2 className="text-3xl font-serif font-bold text-white mb-8">
          {language === "es" ? "Programa de la Celebración" : "Party Schedule"}
        </h2>

        <div className="space-y-4 text-left">
          {[
            { 
              time: "07:00 PM", 
              title: language === "es" ? "Misa de Acción de Gracias" : "Thanksgiving Mass", 
              detail: language === "es" ? "Parroquia San Judas Tadeo" : "San Judas Tadeo Parish" 
            },
            { 
              time: "08:30 PM", 
              title: language === "es" ? "Recepción de Invitados & Cóctel de Bienvenida" : "Guest Reception & Welcome Cocktails", 
              detail: language === "es" ? "Foyer Grand Ballroom Hotel Jaragua" : "Jaragua Grand Ballroom Foyer" 
            },
            { 
              time: "09:30 PM", 
              title: language === "es" ? "Entrada Triunfal, Vals & Brindis de Honor" : "Grand Entrance, Waltz & Toast", 
              detail: language === "es" ? "Momento emotivo junto a mis padres y padrinos" : "Special waltz with parents & godparents" 
            },
            { 
              time: "10:30 PM", 
              title: language === "es" ? "Cena de Gala & Apertura de la Pista" : "Gala Dinner & Dance Floor Opening", 
              detail: language === "es" ? "Música en vivo, show de luces y DJ en vivo" : "Live music, light show and live DJ" 
            },
            { 
              time: "12:00 AM", 
              title: language === "es" ? "Hora Loca Glamour & Sorpresas" : "Glamour Crazy Hour & Surprises", 
              detail: language === "es" ? "Accesorios, máscaras, luces LED y cotillón" : "Props, masks, LED lights & party favors" 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1E1119] p-5 rounded-2xl border border-[#E29578]/30 flex items-center gap-4 hover:border-[#E29578] transition-colors">
              <span className="bg-[#E29578] text-[#120B10] text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 font-mono">
                {item.time}
              </span>
              <div>
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERÍA DE FOTOS DE VALERIA */}
      <section id="galeria" className="py-20 px-4 max-w-5xl mx-auto text-center scroll-mt-20">
        <Camera className="w-8 h-8 text-[#E29578] mx-auto mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#E29578] font-bold block mb-1">
          {language === "es" ? "SESIÓN DE FOTOS DE QUINCE" : "PHOTO SHOOT GALLERY"}
        </span>
        <h2 className="text-3xl font-serif font-bold text-white mb-8">
          {language === "es" ? "Sesión Fotográfica" : "Valeria's Photo Gallery"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(img)}
              className="relative h-60 rounded-2xl overflow-hidden cursor-pointer group border border-[#E29578]/30 shadow-md"
            >
              <img
                src={img}
                alt={`Valeria 15 años foto ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/70 px-4 py-2 rounded-full border border-white/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E29578]" /> {language === "es" ? "Ampliar Foto" : "Enlarge Photo"}
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
            className="absolute top-6 right-6 text-white hover:text-[#E29578] p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={activePhoto}
            alt="Foto ampliada"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-[#E29578]"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* SECCIÓN PLAYLIST & MÚSICA */}
      <section id="playlist" className="py-20 px-4 max-w-4xl mx-auto scroll-mt-20">
        <div className="bg-[#1E1119] p-8 sm:p-10 rounded-3xl border border-[#E29578]/40 shadow-2xl">
          <div className="text-center mb-8">
            <Disc className="w-8 h-8 text-[#E29578] mx-auto mb-3 animate-spin-slow" />
            <span className="text-xs uppercase tracking-widest text-[#E29578] font-bold block mb-1">
              {language === "es" ? "LA MÚSICA DE LA NOCHE" : "PARTY PLAYLIST & REQUESTS"}
            </span>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">
              {language === "es" ? "Playlist de la Quinceañera" : "Vote & Request Songs"}
            </h2>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              {language === "es" 
                ? "¡Tú pones el ritmo! Vota por tus canciones favoritas o sugiere la canción que no puede faltar en la fiesta."
                : "Help build the party vibe! Vote for your favorite tracks or add your song request for the DJ."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Song List & Voting */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-[#E29578]" /> {language === "es" ? "Canciones Populares" : "Top Voted Songs"}
              </h3>
              
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {songList.map((song) => (
                  <div key={song.id} className="bg-[#120B10] p-3.5 rounded-2xl border border-[#E29578]/20 flex items-center justify-between gap-3 text-xs">
                    <div className="overflow-hidden">
                      <span className="font-bold text-white block truncate">{song.title}</span>
                      <span className="text-gray-400 text-[10px]">{song.artist} · <span className="text-[#E29578]">{song.requestedBy}</span></span>
                    </div>

                    <button
                      onClick={() => handleVoteSong(song.id)}
                      className="bg-[#1E1119] border border-[#E29578]/40 hover:bg-[#E29578] hover:text-[#120B10] text-[#E29578] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{song.votes}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Song Form */}
            <div className="bg-[#120B10] p-6 rounded-2xl border border-[#E29578]/30 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#E29578]" /> {language === "es" ? "Sugerir Nueva Canción" : "Suggest a Track"}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  {language === "es" ? "Ingresa el nombre del tema para que el DJ lo incluya en la hora loca." : "Submit a song title for the DJ list."}
                </p>

                <form onSubmit={handleAddSong} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">{language === "es" ? "Nombre de la Canción *" : "Song Name *"}</label>
                    <input
                      type="text"
                      required
                      value={newSongTitle}
                      onChange={(e) => setNewSongTitle(e.target.value)}
                      placeholder="Ej. Pepas / Tití Me Preguntó"
                      className="w-full bg-[#1E1119] border border-[#E29578]/30 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E29578]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">{language === "es" ? "Artista (Opcional)" : "Artist (Optional)"}</label>
                    <input
                      type="text"
                      value={newSongArtist}
                      onChange={(e) => setNewSongArtist(e.target.value)}
                      placeholder="Ej. Farruko"
                      className="w-full bg-[#1E1119] border border-[#E29578]/30 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E29578]"
                    />
                  </div>

                  {songAdded && (
                    <p className="text-xs text-emerald-400 font-medium">{language === "es" ? "¡Canción agregada a la lista!" : "Song added to playlist!"}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#E29578] text-[#120B10] font-bold text-xs uppercase py-3 rounded-xl hover:bg-[#FFCAD4] transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-3.5 h-3.5" /> {language === "es" ? "Agregar a la Playlist" : "Add to Playlist"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UBICACIÓN & DRESS CODE */}
      <section id="ubicacion" className="py-16 px-4 max-w-5xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#1E1119] p-6 rounded-3xl border border-[#E29578]/30">
            <MapPin className="w-8 h-8 text-[#E29578] mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">{language === "es" ? "Lugar del Evento" : "Venue Location"}</h3>
            <p className="text-sm text-[#FFCAD4] font-bold mb-1">Grand Ballroom — Hotel Jaragua</p>
            <p className="text-xs text-gray-400 mb-4">Av. George Washington, Santo Domingo</p>

            <div className="rounded-2xl overflow-hidden border border-[#E29578]/30 h-48 mb-4 shadow-inner">
              <iframe
                title="Hotel Jaragua Santo Domingo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.567023326127!2d-69.89736862398273!3d18.45781218262276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea559590e38a2e1%3A0xb351508db86be778!2sRenaissance%20Santo%20Domingo%20Jaragua%20Hotel%20%26%20Casino!5e0!3m2!1ses!2sdo!4v1700000000000!5m2!1ses!2sdo"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://maps.google.com/?q=Renaissance+Santo+Domingo+Jaragua"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E29578] text-[#120B10] font-bold text-xs py-3 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#FFCAD4] transition-colors"
              >
                Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://waze.com/ul?q=Hotel+Jaragua+Santo+Domingo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 border border-[#E29578]/50 text-white font-bold text-xs py-3 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
              >
                Abrir Waze <Navigation className="w-3.5 h-3.5 text-[#E29578]" />
              </a>
            </div>
          </div>

          <div id="vestimenta" className="bg-[#1E1119] p-6 rounded-3xl border border-[#E29578]/30 flex flex-col justify-between scroll-mt-20">
            <div>
              <Sparkles className="w-8 h-8 text-[#E29578] mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">{language === "es" ? "Código de Vestimenta" : "Dress Code"}</h3>
              <p className="text-xs text-[#E29578] font-bold uppercase tracking-wider mb-3">
                {language === "es" ? "Glamour & Elegancia (Etiqueta Formal)" : "Glamour & Elegance (Formal Attire)"}
              </p>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                {language === "es" 
                  ? "Te invitamos a lucir espectacular. Traje formal u oscuro para caballeros y vestido de fiesta de gala para las damas."
                  : "Gentlemen in formal suits, ladies in evening gala gowns."}
              </p>

              <div className="bg-[#120B10] p-4 rounded-2xl border border-[#E29578]/30 mb-4">
                <span className="text-[11px] text-gray-400 block mb-2 font-bold uppercase">
                  {language === "es" ? "Paleta de colores sugerida:" : "Suggested color palette:"}
                </span>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E29578] border border-white/40 shadow" title="Rose Gold"></div>
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] border border-white/40 shadow" title="Dorado Champagne"></div>
                  <div className="w-8 h-8 rounded-full bg-[#E8C5C8] border border-white/40 shadow" title="Rosado Pastel"></div>
                  <div className="w-8 h-8 rounded-full bg-[#2A1E29] border border-white/40 shadow" title="Negro Elegante"></div>
                </div>
                <p className="text-[10px] text-gray-400 italic mt-3">
                  ⚠️ {language === "es" ? "El color Rose Gold & Esmeralda están reservados para la quinceañera." : "Rose Gold & Emerald are reserved for the birthday girl."}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 italic text-center">
              {language === "es" ? "¡Prepárate para vivir una noche inolvidable repleta de magia!" : "Get ready for an unforgettable night!"}
            </p>
          </div>

        </div>
      </section>

      {/* LLUVIA DE SOBRES / MESA DE REGALOS */}
      <section id="regalos" className="py-16 px-4 max-w-3xl mx-auto text-center scroll-mt-20">
        <div className="bg-[#1E1119] p-8 rounded-3xl border border-[#E29578]/40 shadow-xl">
          <Gift className="w-8 h-8 text-[#E29578] mx-auto mb-3" />
          <h2 className="text-3xl font-serif font-bold text-white mb-3">
            {language === "es" ? "Lluvia de Sobres" : "Gift Registry & Cash Envelope"}
          </h2>
          <p className="text-xs text-gray-300 max-w-lg mx-auto mb-8 leading-relaxed">
            {language === "es" 
              ? "Tu presencia es mi mayor regalo. Si deseas hacerme un detalle especial, contaremos con buzón de lluvia de sobres el día del evento o puedes realizar una transferencia:"
              : "Your presence is my greatest gift. If you wish to give a present, cash envelope box will be available at the venue or via direct transfer:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="bg-[#120B10] p-5 rounded-2xl border border-[#E29578]/30">
              <span className="text-[10px] font-bold text-[#E29578] uppercase tracking-widest block mb-1">Banco Popular R.D.</span>
              <p className="text-sm font-bold text-white">{language === "es" ? "Cuenta de Ahorros" : "Savings Account"}</p>
              <p className="text-xs text-gray-400 font-mono my-2">912-384019-2</p>
              <p className="text-[11px] text-gray-400 mb-3">{language === "es" ? "A nombre de: Valeria Sofía Rivas" : "Account Holder: Valeria Sofía Rivas"}</p>
              
              <button
                onClick={() => copyToClipboard("9123840192", "popular")}
                className="w-full bg-[#E29578] text-[#120B10] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFCAD4] transition-colors"
              >
                {copiedAccount === "popular" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedAccount === "popular" ? (language === "es" ? "¡Número Copiado!" : "Copied!") : (language === "es" ? "Copiar Cuenta Bancaria" : "Copy Account Number")}
              </button>
            </div>

            <div className="bg-[#120B10] p-5 rounded-2xl border border-[#E29578]/30">
              <span className="text-[10px] font-bold text-[#E29578] uppercase tracking-widest block mb-1">Zelle (USD)</span>
              <p className="text-sm font-bold text-white">{language === "es" ? "Transferencia Directa" : "Direct Transfer"}</p>
              <p className="text-xs text-gray-400 font-mono my-2">valeria15anos@gmail.com</p>
              <p className="text-[11px] text-gray-400 mb-3">{language === "es" ? "A nombre de: Carmen Rivas (Madre)" : "Account Holder: Carmen Rivas (Mother)"}</p>
              
              <button
                onClick={() => copyToClipboard("valeria15anos@gmail.com", "zelle")}
                className="w-full bg-black border border-[#E29578]/50 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1E1119] transition-colors"
              >
                {copiedAccount === "zelle" ? <Check className="w-4 h-4 text-[#E29578]" /> : <Copy className="w-4 h-4 text-[#E29578]" />}
                {copiedAccount === "zelle" ? (language === "es" ? "¡Correo Copiado!" : "Copied!") : (language === "es" ? "Copiar Correo Zelle" : "Copy Zelle Email")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIBRO DE FIRMAS / BUENOS DESEOS */}
      <section id="muro" className="py-16 px-4 max-w-3xl mx-auto text-center scroll-mt-20">
        <MessageSquare className="w-8 h-8 text-[#E29578] mx-auto mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#E29578] font-bold block mb-1">
          {language === "es" ? "MURO DE FIRMAS DIGITAL" : "GUESTBOOK & WISHES WALL"}
        </span>
        <h2 className="text-3xl font-serif font-bold text-white mb-2">
          {language === "es" ? "Mensajes de Felicitación" : "Sweet Messages"}
        </h2>
        <p className="text-xs text-gray-300 mb-8">
          {language === "es" ? "Déjale un mensaje especial a Valeria para sus 15 años." : "Leave a special wish for Valeria's 15th birthday."}
        </p>

        <form onSubmit={handleAddWish} className="bg-[#1E1119] p-6 sm:p-8 rounded-3xl border border-[#E29578]/30 text-left mb-8 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">{language === "es" ? "Tu Nombre o Familia *" : "Your Name / Family *"}</label>
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Ej. Tía Sofia & Tío Carlos"
              className="w-full bg-[#120B10] border border-[#E29578]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#E29578]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">{language === "es" ? "Tus Palabras de Felicitación *" : "Your Words & Blessing *"}</label>
            <textarea
              rows={3}
              required
              value={newWishText}
              onChange={(e) => setNewWishText(e.target.value)}
              placeholder={language === "es" ? "Escribe tus mejores deseos para Valeria aquí..." : "Write your wishes here..."}
              className="w-full bg-[#120B10] border border-[#E29578]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#E29578] resize-none"
            ></textarea>
          </div>

          {wishPublished && (
            <div className="bg-emerald-950/80 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === "es" ? "¡Tu mensaje ha sido publicado en el libro de firmas!" : "Your message has been posted on the guestbook!"}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#E29578] text-[#120B10] font-bold text-xs uppercase py-3.5 rounded-xl hover:bg-[#FFCAD4] transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Send className="w-3.5 h-3.5" /> {language === "es" ? "Publicar Mi Mensaje" : "Post My Wish"}
          </button>
        </form>

        <div className="space-y-4 text-left">
          {wishes.map((item) => (
            <div key={item.id} className="bg-[#1E1119]/90 p-5 rounded-2xl border border-[#E29578]/30">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-[#FFCAD4]">{item.name}</span>
                <span className="text-[10px] text-gray-400">{item.date}</span>
              </div>
              <p className="text-xs text-gray-300 italic">"{item.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP FORM */}
      <section id="rsvp" className="py-20 px-4 bg-[#1E1119] border-t border-[#E29578]/30 scroll-mt-20">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-[#E29578] font-bold block mb-1">
            {language === "es" ? "CONFIRMA TU ASISTENCIA" : "CONFIRM YOUR ATTENDANCE"}
          </span>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            {language === "es" ? "Pases e Invitaciones (RSVP)" : "RSVP & Passes"}
          </h2>
          <p className="text-xs text-gray-300 mb-8">{language === "es" ? "Por favor confirma tu presencia antes del 5 de Septiembre." : "Please confirm by September 5."}</p>

          {rsvpSubmitted ? (
            <div className="bg-[#120B10] border border-[#E29578] p-8 rounded-3xl">
              <CheckCircle2 className="w-12 h-12 text-[#E29578] mx-auto mb-3" />
              <h3 className="font-bold text-xl text-white mb-1">{language === "es" ? "¡Gracias por Confirmar!" : "Thank You!"}</h3>
              <p className="text-xs text-gray-300">{language === "es" ? "Hemos registrado tu respuesta y te contactaremos por WhatsApp con tus pases digitales." : "We received your RSVP via WhatsApp!"}</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="bg-[#120B10] p-6 sm:p-8 rounded-3xl border border-[#E29578]/30 text-left space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">{language === "es" ? "Nombre Completo del Invitado *" : "Full Guest Name *"}</label>
                <input
                  type="text"
                  required
                  value={rsvpData.fullName}
                  onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                  placeholder="Ej. Familia Gómez Rivas"
                  className="w-full bg-[#1E1119] border border-[#E29578]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#E29578]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">{language === "es" ? "Asistencia" : "Attendance"}</label>
                  <select
                    value={rsvpData.attendance}
                    onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                    className="w-full bg-[#1E1119] border border-[#E29578]/30 rounded-xl p-3 text-sm text-white focus:outline-none"
                  >
                    <option value="Confirmado">{language === "es" ? "✅ Sí, asistiré con gusto" : "✅ Yes, I will attend"}</option>
                    <option value="No podré asistir">{language === "es" ? "❌ Lamentablemente no podré asistir" : "❌ Regretfully cannot attend"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">{language === "es" ? "Pases Asignados" : "Guest Passes"}</label>
                  <select
                    value={rsvpData.guestCount}
                    onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                    className="w-full bg-[#1E1119] border border-[#E29578]/30 rounded-xl p-3 text-sm text-white focus:outline-none"
                  >
                    <option value={1}>{language === "es" ? "1 Pase Individual" : "1 Individual Pass"}</option>
                    <option value={2}>{language === "es" ? "2 Pases (Acompañante)" : "2 Passes (+1 Guest)"}</option>
                    <option value={3}>{language === "es" ? "3 Pases" : "3 Passes"}</option>
                    <option value={4}>{language === "es" ? "4 Pases Familiares" : "4 Family Passes"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">{language === "es" ? "¿Qué canción te hará bailar toda la noche?" : "What song will get you on the dance floor?"}</label>
                <input
                  type="text"
                  value={rsvpData.songRequest || ""}
                  onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })}
                  placeholder="Ej. Tití Me Preguntó / Pepas / Bailando"
                  className="w-full bg-[#1E1119] border border-[#E29578]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#E29578]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E29578] text-[#120B10] font-bold text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFCAD4] transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
                {language === "es" ? "Confirmar Pase en WhatsApp" : "Confirm Pass via WhatsApp"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* WATERMARK FOOTER */}
      <footer className="bg-[#0B0709] py-8 text-center border-t border-[#E29578]/20">
        <a
          href={createDemoWatermarkWhatsAppUrl("Mis 15 Años Valeria")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#E29578] hover:underline"
        >
          ◆ {language === "es" ? "Diseñado por Invifty — Solicitud de invitaciones digitales para eventos" : "Designed by Invifty — Digital Event Invitations"}
        </a>
      </footer>

    </div>
  );
}
