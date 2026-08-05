import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Coffee,
  Mic,
  Navigation,
  Presentation,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import Reveal from "../components/common/Reveal";
import {
  DemoCountdown,
  DemoGallery,
  DemoPalette,
  DemoSectionTitle,
  DemoSubNav,
  DemoTopBar,
} from "../components/demo/DemoKit";
import VipPassModal from "../components/VipPassModal";
import { useLanguage } from "../context/LanguageContext";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface AuroraSummitDemoProps {
  onBackToHome: () => void;
}

/**
 * MUESTRA — SUMMIT CORPORATIVO "AURORA 2027"
 * ==========================================
 * Minimal corporativo claro: fondo casi blanco, tinta oscura y acento de marca.
 * Es la muestra que enseña que Invifty también sirve para un evento
 * profesional, no sólo para celebraciones. Datos ficticios.
 */
const PAPER = "#FAFAFA";
const PAPER_SOFT = "#F1F3F9";
const INK = "#101828";
const GREY = "#475467";
const BRAND = "#3B4FE0";
const TEAL = "#2BB3A3";

const PALETTE: DemoPalette = { accent: BRAND, onAccent: "#FFFFFF", bar: INK };

const HERO =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600";

const GALLERY = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=900",
];

export default function AuroraSummitDemo({ onBackToHome }: AuroraSummitDemoProps) {
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);
  useSectionReveal();

  const targetDate = new Date("2027-03-18T09:00:00").getTime();

  const [showPass, setShowPass] = useState(false);
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: lx("Almuerzo estándar", "Standard lunch"),
    dietaryNotes: "",
    songRequest: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [track, setTrack] = useState(lx("Innovación", "Innovation"));
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const payload: RsvpFormData = {
      ...rsvpData,
      dietaryNotes: [
        `${lx("Empresa", "Company")}: ${companyName || "—"}`,
        `${lx("Cargo", "Role")}: ${roleTitle || "—"}`,
        `${lx("Track", "Track")}: ${track}`,
        rsvpData.dietaryNotes ? `${lx("Notas", "Notes")}: ${rsvpData.dietaryNotes}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    };

    window.open(createRsvpWhatsAppUrl("Aurora Summit 2027", payload), "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const calendarUrl = () => {
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: "Aurora Summit 2027",
      dates: "20270318T130000Z/20270318T220000Z",
      details: "Aurora Summit 2027 — Innovación, tecnología y networking.",
      location: "Centro de Convenciones, Santo Domingo",
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };

  const agenda = [
    { time: "9:00", icon: Coffee, es: "Registro y café de bienvenida", en: "Registration & welcome coffee", d_es: "Acreditación con pase QR en la entrada.", d_en: "QR pass accreditation at the entrance." },
    { time: "9:45", icon: Mic, es: "Keynote de apertura", en: "Opening keynote", d_es: "El estado de la innovación en el Caribe.", d_en: "The state of innovation in the Caribbean." },
    { time: "11:00", icon: Presentation, es: "Tracks paralelos", en: "Parallel tracks", d_es: "Innovación, Tecnología y Negocio, en salas separadas.", d_en: "Innovation, Technology and Business, in separate rooms." },
    { time: "13:00", icon: Utensils, es: "Almuerzo y networking", en: "Lunch & networking", d_es: "Mesas temáticas por sector.", d_en: "Themed tables by industry." },
    { time: "15:00", icon: Users, es: "Panel de cierre", en: "Closing panel", d_es: "Preguntas abiertas con los ponentes.", d_en: "Open Q&A with the speakers." },
    { time: "17:00", icon: Sparkles, es: "Cóctel de despedida", en: "Farewell cocktail", d_es: "Terraza del centro de convenciones.", d_en: "Convention centre terrace." },
  ];

  const speakers = [
    { name: "Dra. Laura Peña", role_es: "Directora de Innovación", role_en: "Head of Innovation", topic_es: "Automatización con propósito", topic_en: "Automation with purpose" },
    { name: "Ing. Rafael Núñez", role_es: "CTO, Grupo Aurora", role_en: "CTO, Grupo Aurora", topic_es: "Arquitecturas que escalan en el Caribe", topic_en: "Architectures that scale in the Caribbean" },
    { name: "Lic. Sofía Herrera", role_es: "Directora de Estrategia", role_en: "Strategy Director", topic_es: "Del piloto al producto en doce meses", topic_en: "From pilot to product in twelve months" },
  ];

  const field =
    "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const fieldStyle = { background: "#FFFFFF", border: `1px solid ${INK}22`, color: INK };

  const navItems = [
    { id: "summit", label: lx("El Summit", "The Summit") },
    { id: "agenda", label: lx("Agenda", "Agenda") },
    { id: "ponentes", label: lx("Ponentes", "Speakers") },
    { id: "pase", label: lx("Pase QR", "QR Pass") },
    { id: "lugar", label: lx("Sede", "Venue") },
    { id: "ediciones", label: lx("Ediciones", "Editions") },
  ];

  return (
    <div className="min-h-screen font-sans relative" style={{ background: PAPER, color: INK }}>
      <DemoTopBar onBackToHome={onBackToHome} sampleName="Aurora Summit 2027" isEs={isEs} setLanguage={setLanguage} palette={PALETTE} />
      <DemoSubNav
        items={navItems}
        ctaId="registro"
        ctaLabel={lx("Reservar lugar", "Reserve seat")}
        onNavigate={scrollToSection}
        palette={PALETTE}
        background={`${PAPER}F2`}
        ariaLabel={lx("Secciones del evento", "Event sections")}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <header id="summit" className="relative min-h-[90vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.16 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${PAPER}F2, ${PAPER}E6 45%, ${PAPER})` }} />
          <div className="absolute -top-24 left-1/3 w-[520px] h-[320px] rounded-full blur-3xl pointer-events-none" style={{ background: `${BRAND}14` }} />
          <div className="absolute top-1/3 right-1/4 w-[420px] h-[300px] rounded-full blur-3xl pointer-events-none" style={{ background: `${TEAL}14` }} />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-6" style={{ color: GREY }}>
              Grupo Aurora {lx("presenta", "presents")}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <span className="block w-14 h-1 mx-auto mb-8 rounded-full" style={{ background: BRAND }} aria-hidden="true" />
            <h1 className="font-sans text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-3" style={{ color: INK }}>
              Aurora
              <span className="block">Summit</span>
              <span className="block font-light" style={{ color: BRAND }}>
                2027
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold my-7" style={{ color: GREY }}>
              {lx("Jueves 18 de Marzo, 2027 · 9:00 AM", "Thursday, March 18, 2027 · 9:00 AM")}
              <span className="block mt-2 opacity-70 tracking-[0.18em] font-medium">
                {lx("Centro de Convenciones · Santo Domingo", "Convention Centre · Santo Domingo")}
              </span>
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: GREY }}>
              {lx(
                "Un día dedicado a la innovación, la tecnología y el networking entre quienes están construyendo el futuro de la región.",
                "A full day devoted to innovation, technology and networking among those building the region's future."
              )}
            </p>
          </Reveal>

          <Reveal delay={380}>
            <DemoCountdown
              target={targetDate}
              accent={BRAND}
              cell="#FFFFFF"
              numberClassName="font-sans text-3xl sm:text-4xl font-black"
              labels={{ days: lx("Días", "Days"), hours: lx("Horas", "Hours"), minutes: lx("Min", "Min"), seconds: lx("Seg", "Sec") }}
            />
          </Reveal>

          <Reveal delay={460}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => scrollToSection("registro")}
                className="px-8 py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: BRAND }}
              >
                {lx("Reservar mi lugar", "Reserve my seat")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={calendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white"
                style={{ borderColor: `${INK}22`, color: INK }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Añadir al calendario", "Add to calendar")}
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* -------------------------------------------------------------- AGENDA */}
      <section id="agenda" className="py-24 px-5" style={{ background: PAPER_SOFT }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Un día completo", "A full day")}
              title={lx("Agenda del summit", "Summit agenda")}
              accent={BRAND}
              titleColor={INK}
              titleClassName="font-sans text-3xl sm:text-5xl font-black tracking-tight"
            />
          </Reveal>

          <ol className="space-y-4">
            {agenda.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${INK}14` }}>
                    <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `${BRAND}12` }}>
                      <item.icon className="w-5 h-5" style={{ color: BRAND }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold block mb-1" style={{ color: BRAND }}>
                        {item.time}
                      </span>
                      <h3 className="text-lg font-bold mb-1" style={{ color: INK }}>
                        {lx(item.es, item.en)}
                      </h3>
                      <p className="text-sm" style={{ color: GREY }}>
                        {lx(item.d_es, item.d_en)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ PONENTES */}
      <section id="ponentes" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Quiénes hablan", "Who speaks")}
              title={lx("Ponentes destacados", "Featured speakers")}
              accent={BRAND}
              titleColor={INK}
              titleClassName="font-sans text-3xl sm:text-5xl font-black tracking-tight"
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {speakers.map((sp, idx) => (
              <Reveal key={sp.name} delay={idx * 90}>
                <article className="p-7 rounded-2xl border bg-white shadow-sm h-full flex flex-col" style={{ borderColor: `${INK}14` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${TEAL}14` }}>
                    <Mic className="w-5 h-5" style={{ color: TEAL }} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold mb-1" style={{ color: INK }}>
                    {sp.name}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-4" style={{ color: BRAND }}>
                    {lx(sp.role_es, sp.role_en)}
                  </p>
                  <p className="text-sm mt-auto" style={{ color: GREY }}>
                    “{lx(sp.topic_es, sp.topic_en)}”
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- PASE */}
      <section id="pase" className="py-24 px-5" style={{ background: INK }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.45em] font-semibold block mb-3" style={{ color: TEAL }}>
                {lx("Control de acceso", "Access control")}
              </span>
              <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-white">
                {lx("Tu pase de acreditación", "Your accreditation pass")}
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" style={{ background: "#182135", borderColor: "#FFFFFF1F" }}>
              <div>
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  {lx(
                    "Cada asistente registrado recibe un código QR con su nombre, empresa y track asignado. Se escanea en el registro y evita las colas de la mañana.",
                    "Every registered attendee receives a QR code with their name, company and assigned track. It is scanned at check-in and avoids the morning queues."
                  )}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {[
                    { es: "Un código por asistente, intransferible", en: "One code per attendee, non-transferable" },
                    { es: "Track asignado visible en el pase", en: "Assigned track shown on the pass" },
                    { es: "Se guarda en el teléfono", en: "Save it to your phone" },
                  ].map((f) => (
                    <li key={f.es} className="flex items-start gap-2.5 text-sm text-white/75">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: TEAL }} aria-hidden="true" />
                      {lx(f.es, f.en)}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowPass(true)}
                  className="px-7 py-3.5 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center gap-2 min-h-[48px] transition-transform active:scale-95 text-white"
                  style={{ background: BRAND }}
                >
                  <QrCode className="w-4 h-4" aria-hidden="true" />
                  {lx("Ver pase de ejemplo", "See a sample pass")}
                </button>
              </div>

              <div className="rounded-2xl border p-7 text-center" style={{ background: INK, borderColor: "#FFFFFF1F" }}>
                <QrCode className="w-24 h-24 mx-auto mb-4" style={{ color: TEAL }} aria-hidden="true" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1" style={{ color: TEAL }}>
                  {lx("Pase de asistente", "Attendee pass")}
                </p>
                <p className="text-xs text-white/50">{lx("Track asignado · Almuerzo incluido", "Assigned track · Lunch included")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- LUGAR */}
      <section id="lugar" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Dónde", "Where")}
              title={lx("Sede del summit", "Summit venue")}
              accent={BRAND}
              titleColor={INK}
              titleClassName="font-sans text-3xl sm:text-5xl font-black tracking-tight"
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-2xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${INK}14` }}>
                <iframe
                  title={lx("Mapa del Centro de Convenciones", "Map of the Convention Centre")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.9!2d-69.92!3d18.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSanto%20Domingo!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="space-y-5">
                <div className="p-7 rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${INK}14` }}>
                  <h3 className="text-xl font-bold mb-1.5" style={{ color: INK }}>
                    {lx("Centro de Convenciones", "Convention Centre")}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: GREY }}>
                    {lx("Salón Aurora · Santo Domingo", "Aurora Hall · Santo Domingo")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Centro+de+Convenciones+Santo+Domingo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                      style={{ background: BRAND }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?q=Centro%20de%20Convenciones%20Santo%20Domingo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-[#F1F3F9] transition-colors"
                      style={{ borderColor: `${INK}22`, color: INK }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                    </a>
                  </div>
                </div>

                <div className="p-7 rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${INK}14` }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: INK }}>
                    {lx("Código de vestimenta", "Dress code")}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: GREY }}>
                    {lx("Business casual. Sin corbata.", "Business casual. No tie required.")}
                  </p>
                </div>

                <div className="p-7 rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${INK}14` }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: INK }}>
                    {lx("Parqueo", "Parking")}
                  </h3>
                  <p className="text-sm" style={{ color: GREY }}>
                    {lx(
                      "Parqueo con valet incluido para asistentes registrados.",
                      "Valet parking included for registered attendees."
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- EDICIONES */}
      <section id="ediciones" className="py-24 px-5" style={{ background: PAPER_SOFT }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Antecedentes", "Background")}
              title={lx("Ediciones anteriores", "Past editions")}
              accent={BRAND}
              titleColor={INK}
              titleClassName="font-sans text-3xl sm:text-5xl font-black tracking-tight"
            />
          </Reveal>
          <Reveal delay={80}>
            <DemoGallery images={GALLERY} accent={BRAND} isEs={isEs} columnsClassName="grid-cols-1 sm:grid-cols-3" heightClassName="h-52" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ REGISTRO */}
      <section id="registro" className="py-24 px-5 pb-32">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Cupo limitado", "Limited seats")}
              title={lx("Reserva tu lugar", "Reserve your seat")}
              accent={BRAND}
              titleColor={INK}
              titleClassName="font-sans text-3xl sm:text-5xl font-black tracking-tight"
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-2xl border-2 shadow-lg bg-white" style={{ borderColor: BRAND }}>
              <p className="text-xs text-center mb-7" style={{ color: GREY }}>
                {lx("Registro abierto hasta el 1 de marzo de 2027", "Registration open until March 1, 2027")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="aurora-name" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input id="aurora-name" type="text" required value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} placeholder={lx("Ej. Laura Peña", "E.g. Laura Peña")} className={field} style={fieldStyle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="aurora-company" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                      {lx("Empresa", "Company")}
                    </label>
                    <input id="aurora-company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={lx("Nombre de tu empresa", "Your company name")} className={field} style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="aurora-role" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                      {lx("Cargo", "Role")}
                    </label>
                    <input id="aurora-role" type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder={lx("Ej. Directora de Producto", "E.g. Product Director")} className={field} style={fieldStyle} />
                  </div>
                </div>

                <div>
                  <label htmlFor="aurora-track" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                    {lx("Track de interés", "Track of interest")}
                  </label>
                  <select id="aurora-track" value={track} onChange={(e) => setTrack(e.target.value)} className={field} style={fieldStyle}>
                    <option>{lx("Innovación", "Innovation")}</option>
                    <option>{lx("Tecnología", "Technology")}</option>
                    <option>{lx("Negocio", "Business")}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="aurora-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select id="aurora-attendance" value={rsvpData.attendance} onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })} className={field} style={fieldStyle}>
                      <option value="Confirmado">{lx("Confirmo mi asistencia", "I confirm my attendance")}</option>
                      <option value="Declina">{lx("No podré asistir", "I can't attend")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="aurora-menu" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                      {lx("Almuerzo", "Lunch")}
                    </label>
                    <select id="aurora-menu" value={rsvpData.menuPreference} onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })} className={field} style={fieldStyle}>
                      <option>{lx("Almuerzo estándar", "Standard lunch")}</option>
                      <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                      <option>{lx("Opción sin gluten", "Gluten-free option")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="aurora-notes" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2" style={{ color: GREY }}>
                    {lx("Requerimientos (opcional)", "Requirements (optional)")}
                  </label>
                  <input id="aurora-notes" type="text" value={rsvpData.dietaryNotes} onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })} placeholder={lx("Ej. Acceso sin escaleras", "E.g. Step-free access")} className={field} style={fieldStyle} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: BRAND }}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {lx("Enviar registro por WhatsApp", "Send registration via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && (
                <div className="mt-5 p-5 rounded-xl border text-center" style={{ background: PAPER_SOFT, borderColor: BRAND }}>
                  <h3 className="font-bold text-base mb-1" style={{ color: INK }}>
                    {lx("Se abrió WhatsApp", "WhatsApp opened")}
                  </h3>
                  <p className="text-xs" style={{ color: GREY }}>
                    {lx(
                      "Tu registro quedó redactado en WhatsApp. Envía el mensaje para completarlo.",
                      "Your registration is written out in WhatsApp. Send the message to complete it."
                    )}
                  </p>
                  <p className="text-[10px] mt-2 opacity-70" style={{ color: GREY }}>
                    {lx("Es una muestra: los datos no se guardan en ningún sistema.", "This is a sample: no data is stored anywhere.")}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {showPass && (
        <VipPassModal
          eventName="Aurora Summit 2027"
          defaultGuestName={rsvpData.fullName || "Laura Peña"}
          tableNumber={lx(`Track ${track}`, `Track ${track}`)}
          eventDate="18 de Marzo, 2027 — 9:00 AM"
          eventLocation="Centro de Convenciones, Santo Domingo"
          onClose={() => setShowPass(false)}
        />
      )}
    </div>
  );
}
