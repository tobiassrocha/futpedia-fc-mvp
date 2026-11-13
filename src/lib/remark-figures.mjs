// Imagens narrativas têm crédito e licença exibidos em <figcaption>.
function escapeHtml(value) {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
export function parseImageTitle(title) {
  if (!title) throw new Error('Imagem Markdown sem crédito e licença. Informe "Crédito: ... | Licença: ...".');
  const fields = Object.fromEntries(title.split('|').map((chunk) => {
    const i = chunk.indexOf(':');
    if (i < 0) throw new Error('Legenda de imagem inválida: '+title);
    return [chunk.slice(0,i).trim().toLowerCase(),chunk.slice(i+1).trim()];
  }));
  if (!fields['crédito'] || !fields['licença']) throw new Error('Imagem Markdown exige Crédito e Licença.');
  if (fields['crédito'].length < 3 || fields['licença'].length < 3) throw new Error('Crédito e Licença precisam ser explícitos.');
  return {credit:fields['crédito'],license:fields['licença'],caption:fields['legenda']||''};
}
export function figureMarkup(image) {
  if (!image.alt || image.alt.trim().length < 8) throw new Error('Imagem Markdown exige alt descritivo (mínimo 8 caracteres).');
  if (!image.url || /^\s*(?:javascript|data):/i.test(image.url)) throw new Error('URL da imagem não permitida.');
  const meta = parseImageTitle(image.title);
  const caption = meta.caption ? '<span class="figure-caption">'+escapeHtml(meta.caption)+' </span>' : '';
  return '<figure class="editorial-figure"><img src="'+escapeHtml(image.url)+'" alt="'+escapeHtml(image.alt)+'" loading="lazy" decoding="async" /><figcaption>'+caption+'<span class="figure-credit">Foto: '+escapeHtml(meta.credit)+' · '+escapeHtml(meta.license)+'</span></figcaption></figure>';
}
export default function remarkFigures() {
  return (tree) => {
    function visit(node) {
      if (!Array.isArray(node.children)) return;
      for (let i=0;i<node.children.length;i++) {
        const child = node.children[i];
        if (child.type === 'paragraph' && child.children?.length === 1 && child.children[0].type === 'image') {
          node.children[i] = {type:'html',value:figureMarkup(child.children[0])};
        } else {
          // HTML cru pode contornar a validação de crédito: bloqueá-lo.
          if (child.type === 'html' && /<\s*(?:img|picture)\b/i.test(child.value || '')) {
            throw new Error('Imagens HTML não são permitidas. Use Markdown com Crédito e Licença.');
          }
          if (child.type === 'image') throw new Error('Coloque fotografias em parágrafos independentes.');
          visit(child);
        }
      }
    }
    visit(tree);
  };
}
