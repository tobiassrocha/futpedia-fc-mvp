import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(15).max(120),
    description: z.string().min(30).max(180),
    eyebrow: z.string().min(2).max(50),
    category: z.enum(['editorial', 'historia', 'esquadroes', 'estadios', 'personagens']),
    club: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingMinutes: z.number().int().positive(),
    author: z.string().default('Redação Futpedia FC'),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverCredit: z.string().optional(),
    demo: z.boolean().default(false),
    sources: z.array(z.object({
      title: z.string().min(3),
      url: z.string().url(),
      publisher: z.string().optional(),
    })).default([]),
  }).superRefine((data, ctx) => {
    if (data.category !== 'editorial' && data.sources.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Reportagens históricas exigem ao menos uma fonte verificável.',
        path: ['sources'],
      });
    }
    if (data.cover && !data.coverAlt) {
      ctx.addIssue({
        code: 'custom',
        message: 'A imagem de capa exige um texto alternativo.',
        path: ['coverAlt'],
      });
    }
  }),
});

export const collections = { articles };
