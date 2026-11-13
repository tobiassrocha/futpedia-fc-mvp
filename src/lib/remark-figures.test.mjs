import { test } from 'node:test';
import assert from 'node:assert/strict';
import remarkFigures, {figureMarkup,parseImageTitle} from './remark-figures.mjs';

const sample={type:'image',url:'/fotos/arquibancada.jpg',alt:'Arquibancada de um estádio',title:'Crédito: Fotógrafo autorizado | Licença: Autorização escrita | Legenda: Arquibancada em dia de jogo'};
test('transforms image to credited HTML figure',()=>{
 const root={type:'root',children:[{type:'paragraph',children:[sample]}]};
 remarkFigures()(root);
 assert.equal(root.children[0].type,'html');
 assert.match(root.children[0].value,/figcaption/);
 assert.match(root.children[0].value,/Fotógrafo autorizado/);
 assert.match(root.children[0].value,/Autorização escrita/);
});
test('rejects missing credit or license',()=>{
 assert.throws(()=>parseImageTitle('Crédito: Fotógrafo'),/Crédito e Licença/);
 assert.throws(()=>figureMarkup({...sample,title:null}),/sem crédito/);
});
test('escapes HTML in caption and alt',()=>{
 assert.match(figureMarkup({...sample,alt:'Fotografia <teste>',title:'Crédito: Autor | Licença: CC BY | Legenda: <script>'}),/&lt;script&gt;/);
});
test('blocks image inside mixed paragraph',()=>{
 const root={type:'root',children:[{type:'paragraph',children:[{type:'text',value:'A foto: '},sample]}]};
 assert.throws(()=>remarkFigures()(root),/parágrafos independentes/);
});
