import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Gem,
  MapPin,
  Navigation,
  QrCode,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Wine,
} from "lucide-react";
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
import VipPassModal from "../components/VipPassModal";
import { useLanguage } from "../context/LanguageContext";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface GrandOpeningDemoProps {
  onBackToHome: () => void;
}

/* Apertura premium: negro absoluto, oro y grafito. */
const BLACK = "#0A0A0A";
const CARBON = "#131313";
const SURFACE = "#1A1A1A";
const GOLD = "#D4AF37";

const PALETTE: DemoPalette = { accent: GOLD, onAccent: BLACK, bar: "#050505" };

const HERO =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1600";

const GALLERY = [
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=900",
];

export default function GrandOpeningDemo({ onBackToHome }: GrandOpeningDemoProps) {
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);
  useSectionReveal();

  const targetDate = new Date("2026-12-01T19:00:00").getTime();

  const [showVipPass, setShowVipPass] = useState(false);
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: lx("Cóctel VIP de bienvenida", "VIP welcome cocktail"),
    dietaryNotes: "",
    songRequest: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [mediaOutlet, setMediaOutlet] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const payload: RsvpFormData = {
      ...rsvpData,
      dietaryNotes: [
        `${lx("Empresa", "Company")}: ${companyName || "—"}`,
        `${lx("Medio", "Media")}: ${mediaOutlet || "—"}`,
        rsvpData.dietaryNotes ? `${lx("Notas", "Notes")}: ${rsvpData.dietaryNotes}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    };

    window.open(createRsvpWhatsAppUrl("Grand Opening Boutique L'Élite", payload), "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const calendarUrl = () => {
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: "Grand Opening — Boutique L'Élite",
      dates: "20261201T230000Z/20261202T030000Z",
      details: "Inauguración oficial y fashion showcase de Boutique L'Élite.",
      location: "Torre Empresarial Piantini, Santo Domingo",
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };

  const programme = [
    { time: "7:00 PM", icon: Wine, es: "Alfombra y cóctel de bienvenida", en: "Carpet & welcome cocktail", d_es: "Recepción con prensa y fotografía oficial.", d_en: "Reception with press and official photography." },
    { time: "7:45 PM", icon: Scissors, es: "Corte de cinta oficial", en: "Official ribbon cutting", d_es: "Palabras de la fundadora y apertura de puertas.", d_en: "Words from the founder and doors open." },
    { time: "8:15 PM", icon: Sparkles, es: "Fashion showcase", en: "Fashion showcase", d_es: "Presentación de la colección cápsula 2026.", d_en: "Presentation of the 2026 capsule collection." },
    { time: "9:00 PM", icon: Gem, es: "Recorrido privado por la tienda", en: "Private store tour", d_es: "Atención personalizada y primeras compras.", d_en: "Personal styling and first purchases." },
    { time: "10:00 PM", icon: Wine, es: "Brindis de cierre", en: "Closing toast", d_es: "DJ en vivo y after en la terraza.", d_en: "Live DJ and terrace after-party." },
  ];

  const perks = [
    { icon: Gem, es: "15 % de descuento en tu primera compra de la noche", en: "15% off your first purchase of the night" },
    { icon: Sparkles, es: "Obsequio de bienvenida para las primeras 50 invitadas", en: "Welcome gift for the first 50 guests" },
    { icon: ShieldCheck, es: "Acceso prioritario al showroom privado", en: "Priority access to the private showroom" },
  ];

  const field = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const fieldStyle = { background: BLACK, border: `1px solid ${GOLD}33` };

  const navItems = [
    { id: "inicio", label: lx("Inauguración", "Opening") },
    { id: "agenda", label: lx("Programa VIP", "VIP Programme") },
    { id: "beneficios", label: lx("Beneficios", "Perks") },
    { id: "coleccion", label: lx("Colección", "Collection") },
    { id: "pase", label: lx("Pase VIP", "VIP Pass") },
    { id: "ubicacion", label: lx("Lugar & Valet", "Venue & Valet") },
  ];

  return (
    <div className="min-h-screen font-sans relative" style={{ background: BLACK, color: "#EDEDED" }}>
      <DemoTopBar onBackToHome={onBackToHome} sampleName="Grand Opening Boutique L'Élite" isEs={isEs} setLanguage={setLanguage} palette={PALETTE} />
      <DemoSubNav
        items={navItems}
        ctaId="acreditacion"
        ctaLabel={lx("Acreditación VIP", "VIP Accreditation")}
        onNavigate={scrollToSection}
        palette={PALETTE}
        background={`${CARBON}E6`}
        ariaLabel={lx("Secciones del evento", "Event sections")}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <header id="inicio" className="relative min-h-[94vh] flex items-center justify-center text-center px-5 overflow-hidden">
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
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-3xl pointer-events-none" style={{ background: `${GOLD}1F` }} />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase mb-8 border"
              style={{ color: GOLD, borderColor: `${GOLD}66`, background: `${GOLD}14` }}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              {lx("Inauguración oficial VIP", "Official VIP opening")}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-white mb-3 leading-[1.05]">
              Boutique
              <span className="block italic" style={{ color: GOLD }}>
                L&apos;Élite
              </span>
            </h1>
            <p className="text-[11px] sm:text-sm uppercase tracking-[0.4em] font-semibold" style={{ color: GOLD }}>
              Grand Opening &amp; Fashion Showcase 2026
            </p>
          </Reveal>

          <Reveal delay={220}>
            <DemoDivider accent={GOLD} />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold my-6 text-white/80">
              {lx("Martes 1 de Diciembre, 2026 · 7:00 PM", "Tuesday, December 1, 2026 · 7:00 PM")}
              <span className="block mt-2 text-white/45 tracking-[0.18em]">Torre Empresarial Piantini · Santo Domingo</span>
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-base sm:text-lg text-white/70 font-light max-w-xl mx-auto mb-10 leading-relaxed">
              {lx(
                "Una noche de moda, diseño y celebración para inaugurar el espacio que llevábamos años imaginando.",
                "A night of fashion, design and celebration to open the space we spent years imagining."
              )}
            </p>
          </Reveal>

          <Reveal delay={380}>
            <DemoCountdown
              target={targetDate}
              accent={GOLD}
              cell={`${SURFACE}CC`}
              labels={{ days: lx("Días", "Days"), hours: lx("Horas", "Hours"), minutes: lx("Min", "Min"), seconds: lx("Seg", "Sec") }}
            />
          </Reveal>

          <Reveal delay={460}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => scrollToSection("acreditacion")}
                className="px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: GOLD, color: BLACK }}
              >
                {lx("Solicitar acreditación", "Request accreditation")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={calendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white/5"
                style={{ borderColor: `${GOLD}80`, color: GOLD }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Añadir al calendario", "Add to calendar")}
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ------------------------------------------------------------- AGENDA */}
      <section id="agenda" className="py-24 px-5" style={{ background: CARBON }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("La noche", "The night")} title={lx("Programa VIP", "VIP programme")} accent={GOLD} />
          </Reveal>

          <ol className="space-y-4">
            {programme.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border transition-colors hover:border-[#D4AF37]/50" style={{ background: SURFACE, borderColor: `${GOLD}26` }}>
                    <div className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center" style={{ borderColor: `${GOLD}66`, background: `${GOLD}0F` }}>
                      <item.icon className="w-5 h-5" style={{ color: GOLD }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: GOLD }}>
                        {item.time}
                      </span>
                      <h3 className="font-serif text-xl text-white mb-1">{lx(item.es, item.en)}</h3>
                      <p className="text-xs text-white/60 leading-relaxed">{lx(item.d_es, item.d_en)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------- BENEFICIOS */}
      <section id="beneficios" className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Sólo esa noche", "That night only")}
              title={lx("Beneficios de invitada", "Guest privileges")}
              accent={GOLD}
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {perks.map((perk, idx) => (
              <Reveal key={perk.es} delay={idx * 90}>
                <div className="p-7 rounded-3xl border text-center h-full" style={{ background: SURFACE, borderColor: `${GOLD}33` }}>
                  <perk.icon className="w-8 h-8 mx-auto mb-4" style={{ color: GOLD }} aria-hidden="true" />
                  <p className="text-sm text-white/75 leading-relaxed">{lx(perk.es, perk.en)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- COLECCIÓN */}
      <section id="coleccion" className="py-24 px-5" style={{ background: CARBON }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Un adelanto", "A preview")}
              title={lx("Colección cápsula 2026", "2026 capsule collection")}
              accent={GOLD}
            />
          </Reveal>
          <Reveal delay={80}>
            <DemoGallery images={GALLERY} accent={GOLD} isEs={isEs} columnsClassName="grid-cols-2 md:grid-cols-4" />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- PASE */}
      <section id="pase" className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Control de acceso", "Access control")} title={lx("Tu pase VIP", "Your VIP pass")} accent={GOLD} />
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" style={{ background: SURFACE, borderColor: `${GOLD}4D` }}>
              <div>
                <h3 className="font-serif text-2xl text-white mb-3">{lx("Aforo limitado a 120 invitadas", "Capacity limited to 120 guests")}</h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {lx(
                    "Cada acreditación aprobada recibe un código QR único. Se escanea en la alfombra y da acceso al showroom privado.",
                    "Each approved accreditation gets a unique QR code. It is scanned at the carpet and grants access to the private showroom."
                  )}
                </p>
                <button
                  onClick={() => setShowVipPass(true)}
                  className="px-7 py-3.5 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center gap-2 min-h-[48px] transition-transform active:scale-95"
                  style={{ background: GOLD, color: BLACK }}
                >
                  <QrCode className="w-4 h-4" aria-hidden="true" />
                  {lx("Ver pase de ejemplo", "See a sample pass")}
                </button>
              </div>

              <div className="rounded-2xl border p-7 text-center" style={{ background: BLACK, borderColor: `${GOLD}33` }}>
                <QrCode className="w-24 h-24 mx-auto mb-4" style={{ color: GOLD }} aria-hidden="true" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1" style={{ color: GOLD }}>
                  {lx("Pase VIP", "VIP pass")}
                </p>
                <p className="text-xs text-white/50">{lx("Acceso alfombra + showroom", "Carpet + showroom access")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- UBICACIÓN */}
      <section id="ubicacion" className="py-24 px-5" style={{ background: CARBON }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Dónde", "Where")} title={lx("Lugar y valet", "Venue and valet")} accent={GOLD} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${GOLD}33` }}>
                <iframe
                  title={lx("Mapa de Torre Empresarial Piantini", "Map of Torre Empresarial Piantini")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5!2d-69.93!3d18.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPiantini%2C%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="space-y-5">
                <div className="p-7 rounded-3xl border" style={{ background: SURFACE, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <MapPin className="w-4 h-4" aria-hidden="true" /> {lx("Lugar", "Venue")}
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-1.5">Torre Empresarial Piantini</h3>
                  <p className="text-sm text-white/60 mb-6">{lx("Planta baja · Av. Gustavo Mejía Ricart", "Ground floor · Gustavo Mejía Ricart Ave.")}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Piantini+Santo+Domingo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                      style={{ background: GOLD, color: BLACK }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?q=Piantini%20Santo%20Domingo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-white/5 transition-colors"
                      style={{ borderColor: `${GOLD}80`, color: GOLD }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                    </a>
                  </div>
                </div>

                <div className="p-7 rounded-3xl border" style={{ background: SURFACE, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {lx("Código de vestimenta", "Dress code")}
                  </div>
                  <h3 className="font-serif text-xl text-white mb-1.5">{lx("Cocktail chic · Negro y oro", "Cocktail chic · Black and gold")}</h3>
                  <div className="flex items-center gap-3 mt-4">
                    {[
                      { n: lx("Negro", "Black"), c: "#111111" },
                      { n: lx("Oro", "Gold"), c: GOLD },
                      { n: lx("Grafito", "Graphite"), c: "#3A3A3A" },
                      { n: lx("Marfil", "Ivory"), c: "#F3EFE7" },
                    ].map((c) => (
                      <div key={c.n} className="text-center">
                        <span className="block w-11 h-11 rounded-full border mb-1.5" style={{ background: c.c, borderColor: "rgba(255,255,255,0.25)" }} aria-hidden="true" />
                        <span className="text-[9px] text-white/50 uppercase tracking-wider">{c.n}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-7 rounded-3xl border" style={{ background: SURFACE, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Car className="w-4 h-4" aria-hidden="true" /> {lx("Valet parking", "Valet parking")}
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {lx(
                      "Valet cortesía de la boutique en la entrada principal. Presenta tu pase QR al llegar.",
                      "Complimentary valet at the main entrance. Show your QR pass on arrival."
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- ACREDITACIÓN */}
      <section id="acreditacion" className="py-24 px-5 pb-32">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Aforo limitado", "Limited capacity")}
              title={lx("Acreditación VIP", "VIP accreditation")}
              accent={GOLD}
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2 shadow-2xl" style={{ background: SURFACE, borderColor: GOLD }}>
              <p className="text-xs text-white/60 text-center mb-7">
                {lx("Solicita tu pase antes del 20 de noviembre", "Request your pass before November 20")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="opening-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input id="opening-name" type="text" required value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} placeholder={lx("Ej. Patricia de la Cruz", "E.g. Patricia de la Cruz")} className={field} style={fieldStyle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="opening-company" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Empresa", "Company")}
                    </label>
                    <input id="opening-company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={lx("Ej. Atelier Moda RD", "E.g. Atelier Moda RD")} className={field} style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="opening-media" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Medio o prensa", "Media outlet")}
                    </label>
                    <input id="opening-media" type="text" value={mediaOutlet} onChange={(e) => setMediaOutlet(e.target.value)} placeholder={lx("Ej. Revista Estilos", "E.g. Estilos Magazine")} className={field} style={fieldStyle} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="opening-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select id="opening-attendance" value={rsvpData.attendance} onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })} className={field} style={fieldStyle}>
                      <option value="Confirmado">{lx("Confirmo mi asistencia", "I confirm my attendance")}</option>
                      <option value="Declina">{lx("No podré asistir", "I can't make it")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="opening-guests" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Acompañantes", "Companions")}
                    </label>
                    <select id="opening-guests" value={rsvpData.guestCount} onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })} className={field} style={fieldStyle}>
                      {[1, 2].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="opening-notes" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Requerimientos (opcional)", "Requirements (optional)")}
                  </label>
                  <input id="opening-notes" type="text" value={rsvpData.dietaryNotes} onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })} placeholder={lx("Ej. Acceso sin escaleras", "E.g. Step-free access")} className={field} style={fieldStyle} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: GOLD, color: BLACK }}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {lx("Solicitar pase por WhatsApp", "Request pass via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && (
                <div className="mt-5 p-5 rounded-2xl border text-center" style={{ background: BLACK, borderColor: GOLD }}>
                  <CheckCircle2 className="w-9 h-9 mx-auto mb-2" style={{ color: GOLD }} aria-hidden="true" />
                  <h3 className="font-serif text-lg text-white mb-1">{lx("Se abrió WhatsApp", "WhatsApp opened")}</h3>
                  <p className="text-xs text-white/70">
                    {lx(
                      "Tu solicitud quedó redactada en WhatsApp. Envía el mensaje para completarla.",
                      "Your request is written out in WhatsApp. Send the message to complete it."
                    )}
                  </p>
                  <p className="text-[10px] text-white/45 mt-2">
                    {lx("Es una muestra: los datos no se guardan en ningún sistema.", "This is a sample: no data is stored anywhere.")}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {showVipPass && (
        <VipPassModal
          eventName="Grand Opening — Boutique L'Élite"
          defaultGuestName={rsvpData.fullName || "Patricia de la Cruz"}
          tableNumber={lx("Acceso VIP", "VIP Access")}
          eventDate="1 de Diciembre, 2026 — 7:00 PM"
          eventLocation="Torre Empresarial Piantini, Santo Domingo"
          onClose={() => setShowVipPass(false)}
        />
      )}
    </div>
  );
}
