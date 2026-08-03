import { useState, useEffect, lazy, Suspense, ComponentType } from "react";
import Navbar from "./components/Navbar";
import WhatsAppChangeNotice from "./components/WhatsAppChangeNotice";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import BenefitsSection from "./components/BenefitsSection";
import PortfolioSection from "./components/PortfolioSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FaqSection from "./components/FaqSection";
import InquiryForm from "./components/InquiryForm";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import NotFoundPage from "./components/NotFoundPage";
import { trackEvent } from "./utils/analytics";
import { useLanguage } from "./context/LanguageContext";
import { PORTFOLIO_ITEMS } from "./data/portfolioData";

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
};

function normalizePath(path: string): string {
  const trimmed = (path || "/").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * SEO: título y descripción únicos por ruta (el informe de investigación
 * recomienda que cada página tenga metadatos propios, no los genéricos).
 */
function getPageMeta(path: string, isEs: boolean): { title: string; description: string } {
  if (path === "/privacidad") {
    return isEs
      ? { title: "Política de Privacidad · Invifty", description: "Cómo Invifty trata tus datos: qué recopilamos, para qué se usa y cómo solicitar acceso, corrección o eliminación." }
      : { title: "Privacy Policy · Invifty", description: "How Invifty handles your data: what we collect, how it is used and how to request access, correction or deletion." };
  }
  if (path === "/terminos") {
    return isEs
      ? { title: "Términos del Servicio · Invifty", description: "Condiciones del servicio de invitaciones digitales de Invifty: alcance, revisiones, entrega, pagos y propiedad intelectual." }
      : { title: "Terms of Service · Invifty", description: "Terms for Invifty's digital invitation service: scope, revisions, delivery, payments and intellectual property." };
  }
  const demo = PORTFOLIO_ITEMS.find((item) => item.demoPath === path);
  if (demo) {
    return {
      title: `${demo.title} — ${isEs ? "Muestra Interactiva" : "Interactive Sample"} · Invifty`,
      description: isEs
        ? `Muestra interactiva de invitación digital: ${demo.title}. Explora el diseño, la música, la galería y el RSVP de Invifty.`
        : `Interactive digital invitation sample: ${demo.title}. Explore Invifty's design, music, gallery and RSVP.`,
    };
  }
  return isEs
    ? { title: "Invifty — Invitaciones Digitales Premium", description: "Invitaciones digitales elegantes e interactivas para bodas, 15 años, cumpleaños y eventos corporativos. RSVP directo por WhatsApp, música, mapas y pases QR." }
    : { title: "Invifty — Premium Digital Invitations", description: "Elegant, interactive digital invitations for weddings, quinceañeras, birthdays and corporate events. WhatsApp RSVP, music, maps and QR passes." };
}

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

  // Título y meta descripción propios de cada ruta e idioma
  useEffect(() => {
    const meta = getPageMeta(currentPath, language === "es");
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
  }, [currentPath, language]);

  // Helper to push history state and navigate
  const handleNavigate = (path: string) => {
    const normalized = normalizePath(path);
    window.history.pushState({}, "", normalized);
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (normalized.startsWith("/muestra/")) {
      trackEvent("view_demo", { demo_path: normalized });
    }
  };

  const RoutedPage = ROUTES[currentPath];
  if (RoutedPage) {
    return (
      <Suspense fallback={<DemoLoadingFallback />}>
        <RoutedPage onBackToHome={() => handleNavigate("/")} />
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
        <HowItWorks />
        <PortfolioSection onNavigateDemo={handleNavigate} />
        <BenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <InquiryForm />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
