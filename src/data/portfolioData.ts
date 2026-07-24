import { PortfolioItem } from "../types";
import weddingImage from "../assets/images/wedding_couple_demo_1784839858272.jpg";
import quinceImage from "../assets/images/quince_valeria_demo_1784839868480.jpg";
import corporateImage from "../assets/images/gala_corporate_demo_1784839877907.jpg";

/**
 * COLECCIÓN EDITORIAL DE TRABAJOS Y PLANTILLAS MODELO
 * ====================================================
 * Invifty abarca todo tipo de invitaciones para eventos de alto nivel:
 * Bodas, 15 Años, Eventos Corporativos, Baby Showers, Bautizos,
 * Cumpleaños de Adultos, Despedidas de Soltera y Lanzamientos.
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
      "Reloj regresivo & Guardar en Calendario",
      "Sinfonía romántica de fondo interactiva",
      "Confirmación RSVP con asignación de pases",
      "Línea de tiempo & Historia de Amor",
      "Itinerario de ceremonia, banquete y hora loca",
      "Mesa de regalos bancaria & Zelle (Copia en 1-clic)",
      "Geolocalización Waze & Google Maps",
      "Código de vestimenta con paleta de colores",
      "Muro interactivo de buenos deseos",
      "Galería fotográfica con vista ampliada"
    ],
    demoPath: "/muestra/boda-camila-y-lucas",
    isRealClient: true
  },
  {
    id: "muestra-cumple",
    slug: "cumple-valeria-15",
    title: "Valeria Sofía — Mis 15 Años",
    eventType: "15 Años & Quinceañera",
    subtitle: "Grand Ballroom Hotel Jaragua, Santo Domingo",
    image: quinceImage,
    features: [
      "Paleta Rose Gold & Cristal",
      "Música festiva y cuenta regresiva",
      "Código de vestimenta & Paleta sugerida",
      "Módulo de pases e invitados especiales",
      "Muro de felicitaciones y firmas",
      "Geolocalización del salón de fiesta"
    ],
    demoPath: "/muestra/cumple-valeria-15",
    isRealClient: true
  },
  {
    id: "muestra-empresarial",
    slug: "gala-anual-vitrexi",
    title: "Gala Anual de Innovación 2026",
    eventType: "Corporativo & Galas",
    subtitle: "El Embajador, A Royal Hideaway Hotel · Santo Domingo",
    image: corporateImage,
    features: [
      "Diseño corporativo de alta sobriedad",
      "Programa oficial & Ponentes estelares",
      "Confirmación de asistencia con QR de acceso",
      "Código de vestimenta Black Tie",
      "Instrucciones de parqueo y mapa"
    ],
    demoPath: "/muestra/gala-anual-vitrexi",
    isRealClient: true
  },
  {
    id: "muestra-baby-shower",
    slug: "baby-shower-mateo",
    title: "Bienvenida Mateo — Baby Shower",
    eventType: "Baby Shower",
    subtitle: "Terraza Privada Casa de Campo · La Romana",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    features: [
      "Temática cálida botánica & crema",
      "Mesa de obsequios & Wishlist de bebé",
      "Confirmación RSVP para familiares",
      "Juegos y dinámicas de la recepción",
      "Mapa e instrucciones de llegada"
    ],
    demoPath: "/muestra/baby-shower-mateo",
    isRealClient: true
  },
  {
    id: "muestra-bautizo",
    slug: "bautizo-sofia-maria",
    title: "Bautizo & Recepción — Sofía María",
    eventType: "Bautizo & Comunión",
    subtitle: "Catedral Primada de América & Restaurante Pepperoni",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
    features: [
      "Estética celestial en tonos blanco y dorado",
      "Detalles de ceremonia religiosa & padrinos",
      "Ubicación de iglesia y almuerzo",
      "Confirmación de familiares e íntimos"
    ],
    demoPath: "/muestra/bautizo-sofia-maria",
    isRealClient: true
  },
  {
    id: "muestra-cumple-adulto",
    slug: "cumpleanos-50-roberto",
    title: "50 Años de Elegancia — Roberto Almanzar",
    eventType: "Cumpleaños de Adultos",
    subtitle: "Marina Casa de Campo · La Romana",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    features: [
      "Estética refinada en tono azul noche y oro",
      "Confirmación de asistencia RSVP en vivo",
      "Sugerencia de código de vestir de gala",
      "Música y ambiente personalizado"
    ],
    demoPath: "/muestra/cumpleanos-50-roberto",
    isRealClient: true
  },
  {
    id: "muestra-bridal-shower",
    slug: "bridal-shower-isabella",
    title: "Fiesta Blanca — Bridal Shower Isabella",
    eventType: "Bridal Shower",
    subtitle: "Punta Cana Resort & Club · Punta Cana",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
    features: [
      "Diseño contemporáneo blanco & champán",
      "Lista de obsequios para el hogar",
      "Dress code total white",
      "Confirmación RSVP rápida vía WhatsApp"
    ],
    demoPath: "/muestra/bridal-shower-isabella",
    isRealClient: true
  },
  {
    id: "muestra-inauguracion",
    slug: "grand-opening-boutique",
    title: "Grand Opening — Boutique L'Élite",
    eventType: "Lanzamientos de Marca",
    subtitle: "Torre Empresarial Piantini · Santo Domingo",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    features: [
      "Invitación ejecutiva VIP para personalidades",
      "Código QR para acreditación en puerta",
      "Agenda de inauguración & corte de cinta",
      "Ubicación y servicio de Valet Parking"
    ],
    demoPath: "/muestra/grand-opening-boutique",
    isRealClient: true
  }
];
