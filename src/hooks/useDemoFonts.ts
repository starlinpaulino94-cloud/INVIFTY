import { useEffect } from "react";
import { loadDemoFonts } from "../utils/demoFonts";

/**
 * Pide las fuentes tipográficas propias de las demos al montarse el componente.
 *
 * Úsalo en cualquier demo que aplique `font-serif-display` (Cinzel),
 * `font-cormorant` (Cormorant Garamond) o `font-script` (Alex Brush).
 */
export function useDemoFonts(): void {
  useEffect(() => {
    loadDemoFonts();
  }, []);
}
