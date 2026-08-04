import { useEffect } from "react";

/**
 * Hace que las secciones de una demo aparezcan suavemente al entrar en pantalla.
 *
 * Se resuelve sin tocar el JSX: al montar, busca los `<section id="...">` del
 * documento y los observa. Añadir un componente envolvente a cada sección de
 * una invitación de mil líneas sería mucho más frágil que esto.
 *
 * Tres cuidados deliberados:
 *
 * 1. **Nunca esconde contenido de forma permanente.** La clase que oculta sólo
 *    se aplica si `IntersectionObserver` existe. Sin él, todo se ve desde el
 *    principio.
 * 2. **El `<header>` del hero queda fuera** a propósito: la portada debe verse
 *    de inmediato, no aparecer con retardo.
 * 3. **Respeta `prefers-reduced-motion`.** La regla global de `index.css` anula
 *    la transición; el contenido sigue apareciendo, sólo que sin desplazamiento.
 */
export function useSectionReveal(): void {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (sections.length === 0) return;

    for (const section of sections) section.classList.add("reveal-section");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-section--visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    for (const section of sections) observer.observe(section);

    // Red de seguridad: si el observador existe pero no llega a disparar
    // (sección de altura cero, contenedor con overflow raro, un doble de
    // pruebas que no hace nada), a los 2 s se muestra todo igualmente.
    // Es preferible perder la animación a dejar la invitación en blanco.
    const failsafe = window.setTimeout(() => {
      for (const section of sections) section.classList.add("reveal-section--visible");
    }, 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
      // Si la demo se desmonta antes de tiempo, no dejamos nada oculto.
      for (const section of sections) {
        section.classList.remove("reveal-section", "reveal-section--visible");
      }
    };
  }, []);
}
