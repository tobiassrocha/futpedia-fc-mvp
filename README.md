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

## Conteúdo
As manchetes e elementos visuais iniciais são demonstrativos. Não são notícias publicadas ou fotografias históricas licenciadas. O motor editorial de agentes será uma entrega posterior.
