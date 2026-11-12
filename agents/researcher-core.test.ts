import {test} from 'node:test';
import assert from 'node:assert/strict';
import {citations,validate,toMarkdown} from './researcher-core.ts';
const urls=[{url:'https://www.fgf.com.br/origem',title:'FGF'},{url:'https://arquivo.example.org/pagina',title:'Acervo'}];
const dossier={topic:'História do futebol gaúcho',summary:'Resumo de demonstração que contém mais de sessenta caracteres para permitir validação do contrato.',
 sources:urls.map((s,i)=>({...s,id:'S'+(i+1),publisher:'Publicação'})),
 claims:[1,2,3].map((i)=>({statement:'Afirmação hipotética número '+i+' para teste.',source_ids:['S1','S2']})),
 timeline:[{period:'Década',description:'Evento hipotético sem valor histórico.',source_ids:['S1']}],
 unresolved:['Revisar dados'],editorial_notes:['Não publicar']};
test('extrai citações anotadas',()=>assert.equal(citations({output:[{content:[{annotations:[{type:'url_citation',...urls[0]}]}]}]}).length,1));
test('valida dossiê rastreável',()=>{assert.equal(validate(dossier,urls).claims.length,3);assert.match(toMarkdown(dossier),/revisão humana/)});
test('bloqueia URL alucinada',()=>{const x=structuredClone(dossier);x.sources[0].url='https://fake.invalid';assert.throws(()=>validate(x,urls),/não citada/)});
test('bloqueia afirmação sem fonte',()=>{const x=structuredClone(dossier);x.claims[0].source_ids=[];assert.throws(()=>validate(x,urls),/sem fonte/)});
test('exige dois domínios distintos',()=>{const x=structuredClone(dossier);x.sources[1].url='https://www.fgf.com.br/outra';assert.throws(()=>validate(x,[...urls,{url:x.sources[1].url,title:'FGF'}]),/domínios distintos/)});
