import { PortfolioItem } from "../types";
import weddingImage from "../assets/images/wedding_couple_demo.webp";
import quinceImage from "../assets/images/quince_valeria_demo.webp";
import corporateImage from "../assets/images/gala_corporate_demo.webp";

/**
 * COLECCIÓN EDITORIAL DE PLANTILLAS MODELO
 * ====================================================
 * Invifty abarca todo tipo de invitaciones para eventos de alto nivel:
 * Bodas, 15 Años, Eventos Corporativos, Baby Showers, Bautizos,
 * Cumpleaños de Adultos, Despedidas de Soltera y Lanzamientos.
 *
 * NOTA: Las imágenes con URL de Unsplash pueden localizarse ejecutando
 * `npm run localize:images` desde una red sin restricciones (ver scripts/).
 */

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "muestra-boda",
    slug: "boda-camila-y-lucas",
    title: "Camila & Lucas — Boda de Gala",
    eventType: "Boda Luxury",
    subtitle: "Altos de Chavón, La Romana · Etiqueta Black Tie",
    image: weddingImage,
    features: [
      { es: "Reloj regresivo & Guardar en Calendario", en: "Countdown clock & Save to Calendar" },
      { es: "Sinfonía romántica de fondo interactiva", en: "Interactive romantic background music" },
      { es: "Confirmación RSVP con asignación de pases", en: "RSVP confirmation with pass assignment" },
      { es: "Línea de tiempo & Historia de Amor", en: "Timeline & Love Story" },
      { es: "Itinerario de ceremonia, banquete y hora loca", en: "Ceremony, banquet & after-party itinerary" },
      { es: "Mesa de regalos bancaria & Zelle (Copia en 1-clic)", en: "Bank & Zelle gift registry (1-click copy)" },
      { es: "Geolocalización Waze & Google Maps", en: "Waze & Google Maps geolocation" },
      { es: "Código de vestimenta con paleta de colores", en: "Dress code with color palette" },
      { es: "Muro interactivo de buenos deseos", en: "Interactive well-wishes wall" },
      { es: "Galería fotográfica con vista ampliada", en: "Photo gallery with enlarged view" }
    ],
    demoPath: "/muestra/boda-camila-y-lucas"
  },
  {
    id: "muestra-cumple",
    slug: "cumple-valeria-15",
    title: "Valeria Sofía — Mis 15 Años",
    eventType: "15 Años & Quinceañera",
    subtitle: "Grand Ballroom Hotel Jaragua, Santo Domingo",
    image: quinceImage,
    features: [
      { es: "Paleta Rose Gold & Cristal", en: "Rose Gold & Crystal palette" },
      { es: "Música festiva y cuenta regresiva", en: "Festive music & countdown" },
      { es: "Código de vestimenta & Paleta sugerida", en: "Dress code & suggested palette" },
      { es: "Módulo de pases e invitados especiales", en: "Passes & special guests module" },
      { es: "Muro de felicitaciones y firmas", en: "Congratulations & signatures wall" },
      { es: "Geolocalización del salón de fiesta", en: "Ballroom geolocation" }
    ],
    demoPath: "/muestra/cumple-valeria-15"
  },
  {
    id: "muestra-empresarial",
    slug: "gala-anual-vitrexi",
    title: "Gala Anual de Innovación 2026",
    eventType: "Corporativo & Galas",
    subtitle: "El Embajador, A Royal Hideaway Hotel · Santo Domingo",
    image: corporateImage,
    features: [
      { es: "Diseño corporativo de alta sobriedad", en: "Refined corporate design" },
      { es: "Programa oficial & Ponentes estelares", en: "Official program & keynote speakers" },
      { es: "Confirmación de asistencia con QR de acceso", en: "RSVP with QR access pass" },
      { es: "Código de vestimenta Black Tie", en: "Black Tie dress code" },
      { es: "Instrucciones de parqueo y mapa", en: "Parking instructions & map" }
    ],
    demoPath: "/muestra/gala-anual-vitrexi"
  },
  {
    id: "muestra-baby-shower",
    slug: "baby-shower-mateo",
    title: "Bienvenida Mateo — Baby Shower",
    eventType: "Baby Shower",
    subtitle: "Terraza Privada Casa de Campo · La Romana",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Temática cálida botánica & crema", en: "Warm botanical & cream theme" },
      { es: "Mesa de obsequios & Wishlist de bebé", en: "Gift table & baby wishlist" },
      { es: "Confirmación RSVP para familiares", en: "RSVP confirmation for family" },
      { es: "Juegos y dinámicas de la recepción", en: "Reception games & activities" },
      { es: "Mapa e instrucciones de llegada", en: "Map & arrival instructions" }
    ],
    demoPath: "/muestra/baby-shower-mateo"
  },
  {
    id: "muestra-bautizo",
    slug: "bautizo-sofia-maria",
    title: "Bautizo & Recepción — Sofía María",
    eventType: "Bautizo & Comunión",
    subtitle: "Catedral Primada de América & Restaurante Pepperoni",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Estética celestial en tonos blanco y dorado", en: "Heavenly aesthetic in white & gold" },
      { es: "Detalles de ceremonia religiosa & padrinos", en: "Religious ceremony & godparents details" },
      { es: "Ubicación de iglesia y almuerzo", en: "Church & luncheon locations" },
      { es: "Confirmación de familiares e íntimos", en: "RSVP for family & close friends" }
    ],
    demoPath: "/muestra/bautizo-sofia-maria"
  },
  {
    id: "muestra-cumple-adulto",
    slug: "cumpleanos-50-roberto",
    title: "50 Años de Elegancia — Roberto Almanzar",
    eventType: "Cumpleaños de Adultos",
    subtitle: "Marina Casa de Campo · La Romana",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Estética refinada en tono azul noche y oro", en: "Refined midnight blue & gold aesthetic" },
      { es: "Confirmación de asistencia RSVP en vivo", en: "Live RSVP confirmation" },
      { es: "Sugerencia de código de vestir de gala", en: "Formal dress code suggestion" },
      { es: "Música y ambiente personalizado", en: "Custom music & ambiance" }
    ],
    demoPath: "/muestra/cumpleanos-50-roberto"
  },
  {
    id: "muestra-bridal-shower",
    slug: "bridal-shower-isabella",
    title: "Fiesta Blanca — Bridal Shower Isabella",
    eventType: "Bridal Shower",
    subtitle: "Punta Cana Resort & Club · Punta Cana",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Diseño contemporáneo blanco & champán", en: "Contemporary white & champagne design" },
      { es: "Lista de obsequios para el hogar", en: "Home gift wishlist" },
      { es: "Dress code total white", en: "All-white dress code" },
      { es: "Confirmación RSVP rápida vía WhatsApp", en: "Quick RSVP via WhatsApp" }
    ],
    demoPath: "/muestra/bridal-shower-isabella"
  },
  {
    id: "muestra-inauguracion",
    slug: "grand-opening-boutique",
    title: "Grand Opening — Boutique L'Élite",
    eventType: "Lanzamientos de Marca",
    subtitle: "Torre Empresarial Piantini · Santo Domingo",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Invitación ejecutiva VIP para personalidades", en: "Executive VIP invitation for dignitaries" },
      { es: "Código QR para acreditación en puerta", en: "QR code for door accreditation" },
      { es: "Agenda de inauguración & corte de cinta", en: "Opening agenda & ribbon cutting" },
      { es: "Ubicación y servicio de Valet Parking", en: "Location & valet parking service" }
    ],
    demoPath: "/muestra/grand-opening-boutique"
  }
];

/** Traducción de los tipos de evento para mostrar en las tarjetas. */
export const EVENT_TYPE_LABELS: Record<string, { es: string; en: string }> = {
  "Boda Luxury": { es: "Boda Luxury", en: "Luxury Wedding" },
  "15 Años & Quinceañera": { es: "15 Años & Quinceañera", en: "Sweet 15 & Quinceañera" },
  "Corporativo & Galas": { es: "Corporativo & Galas", en: "Corporate & Galas" },
  "Baby Shower": { es: "Baby Shower", en: "Baby Shower" },
  "Bautizo & Comunión": { es: "Bautizo & Comunión", en: "Baptism & Communion" },
  "Cumpleaños de Adultos": { es: "Cumpleaños de Adultos", en: "Adult Birthdays" },
  "Bridal Shower": { es: "Bridal Shower", en: "Bridal Shower" },
  "Lanzamientos de Marca": { es: "Lanzamientos de Marca", en: "Brand Launches" }
};
