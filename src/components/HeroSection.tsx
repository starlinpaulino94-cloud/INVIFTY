import { CONFIG, buildWhatsAppUrl } from "../config";
import { MessageCircle, Eye, ShieldCheck, Clock, Music, MapPin } from "lucide-react";
import heroBg from "../assets/images/invifty_hero_bg.webp";
import coupleImg from "../assets/images/wedding_couple_demo.webp";
import { useLanguage } from "../context/LanguageContext";

interface HeroSectionProps {
  onNavigateDemo?: (demoPath: string) => void;
}

export default function HeroSection({ onNavigateDemo }: HeroSectionProps) {
  const { language, t } = useLanguage();
  const isEs = language === "es";

  const scrollToPortfolio = () => {
    const el = document.getElementById("portafolio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPricing = () => {
    const el = document.getElementById("planes");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-[90vh] flex items-center bg-[#0F0F0F]">
      {/* Hero Background Image with Darkness Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Invifty Eventos de Lujo"
          className="w-full h-full object-cover object-center opacity-20 filter scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-[#0F0F0F]/80 to-[#0F0F0F]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Copy Content (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Badge */}
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block font-semibold">
              {t("hero.badge")}
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6 text-white font-normal tracking-tight">
              {t("hero.title1")} <br className="hidden sm:inline" />
              <span className="italic font-light text-[#D4AF37]">{t("hero.title2")}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-light italic">
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-12">
              <button
                onClick={scrollToPortfolio}
                className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#F2D06B] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group min-h-[48px] touch-manipulation"
              >
                <Eye className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                {t("hero.btnPrimary")}
              </button>

              <button
                onClick={scrollToPricing}
                className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                {isEs ? "Ver Planes y Precios" : "View Plans & Pricing"}
              </button>

              <a
                href={buildWhatsAppUrl("Hola Invifty, quiero solicitar información para mi invitación digital.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-[#151515] border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                <MessageCircle className="w-4 h-4" />
                {t("nav.requestInvite")}
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="block text-xs font-semibold text-white tracking-wider uppercase">{t("hero.stat3")}</span>
                  <span className="text-[10px] text-white/40">{t("hero.stat3Sub")}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="block text-xs font-semibold text-white tracking-wider uppercase">{t("hero.stat1")}</span>
                  <span className="text-[10px] text-white/40">{t("hero.stat1Sub")}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2">
                <Music className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="block text-xs font-semibold text-white tracking-wider uppercase">{t("hero.stat2")}</span>
                  <span className="text-[10px] text-white/40">{t("hero.stat2Sub")}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Phone Frame Interactive Mockup (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group">
              {/* Outer Golden Ambient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#D4AF37]/30 via-[#F2D06B]/20 to-transparent rounded-[54px] blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>

              {/* Physical Phone Chassis */}
              <div className="relative w-[280px] sm:w-[300px] h-[570px] sm:h-[600px] bg-[#1C1C1E] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/20 ring-1 ring-white/10 flex flex-col justify-between">
                
                {/* Physical Side Buttons */}
                {/* Volume Up */}
                <div className="absolute -left-[3px] top-24 w-[3px] h-10 bg-[#2C2C2E] rounded-l-sm border-r border-black/40"></div>
                {/* Volume Down */}
                <div className="absolute -left-[3px] top-38 w-[3px] h-10 bg-[#2C2C2E] rounded-l-sm border-r border-black/40"></div>
                {/* Power Button */}
                <div className="absolute -right-[3px] top-28 w-[3px] h-14 bg-[#2C2C2E] rounded-r-sm border-l border-black/40"></div>

                {/* Inner Screen Canvas */}
                <div className="relative w-full h-full bg-[#0F0F0F] rounded-[38px] overflow-hidden flex flex-col justify-between border border-black/80">
                  
                  {/* Screen Status Bar */}
                  <div className="relative z-30 pt-2.5 px-6 flex justify-between items-center text-white/90 text-[10px] font-semibold tracking-tight select-none">
                    <span>9:41</span>
                    
                    {/* Dynamic Island Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full flex items-center justify-end px-2 border border-white/10 shadow-inner z-40">
                      <div className="w-2 h-2 rounded-full bg-[#111] border border-white/20"></div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-white/80">
                      <span>5G</span>
                      {/* Battery Icon */}
                      <div className="w-4 h-2 border border-white/80 rounded-sm p-[1px] flex items-center">
                        <div className="w-full h-full bg-white/90 rounded-[1px]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable / Interactive Preview Content */}
                  <div className="flex-1 flex flex-col justify-between overflow-hidden relative text-center">
                    
                    {/* Banner Image */}
                    <div className="relative h-52 sm:h-56 shrink-0 bg-black overflow-hidden">
                      <img
                        src={coupleImg}
                        alt="Camila & Lucas"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-black/20"></div>
                      
                      <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md text-[8px] uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37]/40 flex items-center gap-1 font-semibold">
                        ◆ MUESTRA
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="px-4 py-3 flex-1 flex flex-col justify-between bg-[#0F0F0F] relative z-10">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] block font-semibold">
                          Boda Luxury
                        </span>
                        <h3 className="font-serif text-2xl text-white font-normal my-0.5 leading-tight">
                          Camila & Lucas
                        </h3>
                        <p className="text-[10px] text-white/50 font-light italic mb-3 flex items-center justify-center gap-1">
                          <MapPin className="w-3 h-3 text-[#D4AF37]" /> Altos de Chavón, La Romana
                        </p>

                        {/* Countdown Grid */}
                        <div className="grid grid-cols-4 gap-1 bg-[#151515] p-2 border border-white/10 mb-3">
                          <div>
                            <span className="block text-xs font-semibold text-[#D4AF37]">42</span>
                            <span className="text-[7px] text-white/40 uppercase tracking-widest">Días</span>
                          </div>
                          <div>
                            <span className="block text-xs font-semibold text-[#D4AF37]">14</span>
                            <span className="text-[7px] text-white/40 uppercase tracking-widest">Horas</span>
                          </div>
                          <div>
                            <span className="block text-xs font-semibold text-[#D4AF37]">38</span>
                            <span className="text-[7px] text-white/40 uppercase tracking-widest">Min</span>
                          </div>
                          <div>
                            <span className="block text-xs font-semibold text-[#D4AF37]">12</span>
                            <span className="text-[7px] text-white/40 uppercase tracking-widest">Seg</span>
                          </div>
                        </div>
                      </div>

                      {/* Call to action inside phone */}
                      <button
                        onClick={() => {
                          if (onNavigateDemo) onNavigateDemo("/muestra/boda-camila-y-lucas");
                        }}
                        className="w-full bg-[#D4AF37] text-black font-semibold text-[10px] uppercase tracking-widest py-3 transition-all flex items-center justify-center gap-1.5 hover:bg-[#F2D06B] shadow-md active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Muestra Interactiva
                      </button>
                    </div>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="pb-1.5 pt-1 bg-[#0F0F0F] relative z-30">
                    <div className="w-24 h-1 bg-white/40 rounded-full mx-auto"></div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
