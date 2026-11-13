import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const source = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  publisher: z.string().optional(),
});
const imageCredit = z.object({
  src: z.string().min(1),
  alt: z.string().min(8),
  credit: z.string().min(3),
  license: z.string().min(3),
});
const articleSchema = z.object({
  title: z.string().min(15).max(120),
  description: z.string().min(30).max(180),
  eyebrow: z.string().min(2).max(50),
  category: z.enum(['editorial', 'historia', 'esquadroes', 'estadios', 'personagens', 'rivalidades']),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  readingMinutes: z.number().int().positive(),
  author: z.string().default('Redação Futpedia FC'),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  coverCredit: z.string().optional(),
  coverLicense: z.string().optional(),
  gallery: z.array(imageCredit).default([]),
  clubs: z.array(z.string()).default([]),
  stadiums: z.array(z.string()).default([]),
  relatedArticles: z.array(z.string()).default([]),
  demo: z.boolean().default(false),
  sources: z.array(source).default([]),
}).superRefine((data, ctx) => {
  if (!data.demo && data.category !== 'editorial' && data.sources.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Reportagem histórica exige fontes documentais.', path: ['sources'] });
  }
  if (data.cover && (!data.coverAlt || !data.coverCredit || !data.coverLicense)) {
    ctx.addIssue({ code: 'custom', message: 'A capa exige texto alternativo, crédito e licença/autorização.', path: ['cover'] });
  }
  if (!data.cover && (data.coverAlt || data.coverCredit || data.coverLicense)) {
    ctx.addIssue({ code: 'custom', message: 'Metadados de capa sem imagem.', path: ['cover'] });
  }
});
const clubSchema = z.object({
  name: z.string().min(3),
  city: z.string().min(2),
  description: z.string().min(25),
  founded: z.string().optional(),
  stadiums: z.array(z.string()).default([]),
  relatedArticles: z.array(z.string()).default([]),
  sources: z.array(source).default([]),
  demo: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (!data.demo && data.sources.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Perfil histórico publicado exige fontes.', path: ['sources'] });
  }
});
export const collections = {
  articles: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/articles' }), schema: articleSchema }),
  clubs: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/clubs' }), schema: clubSchema }),
};
