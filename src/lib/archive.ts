import { getCollection, type CollectionEntry } from 'astro:content';
export type Article = CollectionEntry<'articles'>;
export type Club = CollectionEntry<'clubs'>;

// A aprovação editorial determina quais artigos são sugeridos, e em qual ordem.
// Não substituímos isso por conteúdos recentes ou por correspondência de palavras.
export async function getArchive() {
  const [articles, clubs] = await Promise.all([getCollection('articles'), getCollection('clubs')]);
  const articleIds = new Set(articles.map((item) => item.id));
  const clubIds = new Set(clubs.map((item) => item.id));
  for (const article of articles) {
    for (const id of article.data.relatedArticles) {
      if (!articleIds.has(id)) throw new Error('Artigo ' + article.id + ': relação inexistente ' + id);
      if (id === article.id) throw new Error('Artigo ' + article.id + ': autorreferência proibida');
    }
    for (const id of article.data.clubs) {
      if (!clubIds.has(id)) throw new Error('Artigo ' + article.id + ': clube inexistente ' + id);
    }
    const unique = new Set(article.data.relatedArticles);
    if (unique.size !== article.data.relatedArticles.length) throw new Error('Artigo ' + article.id + ': links relacionados duplicados');
  }
  for (const club of clubs) {
    for (const id of club.data.relatedArticles) {
      if (!articleIds.has(id)) throw new Error('Clube ' + club.id + ': artigo relacionado inexistente ' + id);
    }
    if (new Set(club.data.relatedArticles).size !== club.data.relatedArticles.length) {
      throw new Error('Clube ' + club.id + ': artigos relacionados duplicados');
    }
  }
  return { articles, clubs };
}
export function relatedEditorially(article: Article, articles: Article[]): Article[] {
  const indexed = new Map(articles.map((item) => [item.id, item]));
  return article.data.relatedArticles.map((id) => indexed.get(id)!).filter(Boolean);
}
