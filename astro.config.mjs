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

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "DM Serif Display",
      cssVariable: "--font-DMSerifDisplay"
    },
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter"
    },
    {
      provider: fontProviders.fontsource(),
      name: "Onest",
      cssVariable: "--font-onest"
    }
  ],
});