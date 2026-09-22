// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Precisa ser absoluto para o sitemap e para o canonical do Base.astro.
  // Mesmo valor de SITE_URL em src/data/site.ts — os dois andam juntos.
  site: 'https://ardagh.maatz.com.br',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
