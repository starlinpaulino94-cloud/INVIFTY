import { useState, useEffect, lazy, Suspense, ComponentType } from "react";
import Navbar from "./components/Navbar";
import WhatsAppChangeNotice from "./components/WhatsAppChangeNotice";
import HeroSection from "./components/HeroSection";
import DemoSelector from "./components/DemoSelector";
import HowItWorks from "./components/HowItWorks";
import BenefitsSection from "./components/BenefitsSection";
import PortfolioSection from "./components/PortfolioSection";
import PricingSection from "./components/PricingSection";
import TrustSection from "./components/TrustSection";
import ReviewsSection from "./components/ReviewsSection";
import FaqSection from "./components/FaqSection";
import InquiryForm from "./components/InquiryForm";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import AnalyticsConsentBanner from "./components/AnalyticsConsentBanner";
import { ENV } from "./config/env";
import NotFoundPage from "./components/NotFoundPage";
import { resetOnceGuards, trackEvent } from "./services/analytics";
import { useLanguage } from "./context/LanguageContext";
import { useSelection } from "./context/SelectionContext";
import { getDemoByUrl } from "./services/demos";
import { applyRouteSeo, getRouteSeo, normalizeRoute as normalizePath } from "./services/seo";
import { SEO_PAGE_INDEX } from "./data/seoPageIndex";

// Demo pages are code-split so the landing page loads without them.
const BodaDemo = lazy(() => import("./demos/BodaDemo"));
const CumpleDemo = lazy(() => import("./demos/CumpleDemo"));
const CorporateDemo = lazy(() => import("./demos/CorporateDemo"));
const BabyShowerDemo = lazy(() => import("./demos/BabyShowerDemo"));
const BautizoDemo = lazy(() => import("./demos/BautizoDemo"));
const AdultCumpleDemo = lazy(() => import("./demos/AdultCumpleDemo"));
const BridalShowerDemo = lazy(() => import("./demos/BridalShowerDemo"));
const GrandOpeningDemo = lazy(() => import("./demos/GrandOpeningDemo"));

// Nueva colección de diseño (estilos del sistema de plantillas 2026)
const EditorialBodaDemo = lazy(() => import("./demos/EditorialBodaDemo"));
const QuinceCelestialDemo = lazy(() => import("./demos/QuinceCelestialDemo"));
const NeonPartyDemo = lazy(() => import("./demos/NeonPartyDemo"));
const AuroraSummitDemo = lazy(() => import("./demos/AuroraSummitDemo"));

// Legal pages, also code-split
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

// Páginas SEO por tipo de evento (contenido indexable + JSON-LD)
const SeoLandingPage = lazy(() => import("./components/SeoLandingPage"));

interface RoutedPageProps {
  onBackToHome: () => void;
}

// Exact route table — demo paths must stay in sync with demoPath in src/data/portfolioData.ts
const ROUTES: Record<string, ComponentType<RoutedPageProps>> = {
  "/muestra/boda-camila-y-lucas": BodaDemo,
  "/muestra/cumple-valeria-15": CumpleDemo,
  "/muestra/gala-anual-vitrexi": CorporateDemo,
  "/muestra/baby-shower-mateo": BabyShowerDemo,
  "/muestra/bautizo-sofia-maria": BautizoDemo,
  "/muestra/cumpleanos-50-roberto": AdultCumpleDemo,
  "/muestra/bridal-shower-isabella": BridalShowerDemo,
  "/muestra/grand-opening-boutique": GrandOpeningDemo,
  "/muestra/boda-editorial-elena-gabriel": EditorialBodaDemo,
  "/muestra/quince-celestial-amara": QuinceCelestialDemo,
  "/muestra/neon-party-marcos-40": NeonPartyDemo,
  "/muestra/summit-aurora-vitrexi": AuroraSummitDemo,
  "/privacidad": PrivacyPage,
  "/terminos": TermsPage,
  ...Object.fromEntries(
    SEO_PAGE_INDEX.map((seoPage) => [seoPage.path, SeoLandingPage])
  ),
};

function DemoLoadingFallback() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
        {language === "es" ? "Cargando…" : "Loading…"}
      </span>
    </div>
  );
}

export default function App() {
  const { language } = useLanguage();
  const { selectDemo } = useSelection();
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // page_view por cambio de ruta: la SPA no recarga, así que GA4 no lo detecta solo.
  useEffect(() => {
    resetOnceGuards();
    trackEvent("page_view", { page_path: currentPath, language });
  }, [currentPath, language]);

  // Metadatos completos por ruta e idioma: título, descripción, canonical,
  // Open Graph y Twitter Card. Antes sólo se actualizaban título y descripción,
  // y el canonical apuntaba siempre a la portada.
  useEffect(() => {
    applyRouteSeo(getRouteSeo(currentPath, language));
  }, [currentPath, language]);

  // Helper to push history state and navigate
  const handleNavigate = (path: string) => {
    const normalized = normalizePath(path);
    window.history.pushState({}, "", normalized);
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (normalized.startsWith("/muestra/")) {
      const demoId = normalized.replace("/muestra/", "");
      // Conserva la demo que inspiró al visitante para el formulario y WhatsApp.
      selectDemo(demoId);
      // El catálogo aporta la categoría y el tipo de evento, para poder segmentar
      // qué estilos generan más interés.
      const demo = getDemoByUrl(normalized);
      trackEvent("view_demo", {
        demo_id: demoId,
        category: demo?.category,
        event_type: demo ? demo.eventTypeLabel.es : undefined,
        language,
        source_page: currentPath,
      });
    }
  };

  const RoutedPage = ROUTES[currentPath];
  if (RoutedPage) {
    return (
      <Suspense fallback={<DemoLoadingFallback />}>
        <RoutedPage key={currentPath} onBackToHome={() => handleNavigate("/")} />
      </Suspense>
    );
  }

  // Unknown route → 404 page
  if (currentPath !== "/") {
    return <NotFoundPage onBackToHome={() => handleNavigate("/")} />;
  }

  // Default: Main Official Invifty Website Landing Page
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#EAEAEA] font-sans-clean selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Accesibilidad: saltar la navegación con teclado */}
      <a href="#contenido" className="skip-link">
        {language === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>

      {/* Top Administrative Notice for WhatsApp Number change */}
      <WhatsAppChangeNotice />

      {/* Glassmorphism Header Bar */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Sections */}
      <main id="contenido">
        <HeroSection onNavigateDemo={handleNavigate} />
        <DemoSelector onNavigateDemo={handleNavigate} />
        <HowItWorks />
        <PortfolioSection onNavigateDemo={handleNavigate} />
        <BenefitsSection />
        <PricingSection />
        <TrustSection />
        <ReviewsSection />
        <FaqSection />
        <InquiryForm />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
      {/* Oculto por ahora (decisión del negocio): sin banner GA4/GTM no se activan. */}
      {ENV.consentBannerEnabled && (
        <AnalyticsConsentBanner onNavigatePrivacy={() => handleNavigate("/privacidad")} />
      )}
    </div>
  );
}
