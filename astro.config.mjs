// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// O site tem dois destinos: a Hostinger, na raiz de ardagh.maatz.com.br, e o
// GitHub Pages, num subcaminho do domínio da organização. A única coisa que
// muda entre eles é o par site+base — o workflow do Pages define as duas
// variáveis, o build local e o da Hostinger caem no padrão da raiz.
const site = (process.env.SITE_URL ?? 'https://ardagh.maatz.com.br').replace(/\/$/, '');
const base = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
  // Precisa ser absoluto para o sitemap e para o canonical do Base.astro.
  // src/data/site.ts lê este mesmo valor por import.meta.env.SITE.
  site,
  base,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
