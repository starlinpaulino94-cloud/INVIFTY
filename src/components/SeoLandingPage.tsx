import { useEffect, useState } from "react";
import { Check, ChevronDown, Eye, MessageCircle, Home } from "lucide-react";
import { SEO_PAGES, SEO_HUB_PATH, SeoPageData } from "../data/seoPages";
import { useLanguage } from "../context/LanguageContext";
import { buildWhatsAppUrl, CONFIG } from "../config";
import LogoInvifty from "./LogoInvifty";
import { trackEvent } from "../services/analytics";

interface SeoLandingPageProps {
  onBackToHome: () => void;
}

function normalizePath(path: string): string {
  const trimmed = (path || "/").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function injectJsonLd(entries: { id: string; data: object }[]): () => void {
  const created: (HTMLScriptElement | null)[] = [];
  entries.forEach(({ id, data }) => {
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    created.push(el);
  });
  return () => created.forEach((el) => el?.remove());
}

export default function SeoLandingPage({ onBackToHome }: SeoLandingPageProps) {
  const { language, lx } = useLanguage();
  const isEs = language === "es";
  const path = normalizePath(window.location.pathname);
  const page: SeoPageData | undefined = SEO_PAGES.find((p) => p.path === path);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setOpenFaq(0);
    window.scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    if (!page) return;
    const siteUrl = "https://invifty.com";
    const hubName = isEs ? "Invitaciones digitales" : "Digital invitations";
    const breadcrumb: object = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isEs ? "Inicio" : "Home", item: siteUrl + "/" },
        ...(page.path === SEO_HUB_PATH
          ? [{ "@type": "ListItem", position: 2, name: hubName, item: siteUrl + SEO_HUB_PATH }]
          : [
              { "@type": "ListItem", position: 2, name: hubName, item: siteUrl + SEO_HUB_PATH },
              { "@type": "ListItem", position: 3, name: lx(page.h1), item: siteUrl + page.path },
            ]),
      ],
    };
    const faqSchema: object = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: lx(f.q),
        acceptedAnswer: { "@type": "Answer", text: lx(f.a) },
      })),
    };
    return injectJsonLd([
      { id: "ld-seo-breadcrumb", data: breadcrumb },
      { id: "ld-seo-faq", data: faqSchema },
    ]);
  }, [path, language, page]);

  if (!page) return null;

  const whatsappUrl = buildWhatsAppUrl(
    isEs
      ? `Hola Invifty, llegué desde la página de "${lx(page.h1)}" y quisiera cotizar una invitación digital para mi evento.`
      : `Hello Invifty, I came from the "${lx(page.h1)}" page and would like a quote for a digital invitation for my event.`
  );

  const relatedPages = page.related
    .map((p) => SEO_PAGES.find((item) => item.path === p))
    .filter((p): p is SeoPageData => Boolean(p));

  return (
    <div className="min-h-screen bg-surface text-ink-soft font-sans-clean">
      {/* Barra superior */}
      <header className="bg-surface-sunken border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-3 text-left group"
            aria-label={isEs ? "Ir al inicio de Invifty" : "Go to the Invifty homepage"}
          >
            <LogoInvifty
              idSufijo="seo"
              className="w-9 h-auto drop-shadow-[0_2px_6px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-serif tracking-[0.3em] font-light uppercase text-white group-hover:text-gold transition-colors">
              Invifty
            </span>
          </button>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-gold border border-white/15 hover:border-gold px-4 py-2.5 transition-colors min-h-[40px]"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            {isEs ? "Inicio" : "Home"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Encabezado */}
        <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-4 font-semibold">
          {lx(page.eyebrow)}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-[1.15] mb-8 max-w-3xl">
          {lx(page.h1)}
        </h1>

        {page.intro.map((p, i) => (
          <p key={i} className="text-white/60 text-base sm:text-lg font-light leading-relaxed mb-5 max-w-3xl">
            {lx(p)}
          </p>
        ))}

        {/* Beneficios clave */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
          {page.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 bg-surface-raised border border-white/5 p-5">
              <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-white/80 font-light leading-snug">{lx(b)}</span>
            </li>
          ))}
        </ul>

        {/* Secciones de contenido */}
        <div className="space-y-10 my-12">
          {page.sections.map((section, i) => (
            <section key={i} className="border-l-2 border-gold/40 pl-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-3">
                {lx(section.heading)}
              </h2>
              <p className="text-white/55 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
                {lx(section.body)}
              </p>
            </section>
          ))}
        </div>

        {/* CTA + demo */}
        <div className="bg-gradient-to-r from-surface-hover via-surface-raised to-surface-sunken border border-gold/40 p-8 sm:p-10 my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-3">
                {lx(page.ctaTitle)}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("open_whatsapp", {
                      link_text: lx(page.ctaText),
                      page_path: page.path,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 bg-gold text-black font-bold text-[10px] uppercase tracking-[0.2em] py-4 px-6 hover:bg-gold-hover active:scale-95 transition-all min-h-[48px] touch-manipulation shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {lx(page.ctaText)}
                </a>
                <button
                  onClick={() => {
                    onBackToHome();
                    setTimeout(() => {
                      const el = document.querySelector("#portafolio");
                      if (el) el.scrollIntoView({ behavior: "auto" });
                    }, 150);
                  }}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-[0.2em] py-4 px-6 hover:bg-white/10 active:scale-95 transition-all min-h-[48px] touch-manipulation"
                >
                  <Eye className="w-4 h-4 text-gold" aria-hidden="true" />
                  {isEs ? "Ver más muestras" : "See more samples"}
                </button>
              </div>
              <p className="text-[11px] text-white/60 mt-4 italic">
                {isEs
                  ? "Respuesta por WhatsApp · Precios en DOP · Pago único, sin costos ocultos"
                  : "Reply via WhatsApp · Prices in DOP · One-time payment, no hidden costs"}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="my-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-6">
            {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
          </h2>
          <div className="space-y-4">
            {page.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-surface-raised border border-white/5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
                  >
                    <span className="font-serif text-base sm:text-lg font-normal text-white">
                      {lx(faq.q)}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-none bg-surface-sunken flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-gold text-black" : "text-gold"}`}
                    >
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-xs text-white/60 leading-relaxed border-t border-white/5 font-light pt-4">
                      {lx(faq.a)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enlaces internos a otros tipos de evento */}
        {relatedPages.length > 0 && (
          <div className="my-12 border-t border-white/10 pt-10">
            <h2 className="font-serif text-xl font-normal text-white mb-5">
              {isEs ? "Invitaciones para otros tipos de evento" : "Invitations for other event types"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedPages.map((p) => (
                <a
                  key={p.path}
                  href={p.path}
                  onClick={(e) => {
                    e.preventDefault();
                    trackEvent("seo_internal_link", { placement: p.path, source_page: page.path });
                    window.history.pushState({}, "", p.path);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className="inline-flex items-center gap-2 bg-surface-raised border border-white/10 hover:border-gold hover:text-gold text-xs uppercase tracking-[0.15em] text-white/70 px-5 py-3 transition-colors"
                >
                  {lx(p.eyebrow)}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Pie simple */}
      <footer className="bg-[#050505] border-t border-white/10 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-white/60">
          <p>
            © {new Date().getFullYear()} {CONFIG.brandName} · {isEs ? "Todos los derechos reservados." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="hover:text-gold transition-colors">
              {isEs ? "Inicio" : "Home"}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              {isEs ? "WhatsApp" : "WhatsApp"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
