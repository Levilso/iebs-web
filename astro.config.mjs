// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import db from '@astrojs/db';

import netlify from '@astrojs/netlify';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["preact"] // Evita múltiples instancias de Preact
    },
    optimizeDeps: {
      include: ["preact", "preact/hooks"] // Asegura que Preact se optimice correctamente
    }
  },

  integrations: [db(), preact()],

  adapter: netlify(),

  // astro.config.mjs
  fonts: [
    { provider: fontProviders.fontshare(), name: "Satoshi", cssVariable: "--font-heading", weights: ["300 800"] },
    { provider: fontProviders.fontshare(), name: "General Sans", cssVariable: "--font-body" },
    { provider: fontProviders.fontsource(), name: "Libre Baskerville", cssVariable: "--font-reading" },
    { provider: fontProviders.fontsource(), name: "Inter", cssVariable: "--font-admin" },
  ],
});