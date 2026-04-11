// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import db from '@astrojs/db';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  integrations: [db()],

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
      name: "Ostend",
      cssVariable: "--font-onest"
    }
  ],
});