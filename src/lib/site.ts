export const base = import.meta.env.BASE_URL;
export const url = (path = '') => base + path.replace(/^\/+/, '');
export const stories = [
  { title: 'O futebol gaúcho tem histórias que merecem ser contadas', eyebrow: 'HISTÓRIAS DO FUTEBOL GAÚCHO', excerpt: 'Dos grandes estádios aos clubes do interior: um espaço para preservar a memória do nosso futebol.', href: 'historias/', visual: 'hero' },
  { title: 'Estádios que guardam gerações de histórias', eyebrow: 'ESTÁDIOS', excerpt: 'Arquibancadas, clubes e torcedores.', href: 'estadios/', visual: 'stadium' },
  { title: 'Campanhas e personagens inesquecíveis', eyebrow: 'ESQUADRÕES HISTÓRICOS', excerpt: 'Grandes equipes e conquistas.', href: 'historias/', visual: 'history' },
];
