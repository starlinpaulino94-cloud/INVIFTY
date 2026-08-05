import { PortfolioItem } from "../types";
import weddingImage from "../assets/images/wedding_couple_demo.webp";
import quinceImage from "../assets/images/quince_valeria_demo.webp";
import corporateImage from "../assets/images/gala_corporate_demo.webp";
import posterEditorial from "../assets/images/poster_editorial.svg";
import posterCelestial from "../assets/images/poster_celestial.svg";
import posterNeon from "../assets/images/poster_neon.svg";
import posterAurora from "../assets/images/poster_aurora.svg";

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
  /* ===== Colección original ===== */
  {
    id: "muestra-boda",
    slug: "boda-camila-y-lucas",
    title: "Camila & Lucas — Boda de Gala",
    eventType: "Boda Luxury",
    category: "boda",
    style: { es: "Black tie · Verde profundo, oro y nude", en: "Black tie · Deep green, gold & nude" },
    minimumPlan: "premium",
    subtitle: "Altos de Chavón, La Romana · Etiqueta Black Tie",
    image: weddingImage,
    features: [
      { es: "Portada de gala con cuenta regresiva y calendario", en: "Gala cover with countdown and calendar" },
      { es: "Historia de la pareja en línea de tiempo", en: "Couple’s story as a timeline" },
      { es: "Ceremonia y recepción con mapas directos", en: "Ceremony and reception with direct maps" },
      { es: "Itinerario completo: ceremonia, banquete y hora loca", en: "Full itinerary: ceremony, banquet and after-party" },
      { es: "Corte de honor y padrinos", en: "Bridal party and godparents" },
      { es: "Recomendaciones de hospedaje para invitados", en: "Lodging recommendations for guests" },
      { es: "Mesa de regalos bancaria con copia en un clic", en: "Bank gift registry with one-click copy" },
      { es: "Galería fotográfica con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "Muro interactivo de buenos deseos", en: "Interactive well-wishes wall" },
      { es: "RSVP con pases, menú, alergias y canción", en: "RSVP with passes, menu, allergies and song" }
    ],
    demoPath: "/muestra/boda-camila-y-lucas"
  },
  {
    id: "muestra-cumple",
    slug: "cumple-valeria-15",
    title: "Valeria Sofía — Mis 15 Años",
    eventType: "15 Años & Quinceañera",
    category: "quinceanera",
    style: { es: "Romántico · Coral, ciruela y oro", en: "Romantic · Coral, plum & gold" },
    minimumPlan: "premium",
    subtitle: "Grand Ballroom Hotel Jaragua, Santo Domingo",
    image: quinceImage,
    features: [
      { es: "Portada con retrato, monograma y cuenta regresiva", en: "Cover with portrait, monogram and countdown" }, 
      { es: "Programa de la noche paso a paso", en: "Step-by-step night programme" },
      { es: "Galería de fotos con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "Playlist colaborativa: pide tu canción", en: "Collaborative playlist: request your song" },
      { es: "Ubicación del salón con mapa y Waze", en: "Venue location with map and Waze" },
      { es: "Código de vestimenta con paleta sugerida", en: "Dress code with suggested palette" },
      { es: "Lluvia de sobres y mesa de regalos", en: "Gift registry and envelope shower" },
      { es: "Muro de felicitaciones y firmas", en: "Well-wishes and signature wall" },
      { es: "RSVP con pases, menú, alergias y canción", en: "RSVP with passes, menu, allergies and song" },
      { es: "Música de fondo e invitación bilingüe", en: "Background music and bilingual invitation" }
    ],
    demoPath: "/muestra/cumple-valeria-15"
  },
  {
    id: "muestra-empresarial",
    slug: "gala-anual-vitrexi",
    title: "Gala Anual de Innovación 2026",
    eventType: "Corporativo & Galas",
    category: "corporativo",
    style: { es: "Gala ejecutiva · Azul noche y oro", en: "Executive gala · Midnight blue & gold" },
    minimumPlan: "premium",
    subtitle: "El Embajador, A Royal Hideaway Hotel · Santo Domingo",
    image: corporateImage,
    features: [
      { es: "Portada ejecutiva con cuenta regresiva", en: "Executive cover with countdown" },
      { es: "Agenda oficial hora por hora", en: "Hour-by-hour official agenda" },
      { es: "Ponentes con retrato y tema de su charla", en: "Speakers with portrait and talk topic" },
      { es: "Pase QR personal con mesa asignada", en: "Personal QR pass with assigned table" },
      { es: "Ubicación con mapa, Google Maps y Waze", en: "Venue with map, Google Maps and Waze" },
      { es: "Dress code Black Tie con paleta de colores", en: "Black Tie dress code with colour palette" },
      { es: "Instrucciones de parqueo y valet", en: "Parking and valet instructions" },
      { es: "Galería de ediciones anteriores", en: "Gallery of past editions" },
      { es: "Registro con empresa, cargo, menú y acompañantes", en: "Registration with company, role, menu and companions" },
      { es: "Invitación bilingüe español / inglés", en: "Bilingual Spanish / English invitation" }
    ],
    demoPath: "/muestra/gala-anual-vitrexi"
  },
  {
    id: "muestra-baby-shower",
    slug: "baby-shower-mateo",
    title: "Bienvenida Mateo — Baby Shower",
    eventType: "Baby Shower",
    category: "baby-shower",
    style: { es: "Terracota suave · Nude, cacao y arena", en: "Soft terracotta · Nude, cocoa & sand" },
    minimumPlan: "premium",
    subtitle: "Terraza Privada Casa de Campo · La Romana",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Portada cálida con cuenta regresiva", en: "Warm cover with countdown" },
      { es: "Programa de la merienda hora por hora", en: "Hour-by-hour afternoon programme" },
      { es: "Ubicación con mapa, Google Maps y Waze", en: "Venue with map, Google Maps and Waze" },
      { es: "Juego de predicciones: peso y fecha de nacimiento", en: "Guessing game: weight and birth date" },
      { es: "Galería de la espera con vista ampliada", en: "Pregnancy gallery with lightbox" },
      { es: "Mesa de regalos con copia en un clic", en: "Gift registry with one-click copy" },
      { es: "Muro de amor para el bebé", en: "Wall of love for the baby" },
      { es: "Dress code con paleta de colores", en: "Dress code with colour palette" },
      { es: "RSVP con acompañantes, menú y alergias", en: "RSVP with guests, menu and allergies" }
    ],
    demoPath: "/muestra/baby-shower-mateo"
  },
  {
    id: "muestra-bautizo",
    slug: "bautizo-sofia-maria",
    title: "Bautizo & Recepción — Sofía María",
    eventType: "Bautizo & Comunión",
    category: "bautizo",
    style: { es: "Sacro sereno · Verde bosque y oro", en: "Serene sacred · Forest green & gold" },
    minimumPlan: "popular",
    subtitle: "Catedral Primada de América & Restaurante Pepperoni",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Portada sacra con cuenta regresiva", en: "Sacred cover with countdown" },
      { es: "Programa del día: misa, fotos y almuerzo", en: "Day programme: mass, photos and lunch" },
      { es: "Sección de padrinos de bautismo", en: "Baptism godparents section" },
      { es: "Dos sedes con mapa, Google Maps y Waze", en: "Two venues with map, Google Maps and Waze" },
      { es: "Dress code con paleta de colores", en: "Dress code with colour palette" },
      { es: "Galería de fotos con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "Cuenta de ahorro para el futuro del bebé", en: "Savings account for the baby’s future" },
      { es: "Muro de bendiciones para la familia", en: "Wall of blessings for the family" },
      { es: "RSVP con acompañantes, menú y alergias", en: "RSVP with guests, menu and allergies" }
    ],
    demoPath: "/muestra/bautizo-sofia-maria"
  },
  {
    id: "muestra-cumple-adulto",
    slug: "cumpleanos-50-roberto",
    title: "50 Años de Elegancia — Roberto Almanzar",
    eventType: "Cumpleaños de Adultos",
    category: "cumpleanos",
    style: { es: "Náutico elegante · Azul marino y oro", en: "Elegant nautical · Navy & gold" },
    minimumPlan: "popular",
    subtitle: "Marina Casa de Campo · La Romana",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Portada inmersiva con monograma y cuenta regresiva", en: "Immersive cover with monogram and countdown" },
      { es: "Homenaje: medio siglo contado en una cronología", en: "Tribute: half a century told as a timeline" },
      { es: "Programa de la velada hora por hora", en: "Hour-by-hour evening schedule" },
      { es: "Ubicación con mapa, Google Maps y Waze", en: "Venue with map, Google Maps and Waze" },
      { es: "Código de vestimenta con paleta de colores", en: "Dress code with colour palette" },
      { es: "Galería de fotos con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "Muro de brindis para dejar unas palabras", en: "Toast wall to leave a few words" },
      { es: "RSVP con acompañantes, menú, alergias y canción", en: "RSVP with guests, menu, allergies and song request" },
      { es: "Música de fondo y guardar la fecha en el calendario", en: "Background music and save-the-date" }
    ],
    demoPath: "/muestra/cumpleanos-50-roberto"
  },
  {
    id: "muestra-bridal-shower",
    slug: "bridal-shower-isabella",
    title: "Fiesta Blanca — Bridal Shower Isabella",
    eventType: "Bridal Shower",
    category: "bridal-shower",
    style: { es: "Fiesta blanca · Blanco, negro y bronce", en: "White party · White, black & bronze" },
    minimumPlan: "premium",
    subtitle: "Punta Cana Resort & Club · Punta Cana",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Portada inmersiva con cuenta regresiva", en: "Immersive cover with countdown" },
      { es: "Programa de la tarde hora por hora", en: "Hour-by-hour afternoon programme" },
      { es: "Dress code total white con paleta de colores", en: "Total-white dress code with colour palette" },
      { es: "Ubicación con mapa, Google Maps y Waze", en: "Venue with map, Google Maps and Waze" },
      { es: "Galería de fotos con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "Mesa de regalos con copia en un clic", en: "Gift registry with one-click copy" },
      { es: "Muro de mensajes para la novia", en: "Message wall for the bride" },
      { es: "RSVP con acompañantes, menú, alergias y canción", en: "RSVP with guests, menu, allergies and song" },
      { es: "Música de fondo y guardar la fecha", en: "Background music and save-the-date" }
    ],
    demoPath: "/muestra/bridal-shower-isabella"
  },
  {
    id: "muestra-inauguracion",
    slug: "grand-opening-boutique",
    title: "Grand Opening — Boutique L'Élite",
    eventType: "Lanzamientos de Marca",
    category: "apertura",
    style: { es: "Apertura premium · Negro y oro", en: "Premium opening · Black & gold" },
    minimumPlan: "premium",
    subtitle: "Torre Empresarial Piantini · Santo Domingo",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    features: [
      { es: "Portada premium con cuenta regresiva", en: "Premium cover with countdown" },
      { es: "Programa VIP: alfombra, corte de cinta y showcase", en: "VIP programme: carpet, ribbon cutting and showcase" },
      { es: "Beneficios exclusivos para invitadas", en: "Exclusive guest privileges" },
      { es: "Galería de la colección cápsula", en: "Capsule collection gallery" },
      { es: "Pase QR personal para acreditación en puerta", en: "Personal QR pass for door accreditation" },
      { es: "Ubicación con mapa, Waze y valet parking", en: "Venue with map, Waze and valet parking" },
      { es: "Dress code con paleta de colores", en: "Dress code with colour palette" },
      { es: "Acreditación con empresa, medio y acompañantes", en: "Accreditation with company, media and companions" },
      { es: "Invitación bilingüe español / inglés", en: "Bilingual Spanish / English invitation" }
    ],
    demoPath: "/muestra/grand-opening-boutique"
  },

  /* ===== Sistema de diseño Invifty · se muestran al final ===== */
  {
    id: "muestra-boda-editorial",
    slug: "boda-editorial-elena-gabriel",
    title: "Elena & Gabriel — Boda Editorial",
    eventType: "Boda Luxury",
    category: "boda",
    style: { es: "Editorial clásico · Marfil, negro y oro", en: "Classic editorial · Ivory, black & gold" },
    minimumPlan: "popular",
    subtitle: "Zona Colonial, Santo Domingo · Estilo Editorial Clásico",
    image: posterEditorial,
    features: [
      { es: "Apertura de sobre lacrado con sello dorado", en: "Sealed-envelope opening with gold wax seal" },
      { es: "Estética editorial en papel marfil y oro", en: "Editorial aesthetic in ivory paper and gold" },
      { es: "Ceremonia y recepción con mapas directos", en: "Ceremony and reception with direct maps" },
      { es: "Paleta de vestimenta sugerida", en: "Suggested attire palette" },
      { es: "Galería fotográfica con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "RSVP con pases, menú, alergias y canción", en: "RSVP with passes, menu, allergies and song" }
    ],
    demoPath: "/muestra/boda-editorial-elena-gabriel"
  },
  {
    id: "muestra-quince-celestial",
    slug: "quince-celestial-amara",
    title: "Amara Isabel — XV Celestial",
    eventType: "15 Años & Quinceañera",
    category: "quinceanera",
    style: { es: "Celestial · Azul noche y plata", en: "Celestial · Midnight blue & silver" },
    minimumPlan: "premium",
    subtitle: "Hotel Jaragua, Santo Domingo · Estilo Cielo Estrellado",
    image: posterCelestial,
    features: [
      { es: "Cielo nocturno con estrellas animadas", en: "Night sky with animated stars" },
      { es: "Tipografía imperial plateada", en: "Imperial silver typography" },
      { es: "Itinerario de la noche paso a paso", en: "Step-by-step night itinerary" },
      { es: "Dress code con paleta azul noche y plata", en: "Midnight blue and silver dress code" },
      { es: "Galería de fotos con vista ampliada", en: "Photo gallery with lightbox" },
      { es: "RSVP con pases, menú, alergias y canción", en: "RSVP with passes, menu, allergies and song" }
    ],
    demoPath: "/muestra/quince-celestial-amara"
  },
  {
    id: "muestra-neon-party",
    slug: "neon-party-marcos-40",
    title: "Marcos 40 — Neon Party",
    eventType: "Cumpleaños de Adultos",
    category: "cumpleanos",
    style: { es: "Neón eléctrico · Magenta y cian", en: "Electric neon · Magenta & cyan" },
    minimumPlan: "popular",
    subtitle: "Sky Lounge 27, Naco · Estilo Neón Eléctrico",
    image: posterNeon,
    features: [
      { es: "Portada neón con cuenta regresiva animada", en: "Neon cover with animated countdown" },
      { es: "Line-up de la noche: open bar, DJ y karaoke", en: "Night line-up: open bar, DJ and karaoke" },
      { es: "Dress code negro total con paleta neón", en: "All-black dress code with neon palette" },
      { es: "Ubicación con mapa, Google Maps y Waze", en: "Venue with map, Google Maps and Waze" },
      { es: "Galería de ediciones anteriores", en: "Gallery of previous editions" },
      { es: "Muro de mensajes para el anfitrión", en: "Message wall for the host" },
      { es: "RSVP con acompañantes, barra y canción", en: "RSVP with guests, bar and song request" },
      { es: "Música de fondo y guardar la fecha", en: "Background music and save-the-date" }
    ],
    demoPath: "/muestra/neon-party-marcos-40"
  },
  {
    id: "muestra-summit-aurora",
    slug: "summit-aurora-vitrexi",
    title: "Aurora Summit 2027 — Vitrexi",
    eventType: "Corporativo & Galas",
    category: "corporativo",
    style: { es: "Minimal corporativo · Violeta y gris", en: "Corporate minimal · Violet & grey" },
    minimumPlan: "premium",
    subtitle: "Centro de Convenciones · Estilo Minimal Corporativo",
    image: posterAurora,
    features: [
      { es: "Portada corporativa con cuenta regresiva", en: "Corporate cover with countdown" },
      { es: "Agenda del día hora por hora", en: "Hour-by-hour day agenda" },
      { es: "Ponentes destacados con su tema", en: "Featured speakers with their topic" },
      { es: "Pase QR con track asignado", en: "QR pass with assigned track" },
      { es: "Sede con mapa, Waze, dress code y parqueo", en: "Venue with map, Waze, dress code and parking" },
      { es: "Galería de ediciones anteriores", en: "Gallery of past editions" },
      { es: "Registro con empresa, cargo y track de interés", en: "Registration with company, role and track" },
      { es: "Invitación bilingüe español / inglés", en: "Bilingual Spanish / English invitation" }
    ],
    demoPath: "/muestra/summit-aurora-vitrexi"
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
