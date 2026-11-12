# Futpedia FC — MVP

Portal dedicado a histórias, clubes, competições e estádios do futebol gaúcho.

## Stack

- Astro (HTML estático) + TypeScript
- GitHub Actions para checks e deploy
- GitHub Pages para hospedagem
- Nenhum banco de dados, CMS ou backend no MVP

## Desenvolvimento

```sh
npm install
npm run dev
npm run build
```

## Publicação

Após aprovar e integrar uma Pull Request na branch `main`, o workflow faz o build e publica no GitHub Pages. Em **Settings → Pages**, configurar **Source: GitHub Actions**. Até a configuração do domínio próprio, o projeto utiliza `/futpedia-fc-mvp/` como base.

## Conteúdo editorial

Os artigos vivem em `src/content/articles/*.md`, com metadados validados por `src/content.config.ts`. O Astro cria uma URL por arquivo usando `src/pages/historias/[slug].astro`.

Categorias aceitas: `editorial`, `historia`, `esquadroes`, `estadios`, `personagens`. Reportagens não editoriais exigem pelo menos uma fonte com URL para passar pelo schema; isso **não substitui uma verificação factual humana ou baseada em evidências**.

Campos principais:

```yaml
---
title: "Título da reportagem"
description: "Resumo detalhado para listagens e SEO com pelo menos 30 caracteres."
eyebrow: "HISTÓRIAS"
category: "historia"
publishedAt: "2026-11-12"
readingMinutes: 5
author: "Redação Futpedia FC"
demo: false
sources:
  - title: "Referência documental"
    url: "https://exemplo.org/fonte"
    publisher: "Fonte original"
---
```

É possível informar `cover` (caminho relativo à pasta `public/`), `coverAlt` e `coverCredit`. Toda capa deve ter alternativa textual. Imagens precisam ter direitos de uso verificados.

### Artigo demonstrativo

A página `/historias/por-que-preservar-a-memoria-do-futebol-gaucho/` valida o layout e o carregamento Markdown. É um manifesto editorial de demonstração, não uma reportagem histórica verificada.

Os agentes de IA e a publicação autônoma serão desenvolvidos em outra sprint.
