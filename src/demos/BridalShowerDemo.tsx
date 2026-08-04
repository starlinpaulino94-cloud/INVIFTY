import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  Copy,
  Gift,
  Heart,
  MapPin,
  Martini,
  Music,
  Navigation,
  Quote,
  Send,
  Sparkles,
  Wine,
} from "lucide-react";
import DemoMusicToggle from "../components/common/DemoMusicToggle";
import DemoRsvpNotice from "../components/common/DemoRsvpNotice";
import Reveal from "../components/common/Reveal";
import {
  DemoCountdown,
  DemoDivider,
  DemoGallery,
  DemoPalette,
  DemoSectionTitle,
  DemoSubNav,
  DemoTopBar,
} from "../components/demo/DemoKit";
import { useLanguage } from "../context/LanguageContext";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface BridalShowerDemoProps {
  onBackToHome: () => void;
}

/* Fiesta blanca: blanco hueso, negro tinta y bronce cálido. */
const INK = "#141414";
const PAPER = "#FAF7F2";
const PAPER_SOFT = "#F1EAE0";
const BRONZE = "#9E783B";
const BRONZE_LIGHT = "#C6A05C";

const PALETTE: DemoPalette = { accent: BRONZE, onAccent: "#FFFFFF", bar: INK };

const HERO =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1600";

const GALLERY = [
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=900",
];

export default function BridalShowerDemo({ onBackToHome }: BridalShowerDemoProps) {
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);
  useSectionReveal();

  const targetDate = new Date("2026-10-24T17:00:00").getTime();

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedGift, setCopiedGift] = useState(false);

  const [wishes, setWishes] = useState([
    { id: "1", name: "Camila R.", text: "¡Qué ganas de celebrarte, Isa! Prepárate porque traigo el mejor regalo.", date: lx("Hace 3 horas", "3 hours ago") },
    { id: "2", name: "Tía Marisol", text: "De niña jugabas a casarte con el velo de la abuela. Y aquí estamos.", date: lx("Ayer", "Yesterday") },
    { id: "3", name: "Las del gimnasio", text: "Vamos todas de blanco y con la copa lista. No faltamos ni una.", date: lx("Hace 2 días", "2 days ago") },
  ]);
  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: lx("Brunch & tapas", "Brunch & tapas"),
    dietaryNotes: "",
    songRequest: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

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
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
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
    window.open(createRsvpWhatsAppUrl("Bridal Shower Isabella", rsvpData), "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const handleAddWish = (e: FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishText.trim()) return;
    setWishes([{ id: String(Date.now()), name: wishName.trim(), text: wishText.trim(), date: lx("Justo ahora", "Just now") }, ...wishes]);
    setWishName("");
    setWishText("");
    setWishPublished(true);
    setTimeout(() => setWishPublished(false), 4000);
  };

  const copyGift = () => {
    navigator.clipboard?.writeText("Banco Popular · 812-44907-3 · Isabella Guzmán");
    setCopiedGift(true);
    setTimeout(() => setCopiedGift(false), 2500);
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261024T210000Z",
      "DTEND:20261025T010000Z",
      "SUMMARY:Bridal Shower de Isabella",
      "LOCATION:Punta Cana Resort & Club",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bridal-shower-isabella.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const programme = [
    { time: "5:00 PM", icon: Martini, es: "Recepción con espumoso", en: "Sparkling reception", d_es: "Bienvenida en la terraza frente al mar.", d_en: "Welcome on the oceanfront terrace." },
    { time: "5:45 PM", icon: Heart, es: "Juegos entre amigas", en: "Games with the girls", d_es: "«¿Quién conoce mejor a la novia?» y algún reto.", d_en: "'Who knows the bride best?' and a dare or two." },
    { time: "6:30 PM", icon: Gift, es: "Apertura de regalos", en: "Gift opening", d_es: "El momento de las lágrimas y las fotos.", d_en: "The moment for tears and photos." },
    { time: "7:15 PM", icon: Wine, es: "Brunch & tapas", en: "Brunch & tapas", d_es: "Estaciones de comida y barra de mimosas.", d_en: "Food stations and a mimosa bar." },
    { time: "8:30 PM", icon: Music, es: "Baile hasta el final", en: "Dancing till the end", d_es: "DJ en vivo y pista abierta.", d_en: "Live DJ and open dance floor." },
  ];

  const palette = [
    { n: lx("Blanco", "White"), c: "#FFFFFF" },
    { n: lx("Hueso", "Ivory"), c: PAPER_SOFT },
    { n: lx("Bronce", "Bronze"), c: BRONZE },
    { n: lx("Tinta", "Ink"), c: INK },
  ];

  const field = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const fieldStyle = { background: "#FFFFFF", border: `1px solid ${BRONZE}44`, color: INK };

  const navItems = [
    { id: "fiesta", label: lx("Fiesta Blanca", "White Party") },
    { id: "programa", label: lx("Programa", "Programme") },
    { id: "vestimenta", label: lx("Dress Code", "Dress Code") },
    { id: "lugar", label: lx("Ubicación", "Venue") },
    { id: "galeria", label: lx("Galería", "Gallery") },
    { id: "regalos", label: lx("Regalos", "Gifts") },
    { id: "muro", label: lx("Muro", "Wall") },
  ];

  return (
    <div className="min-h-screen font-sans relative" style={{ background: PAPER, color: INK }}>
      <div className="fixed bottom-6 left-6 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <DemoMusicToggle
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          isEs={isEs}
          labelOn={lx("Sonando", "Playing")}
          labelOff={lx("Reproducir música", "Play music")}
          className={`p-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
            isPlayingMusic ? "text-white" : "hover:opacity-80"
          }`}
        />
      </div>

      <DemoTopBar onBackToHome={onBackToHome} sampleName="Bridal Shower Isabella" isEs={isEs} setLanguage={setLanguage} palette={PALETTE} />
      <DemoSubNav
        items={navItems}
        ctaId="rsvp"
        ctaLabel="RSVP"
        onNavigate={scrollToSection}
        palette={PALETTE}
        background={`${PAPER}F2`}
        ariaLabel={lx("Secciones de la invitación", "Invitation sections")}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <header id="fiesta" className="relative min-h-[92vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.35 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${PAPER}D9, ${PAPER}CC 45%, ${PAPER})` }} />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase mb-7 border"
              style={{ color: BRONZE, borderColor: `${BRONZE}66`, background: "#FFFFFFCC" }}
            >
              <Wine className="w-3.5 h-3.5" aria-hidden="true" />
              {lx("Fiesta Blanca · Bridal Shower", "White Party · Bridal Shower")}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-serif text-6xl sm:text-8xl font-light mb-4 leading-[1.05]" style={{ color: INK }}>
              Isabella
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <DemoDivider accent={BRONZE} />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] font-semibold my-6" style={{ color: BRONZE }}>
              {lx("Sábado 24 de Octubre, 2026 · 5:00 PM", "Saturday, October 24, 2026 · 5:00 PM")}
              <span className="block mt-2 opacity-60 tracking-[0.2em]">Punta Cana Resort &amp; Club</span>
            </p>
          </Reveal>

          <Reveal delay={280}>
            <p className="font-serif text-lg sm:text-2xl font-light italic max-w-xl mx-auto mb-10 leading-relaxed opacity-80">
              {lx(
                "«Un brindar de copas y alegría antes del gran sí.»",
                "«A toast of glasses and joy before the big yes.»"
              )}
            </p>
          </Reveal>

          <Reveal delay={360}>
            <DemoCountdown
              target={targetDate}
              accent={BRONZE}
              cell="#FFFFFFCC"
              labels={{ days: lx("Días", "Days"), hours: lx("Horas", "Hours"), minutes: lx("Min", "Min"), seconds: lx("Seg", "Sec") }}
            />
          </Reveal>

          <Reveal delay={440}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => scrollToSection("rsvp")}
                className="px-8 py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: INK }}
              >
                {lx("Confirmar asistencia", "Confirm attendance")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={addToCalendar}
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white"
                style={{ borderColor: BRONZE, color: BRONZE }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Guardar la fecha", "Save the date")}
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ----------------------------------------------------------- PROGRAMA */}
      <section id="programa" className="py-24 px-5" style={{ background: PAPER_SOFT }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("La tarde", "The afternoon")}
              title={lx("Programa de la celebración", "Celebration programme")}
              accent={BRONZE}
              titleColor={INK}
            />
          </Reveal>

          <ol className="space-y-4">
            {programme.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: `${BRONZE}33` }}>
                    <div className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center" style={{ borderColor: `${BRONZE}66`, background: `${BRONZE}0F` }}>
                      <item.icon className="w-5 h-5" style={{ color: BRONZE }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: BRONZE }}>
                        {item.time}
                      </span>
                      <h3 className="font-serif text-xl mb-1" style={{ color: INK }}>
                        {lx(item.es, item.en)}
                      </h3>
                      <p className="text-xs opacity-65 leading-relaxed">{lx(item.d_es, item.d_en)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------- VESTIMENTA + LUGAR */}
      <section id="vestimenta" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Cómo vestir", "What to wear")}
              title={lx("Todas de blanco", "Everyone in white")}
              accent={BRONZE}
              titleColor={INK}
              subtitle={lx(
                "La novia pidió una sola cosa: que la tarde se vea como una foto. Blanco, hueso o marfil; los accesorios en bronce.",
                "The bride asked for one thing: that the afternoon looks like a photograph. White, ivory or bone; accessories in bronze."
              )}
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="flex items-center justify-center gap-5 mb-14">
              {palette.map((c) => (
                <div key={c.n} className="text-center">
                  <span className="block w-14 h-14 rounded-full border-2 mb-2 shadow-sm" style={{ background: c.c, borderColor: `${BRONZE}55` }} aria-hidden="true" />
                  <span className="text-[9px] uppercase tracking-wider opacity-60">{c.n}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div id="lugar" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${BRONZE}33` }}>
                <iframe
                  title={lx("Mapa de Punta Cana Resort & Club", "Map of Punta Cana Resort & Club")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d-68.4!3d18.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPunta%20Cana%20Resort%20%26%20Club!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="p-7 rounded-3xl border bg-white h-full flex flex-col justify-center" style={{ borderColor: `${BRONZE}33` }}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: BRONZE }}>
                  <MapPin className="w-4 h-4" aria-hidden="true" /> {lx("Lugar", "Venue")}
                </div>
                <h3 className="font-serif text-2xl mb-1.5" style={{ color: INK }}>
                  Punta Cana Resort &amp; Club
                </h3>
                <p className="text-sm opacity-65 mb-6">{lx("Terraza Playa Blanca · Punta Cana", "Playa Blanca Terrace · Punta Cana")}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Punta+Cana+Resort+and+Club"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-5 py-3.5 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                    style={{ background: INK }}
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" /> Google Maps
                  </a>
                  <a
                    href="https://waze.com/ul?q=Punta%20Cana%20Resort%20and%20Club"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-5 py-3.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-[#F1EAE0] transition-colors"
                    style={{ borderColor: BRONZE, color: BRONZE }}
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ GALERÍA */}
      <section id="galeria" className="py-24 px-5" style={{ background: PAPER_SOFT }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Recuerdos", "Memories")}
              title={lx("Antes del gran sí", "Before the big yes")}
              accent={BRONZE}
              titleColor={INK}
            />
          </Reveal>
          <Reveal delay={80}>
            <DemoGallery images={GALLERY} accent={BRONZE} isEs={isEs} columnsClassName="grid-cols-2 md:grid-cols-4" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- REGALOS */}
      <section id="regalos" className="py-24 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Un detalle", "A gift")}
              title={lx("Mesa de regalos", "Gift registry")}
              accent={BRONZE}
              titleColor={INK}
              subtitle={lx(
                "Lo único imprescindible es que vengas. Si además quieres tener un detalle, aquí tienes los datos.",
                "The only essential thing is that you come. If you'd also like to give something, here are the details."
              )}
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-8 rounded-3xl border bg-white" style={{ borderColor: `${BRONZE}33` }}>
              <Gift className="w-9 h-9 mx-auto mb-4" style={{ color: BRONZE }} aria-hidden="true" />
              <p className="text-sm opacity-70 mb-6">{lx("Banco Popular · Cuenta de ahorros", "Banco Popular · Savings account")}</p>
              <button
                onClick={copyGift}
                className="px-7 py-3.5 border text-[11px] font-semibold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] transition-colors hover:bg-[#F1EAE0]"
                style={{ borderColor: BRONZE, color: copiedGift ? BRONZE_LIGHT : BRONZE }}
              >
                {copiedGift ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                {copiedGift ? lx("¡Copiado!", "Copied!") : lx("Copiar datos bancarios", "Copy bank details")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- MURO */}
      <section id="muro" className="py-24 px-5" style={{ background: PAPER_SOFT }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Para Isabella", "For Isabella")}
              title={lx("Muro de la novia", "Bride's wall")}
              accent={BRONZE}
              titleColor={INK}
            />
          </Reveal>

          <Reveal>
            <form onSubmit={handleAddWish} className="p-6 sm:p-8 rounded-3xl border bg-white mb-8 space-y-4" style={{ borderColor: `${BRONZE}33` }}>
              <div>
                <label htmlFor="bridal-nombre" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu nombre", "Your name")}
                </label>
                <input id="bridal-nombre" type="text" value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder={lx("Ej. Camila", "E.g. Camila")} className={field} style={fieldStyle} />
              </div>
              <div>
                <label htmlFor="bridal-mensaje" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu mensaje", "Your message")}
                </label>
                <textarea id="bridal-mensaje" rows={3} value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder={lx("Escribe unas palabras para Isabella...", "Write a few words for Isabella...")} className={`${field} resize-none`} style={fieldStyle} />
              </div>
              <button type="submit" className="w-full py-3.5 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]" style={{ background: INK }}>
                <Send className="w-4 h-4" aria-hidden="true" /> {lx("Publicar mensaje", "Post message")}
              </button>
              {wishPublished && (
                <p role="status" aria-live="polite" className="text-xs text-center" style={{ color: BRONZE }}>
                  {lx(
                    "Tu mensaje aparece abajo. En una invitación real quedaría guardado para la novia.",
                    "Your message appears below. In a real invitation it would be saved for the bride."
                  )}
                </p>
              )}
            </form>
          </Reveal>

          <div className="space-y-4">
            {wishes.map((w, idx) => (
              <Reveal key={w.id} delay={idx * 60}>
                <article className="p-6 rounded-2xl border bg-white relative" style={{ borderColor: `${BRONZE}26` }}>
                  <Quote className="w-7 h-7 absolute top-5 right-5" style={{ color: `${BRONZE}33` }} aria-hidden="true" />
                  <p className="font-serif text-base sm:text-lg italic leading-relaxed mb-4 pr-8" style={{ color: INK }}>
                    “{w.text}”
                  </p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                    <span className="font-semibold" style={{ color: BRONZE }}>
                      {w.name}
                    </span>
                    <span className="opacity-45">{w.date}</span>
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
            <DemoSectionTitle
              eyebrow={lx("Te esperamos", "We're expecting you")}
              title={lx("Confirma tu lugar", "Confirm your place")}
              accent={BRONZE}
              titleColor={INK}
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2 shadow-xl bg-white" style={{ borderColor: INK }}>
              <p className="text-xs opacity-60 text-center mb-7">
                {lx("Agradecemos confirmar antes del 10 de octubre", "Please confirm before October 10")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="bridal-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input id="bridal-name" type="text" required value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} placeholder={lx("Ej. Camila Rivas", "E.g. Camila Rivas")} className={field} style={fieldStyle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="bridal-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select id="bridal-attendance" value={rsvpData.attendance} onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })} className={field} style={fieldStyle}>
                      <option value="Confirmado">{lx("¡Ahí estaré!", "I'll be there!")}</option>
                      <option value="Declina">{lx("No podré asistir", "I can't make it")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bridal-guests" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                      {lx("Nº de personas", "Number of guests")}
                    </label>
                    <select id="bridal-guests" value={rsvpData.guestCount} onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })} className={field} style={fieldStyle}>
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="bridal-menu" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Preferencia de menú", "Menu preference")}
                  </label>
                  <select id="bridal-menu" value={rsvpData.menuPreference} onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })} className={field} style={fieldStyle}>
                    <option>{lx("Brunch & tapas", "Brunch & tapas")}</option>
                    <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                    <option>{lx("Opción sin gluten", "Gluten-free option")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bridal-notes" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Alergias o notas (opcional)", "Allergies or notes (optional)")}
                  </label>
                  <input id="bridal-notes" type="text" value={rsvpData.dietaryNotes} onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })} placeholder={lx("Ej. Sin lactosa", "E.g. Lactose free")} className={field} style={fieldStyle} />
                </div>

                <div>
                  <label htmlFor="bridal-song" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Pide una canción (opcional)", "Request a song (optional)")}
                  </label>
                  <input id="bridal-song" type="text" value={rsvpData.songRequest} onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })} placeholder={lx("Ej. Shakira — Hips Don't Lie", "E.g. Shakira — Hips Don't Lie")} className={field} style={fieldStyle} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: INK }}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {lx("Enviar confirmación por WhatsApp", "Send confirmation via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && <DemoRsvpNotice isEs={isEs} tone="light" />}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-xs opacity-50 mt-10 inline-flex items-center gap-2 justify-center w-full">
              <Sparkles className="w-3.5 h-3.5" style={{ color: BRONZE }} aria-hidden="true" />
              {lx("Con cariño, las damas de honor", "With love, the bridesmaids")}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
