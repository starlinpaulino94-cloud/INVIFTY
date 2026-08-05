import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Disc3,
  Martini,
  MessageCircle,
  Mic2,
  Navigation,
  Quote,
  Send,
  Shirt,
  Sparkles,
} from "lucide-react";
import DemoMusicToggle from "../components/common/DemoMusicToggle";
import DemoRsvpNotice from "../components/common/DemoRsvpNotice";
import Reveal from "../components/common/Reveal";
import {
  DemoCountdown,
  DemoGallery,
  DemoPalette,
  DemoSubNav,
  DemoTopBar,
} from "../components/demo/DemoKit";
import { useLanguage } from "../context/LanguageContext";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface NeonPartyDemoProps {
  onBackToHome: () => void;
}

/**
 * MUESTRA — CUMPLEAÑOS NEÓN "MARCOS 40"
 * =====================================
 * Estilo neón social: negro profundo, magenta y cian con brillo eléctrico.
 * Datos ficticios.
 *
 * El brillo (`textShadow`) es lo que da carácter a esta muestra, así que se
 * conserva tal cual y no se sustituye por los tokens del sitio comercial.
 */
const BLACK = "#050505";
const SURFACE = "#0E0E0E";
const MAGENTA = "#FF2D95";
const CYAN = "#22D3EE";

const PALETTE: DemoPalette = { accent: MAGENTA, onAccent: "#FFFFFF", bar: "#0A0A0A" };

const glowMagenta = { textShadow: `0 0 12px ${MAGENTA}99, 0 0 40px ${MAGENTA}55` };
const glowCyan = { textShadow: `0 0 12px ${CYAN}99, 0 0 40px ${CYAN}55` };

const HERO =
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1600";

const GALLERY = [
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=900",
];

/** Título de sección con el brillo de neón característico. */
function NeonTitle({ children, color }: { children: string; color: string }) {
  return (
    <h2
      className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-center mb-10"
      style={{ color, ...(color === MAGENTA ? glowMagenta : glowCyan) }}
    >
      {children}
    </h2>
  );
}

export default function NeonPartyDemo({ onBackToHome }: NeonPartyDemoProps) {
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);
  useSectionReveal();

  const targetDate = new Date("2026-09-05T21:00:00").getTime();

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const [wishes, setWishes] = useState([
    { id: "1", name: "Los del 2005", text: "Cuarenta y sigues siendo el que cierra la pista. Ahí estaremos.", date: lx("Hace 5 horas", "5 hours ago") },
    { id: "2", name: "Karla M.", text: "Ya tengo el outfit negro y los tenis blancos listos. ¡Que empiece!", date: lx("Ayer", "Yesterday") },
  ]);
  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: lx("Open bar y picadera", "Open bar & finger food"),
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
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
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
    window.open(createRsvpWhatsAppUrl("Neon Party Marcos 40", rsvpData), "_blank", "noopener,noreferrer");
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

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20260906T010000Z",
      "DTEND:20260906T070000Z",
      "SUMMARY:Neon Party — Marcos 40",
      "LOCATION:Torre Alto Naco, Piso 27, Santo Domingo",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "neon-party-marcos-40.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const lineup = [
    { icon: Martini, time: "9:00 PM", es: "Open bar y bienvenida", en: "Open bar & welcome", d_es: "Cócteles de autor en la terraza del piso 27.", d_en: "Signature cocktails on the 27th-floor terrace." },
    { icon: Disc3, time: "10:00 PM", es: "DJ set — clásicos de los 2000", en: "DJ set — 2000s classics", d_es: "De reggaetón viejo a house, sin pausa.", d_en: "From old-school reggaetón to house, non-stop." },
    { icon: Mic2, time: "12:00 AM", es: "Karaoke y brindis de medianoche", en: "Karaoke & midnight toast", d_es: "Micrófono abierto y pastel con luces.", d_en: "Open mic and a cake with sparklers." },
    { icon: Sparkles, time: "2:00 AM", es: "After en la azotea", en: "Rooftop after-party", d_es: "Para los que aguanten hasta el amanecer.", d_en: "For those who last until sunrise." },
  ];

  const field =
    "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const fieldStyle = { background: BLACK, border: `1px solid ${MAGENTA}44` };

  const navItems = [
    { id: "fiesta", label: lx("La Fiesta", "The Party") },
    { id: "lineup", label: lx("Line-up", "Line-up") },
    { id: "codigo", label: lx("Dress Code", "Dress Code") },
    { id: "lugar", label: lx("El Lugar", "The Venue") },
    { id: "galeria", label: lx("Galería", "Gallery") },
    { id: "muro", label: lx("Muro", "Wall") },
  ];

  return (
    <div className="min-h-screen font-sans relative" style={{ background: BLACK, color: "#EAEAEA" }}>
      <div className="fixed bottom-6 left-6 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <DemoMusicToggle
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          isEs={isEs}
          labelOn={lx("Sonando", "Playing")}
          labelOff={lx("Poner música", "Play music")}
          className="p-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 border"
        />
      </div>

      <DemoTopBar onBackToHome={onBackToHome} sampleName="Neon Party Marcos 40" isEs={isEs} setLanguage={setLanguage} palette={PALETTE} />
      <DemoSubNav
        items={navItems}
        ctaId="rsvp"
        ctaLabel="RSVP"
        onNavigate={scrollToSection}
        palette={PALETTE}
        background={`${SURFACE}E6`}
        ariaLabel={lx("Secciones de la invitación", "Invitation sections")}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <header id="fiesta" className="relative min-h-[94vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.3 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BLACK}E6, ${BLACK}B3 45%, ${BLACK})` }} />
          <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none" style={{ background: `${MAGENTA}26` }} />
          <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none" style={{ background: `${CYAN}1F` }} />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6" style={{ color: CYAN, ...glowCyan }}>
              {lx("No es una fiesta más", "Not just another party")}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-sans text-7xl sm:text-9xl font-black leading-none mb-2" style={{ color: MAGENTA, ...glowMagenta }}>
              40
            </h1>
            <p className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-[0.15em] text-white mb-6">Marcos</p>
          </Reveal>

          <Reveal delay={220}>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-bold mb-8" style={{ color: CYAN }}>
              {lx("Sábado 5 de Septiembre, 2026 · 9:00 PM", "Saturday, September 5, 2026 · 9:00 PM")}
              <span className="block mt-2 text-white/45 tracking-[0.2em] font-medium">Sky Lounge 27 · Naco</span>
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              {lx(
                "Cuatro décadas se celebran con luces, música alta y la gente correcta. Trae los tenis cómodos.",
                "Four decades deserve lights, loud music and the right people. Bring comfortable shoes."
              )}
            </p>
          </Reveal>

          <Reveal delay={380}>
            <DemoCountdown
              target={targetDate}
              accent={MAGENTA}
              cell={`${SURFACE}CC`}
              numberClassName="font-sans text-3xl sm:text-4xl font-black"
              labels={{ days: lx("Días", "Days"), hours: lx("Horas", "Hours"), minutes: lx("Min", "Min"), seconds: lx("Seg", "Sec") }}
            />
          </Reveal>

          <Reveal delay={460}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => scrollToSection("rsvp")}
                className="px-8 py-4 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: MAGENTA, boxShadow: `0 0 30px ${MAGENTA}66` }}
              >
                {lx("Confirmar asistencia", "Confirm attendance")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={addToCalendar}
                className="px-8 py-4 border font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white/5"
                style={{ borderColor: CYAN, color: CYAN }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Guardar la fecha", "Save the date")}
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* -------------------------------------------------------------- LINEUP */}
      <section id="lineup" className="py-24 px-5" style={{ background: SURFACE }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <NeonTitle color={CYAN}>{lx("El plan de la noche", "The night's line-up")}</NeonTitle>
          </Reveal>

          <ol className="space-y-4">
            {lineup.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 80}>
                  <div className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border" style={{ background: BLACK, borderColor: `${MAGENTA}33` }}>
                    <div className="w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center" style={{ borderColor: `${CYAN}55`, background: `${CYAN}0F` }}>
                      <item.icon className="w-5 h-5" style={{ color: CYAN }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-black block mb-1" style={{ color: MAGENTA }}>
                        {item.time}
                      </span>
                      <h3 className="font-sans text-lg font-bold uppercase text-white mb-1">{lx(item.es, item.en)}</h3>
                      <p className="text-xs text-white/55 leading-relaxed">{lx(item.d_es, item.d_en)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------------- CÓDIGO */}
      <section id="codigo" className="py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <NeonTitle color={MAGENTA}>{lx("Negro total + un toque neón", "All black + a neon touch")}</NeonTitle>
          </Reveal>

          <Reveal delay={100}>
            <Shirt className="w-10 h-10 mx-auto mb-6" style={{ color: CYAN }} aria-hidden="true" />
            <p className="text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              {lx(
                "Vístete de negro de pies a cabeza y añade un accesorio en magenta o cian. Las luces harán el resto.",
                "Dress head to toe in black and add one magenta or cyan accessory. The lights will do the rest."
              )}
            </p>

            <div className="flex items-center justify-center gap-5">
              {[
                { n: lx("Negro", "Black"), c: "#000000" },
                { n: "Magenta", c: MAGENTA },
                { n: lx("Cian", "Cyan"), c: CYAN },
                { n: lx("Plata", "Silver"), c: "#C8C8C8" },
              ].map((c) => (
                <div key={c.n} className="text-center">
                  <span
                    className="block w-14 h-14 rounded-full border-2 mb-2"
                    style={{ background: c.c, borderColor: "rgba(255,255,255,0.25)", boxShadow: c.c === MAGENTA || c.c === CYAN ? `0 0 20px ${c.c}77` : undefined }}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] uppercase tracking-wider text-white/50">{c.n}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- LUGAR */}
      <section id="lugar" className="py-24 px-5" style={{ background: SURFACE }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <NeonTitle color={CYAN}>{lx("El lugar", "The venue")}</NeonTitle>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${MAGENTA}33` }}>
                <iframe
                  title={lx("Mapa de Sky Lounge 27", "Map of Sky Lounge 27")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.6!2d-69.93!3d18.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNaco%2C%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="p-8 rounded-3xl border h-full flex flex-col justify-center" style={{ background: BLACK, borderColor: `${CYAN}33` }}>
                <h3 className="font-sans text-2xl font-black uppercase text-white mb-2">Sky Lounge 27</h3>
                <p className="text-sm text-white/55 mb-8">{lx("Torre Alto Naco, Piso 27 · Santo Domingo", "Torre Alto Naco, 27th Floor · Santo Domingo")}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Naco+Santo+Domingo"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-5 py-3.5 text-white text-[11px] font-black uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                    style={{ background: MAGENTA }}
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" /> Maps
                  </a>
                  <a
                    href="https://waze.com/ul?q=Naco%20Santo%20Domingo"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-5 py-3.5 border text-[11px] font-black uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-white/5 transition-colors"
                    style={{ borderColor: CYAN, color: CYAN }}
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- GALERÍA */}
      <section id="galeria" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <NeonTitle color={MAGENTA}>{lx("Ediciones anteriores", "Previous editions")}</NeonTitle>
          </Reveal>
          <Reveal delay={80}>
            <DemoGallery images={GALLERY} accent={MAGENTA} isEs={isEs} columnsClassName="grid-cols-2 md:grid-cols-4" />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- MURO */}
      <section id="muro" className="py-24 px-5" style={{ background: SURFACE }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <NeonTitle color={CYAN}>{lx("Muro de la fiesta", "Party wall")}</NeonTitle>
          </Reveal>

          <Reveal>
            <form onSubmit={handleAddWish} className="p-6 sm:p-8 rounded-3xl border mb-8 space-y-4" style={{ background: BLACK, borderColor: `${MAGENTA}33` }}>
              <div>
                <label htmlFor="neon-nombre" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                  {lx("Tu nombre", "Your name")}
                </label>
                <input id="neon-nombre" type="text" value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder={lx("Ej. Karla", "E.g. Karla")} className={field} style={fieldStyle} />
              </div>
              <div>
                <label htmlFor="neon-mensaje" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                  {lx("Tu mensaje", "Your message")}
                </label>
                <textarea id="neon-mensaje" rows={3} value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder={lx("Escribe algo para Marcos...", "Write something for Marcos...")} className={`${field} resize-none`} style={fieldStyle} />
              </div>
              <button type="submit" className="w-full py-3.5 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]" style={{ background: MAGENTA }}>
                <Send className="w-4 h-4" aria-hidden="true" /> {lx("Publicar mensaje", "Post message")}
              </button>
              {wishPublished && (
                <p role="status" aria-live="polite" className="text-xs text-center" style={{ color: CYAN }}>
                  {lx(
                    "Tu mensaje aparece abajo. En una invitación real quedaría guardado para el anfitrión.",
                    "Your message appears below. In a real invitation it would be saved for the host."
                  )}
                </p>
              )}
            </form>
          </Reveal>

          <div className="space-y-4">
            {wishes.map((w, idx) => (
              <Reveal key={w.id} delay={idx * 60}>
                <article className="p-6 rounded-2xl border relative" style={{ background: BLACK, borderColor: `${CYAN}26` }}>
                  <Quote className="w-7 h-7 absolute top-5 right-5" style={{ color: `${CYAN}33` }} aria-hidden="true" />
                  <p className="text-base text-white/85 leading-relaxed mb-4 pr-8">“{w.text}”</p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                    <span className="font-black" style={{ color: MAGENTA }}>
                      {w.name}
                    </span>
                    <span className="text-white/40">{w.date}</span>
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
            <NeonTitle color={MAGENTA}>{lx("Confirma tu entrada", "Confirm your spot")}</NeonTitle>
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2" style={{ background: SURFACE, borderColor: MAGENTA, boxShadow: `0 0 40px ${MAGENTA}22` }}>
              <p className="text-xs text-white/55 text-center mb-7">
                {lx("Cupo limitado. Confirma antes del 25 de agosto.", "Limited capacity. Confirm before August 25.")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="neon-name" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input id="neon-name" type="text" required value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} placeholder={lx("Ej. Karla Méndez", "E.g. Karla Méndez")} className={field} style={fieldStyle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="neon-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select id="neon-attendance" value={rsvpData.attendance} onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })} className={field} style={fieldStyle}>
                      <option value="Confirmado">{lx("¡Ahí estaré!", "I'll be there!")}</option>
                      <option value="Declina">{lx("No podré ir", "I can't make it")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="neon-guests" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                      {lx("Nº de personas", "Number of guests")}
                    </label>
                    <select id="neon-guests" value={rsvpData.guestCount} onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })} className={field} style={fieldStyle}>
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="neon-menu" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                    {lx("Preferencia de barra", "Bar preference")}
                  </label>
                  <select id="neon-menu" value={rsvpData.menuPreference} onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })} className={field} style={fieldStyle}>
                    <option>{lx("Open bar y picadera", "Open bar & finger food")}</option>
                    <option>{lx("Sin alcohol", "Alcohol-free")}</option>
                    <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="neon-song" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">
                    {lx("¿Qué canción no puede faltar?", "Which song is a must?")}
                  </label>
                  <input id="neon-song" type="text" value={rsvpData.songRequest} onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })} placeholder={lx("Ej. Daddy Yankee — Gasolina", "E.g. Daddy Yankee — Gasolina")} className={field} style={fieldStyle} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: MAGENTA, boxShadow: `0 0 30px ${MAGENTA}55` }}
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {lx("Enviar confirmación por WhatsApp", "Send confirmation via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && <DemoRsvpNotice isEs={isEs} tone="dark" />}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
