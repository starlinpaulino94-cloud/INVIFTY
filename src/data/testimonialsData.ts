import { Testimonial } from "../types";

/**
 * TESTIMONIOS DE CLIENTES DE INVIFTY
 * ===================================
 * NOTA DE DESARROLLO: Estos testimonios son ilustrativos para la fase de lanzamiento
 * y se muestran en el sitio etiquetados como "Historia Ilustrativa".
 * Cuando tengas testimonios reales de parejas y clientes, edita este archivo
 * y cambia isProvisionalNotice a false para que se muestren como "Cliente Invifty".
 */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Isabella & Carlos M.",
    eventType: "Boda Luxury",
    location: "Miami, FL",
    comment: "A nuestros invitados les fascinó la invitación. La confirmación por WhatsApp nos ahorró días enteros organizando las mesas. El equipo de Invifty entregó todo impecable en menos de 48 horas.",
    rating: 5,
    date: "Junio 2026",
    isProvisionalNotice: true
  },
  {
    id: "2",
    name: "Dra. Patricia Reyes",
    eventType: "15 Años de su hija Paola",
    location: "Madrid, España",
    comment: "La calidad visual supera por mucho cualquier PDF o tarjeta tradicional. La música de fondo y el mapa interactivo le dieron el toque sofisticado que queríamos para los 15 de mi hija.",
    rating: 5,
    date: "Mayo 2026",
    isProvisionalNotice: true
  },
  {
    id: "3",
    name: "Lic. Roberto Almanzar",
    eventType: "Cena de Gala Empresarial",
    location: "Ciudad de México",
    comment: "Usamos el plan Premium para nuestra gala corporativa anual de 350 personas. El registro de invitados funcionó perfecto y dio una imagen de altísimo profesionalismo a nuestra empresa.",
    rating: 5,
    date: "Abril 2026",
    isProvisionalNotice: true
  }
];
