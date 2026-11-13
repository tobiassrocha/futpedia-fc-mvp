# Arquitetura editorial — Futpedia FC

## Compromissos

- Markdown + Astro, sem banco de dados nem API paga.
- URLs de clubes permanentes, independentes da divisão por temporada.
- Publicação depende de pesquisa, revisão e fontes verificáveis.
- Toda fotografia necessita **crédito e licença/autorização**, mostrados ao leitor.
- A seção "Continue explorando" mostra somente artigos presentes em `relatedArticles`, na ordem definida pelo editor.
- Links contextuais dentro da narrativa são adicionados pelo editor, não por algoritmo.
- Os três clubes pilotos estão identificados como demonstração e não são perfis históricos publicados.

## Clubes

Criar `src/content/clubs/slug-estavel.md`:

```yaml
---
name: "Nome do clube"
city: "Cidade"
description: "Resumo factual e verificável com pelo menos 25 caracteres."
demo: false
stadiums: []
relatedArticles: []
sources:
  - title: "Documento ou acervo"
    url: "https://exemplo.org/fonte"
---
```

A divisão de uma temporada deve ser representada futuramente em cadastro separado, não na identidade do clube.

## Reportagens

Criar `src/content/articles/slug-da-materia.md`:

```yaml
---
title: "Uma história bem apurada do futebol gaúcho"
description: "Resumo editorial que orienta o leitor e apresenta claramente o assunto."
eyebrow: "HISTÓRIA"
category: "historia"
publishedAt: "2026-11-13"
readingMinutes: 8
clubs: ["brasil-de-pelotas"]
relatedArticles: []
sources:
  - title: "Fonte documental"
    url: "https://exemplo.org/documento"
---
```

Os IDs em `clubs` e `relatedArticles` precisam existir: `getArchive()` bloqueia o build em referências inválidas. A ordem de `relatedArticles` é editorial.

## Fotografias entre parágrafos

Usar Markdown em parágrafo separado, com caminho **relativo à página**, para funcionar tanto no subcaminho atual do GitHub Pages quanto no domínio definitivo:

```md
![Arquibancada histórica de um estádio](../../images/arquibancada.jpg "Crédito: Nome do fotógrafo | Licença: Autorização escrita | Legenda: Arquibancada registrada durante um jogo.")
```

O plugin converte em figura HTML com legenda e crédito visíveis. O build bloqueia imagem Markdown sem `Crédito` e `Licença`, e bloqueia imagens HTML cruas. Não inventar licenças: verificar e registrar os direitos antes de usar fotos reais.

### Capa e galeria de apoio

A capa exige `cover`, `coverAlt`, `coverCredit`, `coverLicense` no frontmatter. O caminho `cover` é relativo à pasta `public` e é ajustado pelo Astro. A galeria opcional aceita `gallery` com `src`, `alt`, `credit` e `license`; a galeria aparece depois da narrativa, enquanto as imagens Markdown aparecem **no local exato da história**.

## Sumário e conteúdo relacionado

O sumário vem dos títulos de segundo nível (`##`). Desktop: lateral; mobile: recolhível no começo. Links contextuais no corpo utilizam Markdown:

```md
Leia a história do [clube](../../clubes/brasil-de-pelotas/).
```

Em artigo `/historias/slug/`, essa referência funciona no GitHub Pages e no futuro domínio oficial. A validação atual cobre IDs de relacionamento em metadados, **não todos os links arbitrários do texto**.

## Fora desta PR

- Fotografias reais: precisam de crédito e autorização.
- Histórias apuradas dos clubes pilotos.
- Cadastro dos 38 clubes e participações sazonais.
- Domínio definitivo, em preparação na PR #4.
- APIs de IA e automação editorial.

## Fontes internas de produção × apresentação pública

- Guardar os registros documentais em `sources` e em dossiês de pesquisa: são instrumentos da equipe editorial.
- **Não exibir a lista bibliográfica no final das páginas de clubes ou reportagens.** Portal de futebol, não bibliografia acadêmica.
- Links dentro das narrativas devem ampliar a exploração **dentro da Futpedia FC**, quando existirem artigos relevantes publicados. Não criar atalhos genéricos ou autolinks para preencher a exigência.
- Créditos das fotografias, citações e materiais de terceiros permanecem visíveis conforme os respectivos direitos, independentemente da bibliografia privada.
