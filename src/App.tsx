import { useState, useEffect } from "react";
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

// Demo Components
import BodaDemo from "./demos/BodaDemo";
import CumpleDemo from "./demos/CumpleDemo";
import CorporateDemo from "./demos/CorporateDemo";
import BabyShowerDemo from "./demos/BabyShowerDemo";
import BautizoDemo from "./demos/BautizoDemo";
import AdultCumpleDemo from "./demos/AdultCumpleDemo";
import BridalShowerDemo from "./demos/BridalShowerDemo";
import GrandOpeningDemo from "./demos/GrandOpeningDemo";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || "/";
  });

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Helper to push history state and navigate
  const handleNavigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Route matching for Demo 1: Boda
  if (currentPath.includes("boda")) {
    return <BodaDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 2: 15 Años Cumpleaños
  if (currentPath.includes("cumple-valeria") || currentPath.includes("valeria")) {
    return <CumpleDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 6: Adult Birthday (Roberto 50)
  if (currentPath.includes("roberto") || currentPath.includes("cumpleanos-50") || currentPath.includes("50")) {
    return <AdultCumpleDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Fallback for general birthday links
  if (currentPath.includes("cumple")) {
    return <CumpleDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 3: Corporate Event
  if (currentPath.includes("gala") || currentPath.includes("evento") || currentPath.includes("vitrexi")) {
    return <CorporateDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 4: Baby Shower
  if (currentPath.includes("baby-shower") || currentPath.includes("mateo")) {
    return <BabyShowerDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 5: Bautizo
  if (currentPath.includes("bautizo") || currentPath.includes("sofia")) {
    return <BautizoDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 7: Bridal Shower
  if (currentPath.includes("bridal") || currentPath.includes("isabella")) {
    return <BridalShowerDemo onBackToHome={() => handleNavigate("/")} />;
  }

  // Route matching for Demo 8: Grand Opening
  if (currentPath.includes("opening") || currentPath.includes("boutique") || currentPath.includes("inauguracion")) {
    return <GrandOpeningDemo onBackToHome={() => handleNavigate("/")} />;
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
