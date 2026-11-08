// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// URLs iguais as do site antigo: /index.html, /catalogo.html, /peca/<slug>.html
export default defineConfig({
  site: 'https://izzatcarimports.com.br',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
