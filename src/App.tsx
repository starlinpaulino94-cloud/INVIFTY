import { useState, useEffect, lazy, Suspense, ComponentType } from "react";
import Navbar from "./components/Navbar";
import WhatsAppChangeNotice from "./components/WhatsAppChangeNotice";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import PortfolioSection from "./components/PortfolioSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FaqSection from "./components/FaqSection";
import InquiryForm from "./components/InquiryForm";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import NotFoundPage from "./components/NotFoundPage";

// Demo pages are code-split so the landing page loads without them.
const BodaDemo = lazy(() => import("./demos/BodaDemo"));
const CumpleDemo = lazy(() => import("./demos/CumpleDemo"));
const CorporateDemo = lazy(() => import("./demos/CorporateDemo"));
const BabyShowerDemo = lazy(() => import("./demos/BabyShowerDemo"));
const BautizoDemo = lazy(() => import("./demos/BautizoDemo"));
const AdultCumpleDemo = lazy(() => import("./demos/AdultCumpleDemo"));
const BridalShowerDemo = lazy(() => import("./demos/BridalShowerDemo"));
const GrandOpeningDemo = lazy(() => import("./demos/GrandOpeningDemo"));

interface DemoProps {
  onBackToHome: () => void;
}

// Exact route table — must stay in sync with demoPath in src/data/portfolioData.ts
const DEMO_ROUTES: Record<string, ComponentType<DemoProps>> = {
  "/muestra/boda-camila-y-lucas": BodaDemo,
  "/muestra/cumple-valeria-15": CumpleDemo,
  "/muestra/gala-anual-vitrexi": CorporateDemo,
  "/muestra/baby-shower-mateo": BabyShowerDemo,
  "/muestra/bautizo-sofia-maria": BautizoDemo,
  "/muestra/cumpleanos-50-roberto": AdultCumpleDemo,
  "/muestra/bridal-shower-isabella": BridalShowerDemo,
  "/muestra/grand-opening-boutique": GrandOpeningDemo,
};

function normalizePath(path: string): string {
  const trimmed = (path || "/").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function DemoLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
        Cargando invitación…
      </span>
    </div>
  );
}

export default function App() {
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

  // Helper to push history state and navigate
  const handleNavigate = (path: string) => {
    const normalized = normalizePath(path);
    window.history.pushState({}, "", normalized);
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const DemoComponent = DEMO_ROUTES[currentPath];
  if (DemoComponent) {
    return (
      <Suspense fallback={<DemoLoadingFallback />}>
        <DemoComponent onBackToHome={() => handleNavigate("/")} />
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
      {/* Top Administrative Notice for WhatsApp Number change */}
      <WhatsAppChangeNotice />

      {/* Glassmorphism Header Bar */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Sections */}
      <main>
        <HeroSection onNavigateDemo={handleNavigate} />
        <HowItWorks />
        <PortfolioSection onNavigateDemo={handleNavigate} />
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
