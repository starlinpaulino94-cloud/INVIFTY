import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {prerenderRouteMetadata} from './scripts/prerender-plugin.mjs';

/**
 * Nombre base (sin hash) del recurso candidato a LCP.
 * Es la imagen de fondo del hero, que ocupa el viewport completo en la home.
 */
const LCP_IMAGE_BASENAME = 'invifty_hero_bg';

/**
 * Inserta un <link rel="preload"> para la imagen del hero.
 *
 * No puede escribirse a mano en index.html porque Vite añade un hash al nombre
 * del archivo en cada build. Este plugin busca el recurso ya emitido y compone
 * la etiqueta con su nombre definitivo.
 *
 * Se precarga SOLO esta imagen: precargar de más compite por ancho de banda con
 * el propio recurso LCP y empeora justo lo que se quiere mejorar.
 */
function preloadLcpImage(): Plugin {
  return {
    name: 'invifty-preload-lcp-image',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;

      const asset = Object.keys(ctx.bundle).find(
        (fileName) =>
          fileName.includes(LCP_IMAGE_BASENAME) && /\.(webp|avif|jpg|png)$/.test(fileName),
      );
      if (!asset) {
        // Si el hero cambia de nombre, es mejor avisar que precargar algo incorrecto.
        console.warn(
          `[invifty] No se encontró la imagen LCP "${LCP_IMAGE_BASENAME}"; no se insertó el preload.`,
        );
        return html;
      }

      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              href: `/${asset}`,
              type: 'image/webp',
              fetchpriority: 'high',
            },
            injectTo: 'head-prepend',
          },
        ],
      };
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      preloadLcpImage(),
      // Genera un index.html por ruta con sus propios metadatos, para que las
      // vistas previas de WhatsApp y los rastreadores sin JS los vean.
      prerenderRouteMetadata({
        siteUrl: (process.env.VITE_SITE_URL || 'https://invifty.com').replace(/\/+$/, ''),
      }) as Plugin,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
