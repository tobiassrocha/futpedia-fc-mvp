import { defineConfig } from 'astro/config';
import remarkFigures from './src/lib/remark-figures.mjs';

export default defineConfig({
  site: 'https://tobiassrocha.github.io',
  base: '/futpedia-fc-mvp',
  output: 'static',
  trailingSlash: 'always',
  markdown: { remarkPlugins: [remarkFigures] },
});
