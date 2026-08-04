import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // El CSS de Tailwind no aporta nada a las aserciones y ralentiza el arranque.
    css: false,
    // Las pruebas de las muestras rellenan formularios con userEvent, que
    // teclea carácter a carácter. Con el límite de 5 s por defecto fallaban por
    // tiempo, no por lógica.
    testTimeout: 20000,
  },
});
