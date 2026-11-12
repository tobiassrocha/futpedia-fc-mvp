import {mkdir,writeFile} from 'node:fs/promises';
import {citations,outputText,validate,toMarkdown,type Dossier} from './researcher-core.ts';
const topic=(process.env.TOPIC||process.argv.slice(2).join(' ')).trim();
const key=process.env.OPENAI_API_KEY;
const model=process.env.OPENAI_MODEL||'gpt-5.4-mini';
const schema={
 type:'object',additionalProperties:false,
 properties:{
  topic:{type:'string'},summary:{type:'string'},
  sources:{type:'array',items:{type:'object',additionalProperties:false,properties:{id:{type:'string'},title:{type:'string'},url:{type:'string'},publisher:{type:'string'}},required:['id','title','url','publisher']}},
  claims:{type:'array',items:{type:'object',additionalProperties:false,properties:{statement:{type:'string'},source_ids:{type:'array',items:{type:'string'}}},required:['statement','source_ids']}},
  timeline:{type:'array',items:{type:'object',additionalProperties:false,properties:{period:{type:'string'},description:{type:'string'},source_ids:{type:'array',items:{type:'string'}}},required:['period','description','source_ids']}},
  unresolved:{type:'array',items:{type:'string'}},editorial_notes:{type:'array',items:{type:'string'}}
 },required:['topic','summary','sources','claims','timeline','unresolved','editorial_notes']
};
async function call(body:object):Promise<any>{
 const ac=new AbortController();const timer=setTimeout(()=>ac.abort(),120000);
 try{
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body),signal:ac.signal});
  if(!r.ok)throw Error('API OpenAI HTTP '+r.status);
  return await r.json();
 }finally{clearTimeout(timer)}
}
async function main(){
 if(topic.length<10||topic.length>160||/[\r\n]/.test(topic))throw Error('Pauta deve ter entre 10 e 160 caracteres em uma linha');
 if(!key)throw Error('Configure OPENAI_API_KEY em Actions secrets');
 console.log('Pesquisando: '+topic);
 const search=await call({model,tools:[{type:'web_search'}],tool_choice:'required',max_output_tokens:2500,
  instructions:'Pesquise documentos sobre futebol gaúcho com web_search. Priorize FGF, clubes, acervos históricos e imprensa regional. Retorne notas em português e cite URLs reais. Informe incertezas. Não invente resultados, datas ou personagens.',
  input:'Investigue a pauta: '+topic+'. Forneça resumo factual com referências e eventuais divergências.'});
 const sources=citations(search), notes=outputText(search);
 if(sources.length<2||notes.length<120)throw Error('Pesquisa sem evidências citáveis suficientes');
 const synthesis=await call({model,max_output_tokens:3500,
  text:{format:{type:'json_schema',name:'historical_dossier',strict:true,schema}},
  instructions:'Produza apenas o JSON exigido. Use exclusivamente fatos sustentados pelas notas e URLs exatamente iguais às fontes autorizadas. Cada afirmação ou evento deve referenciar IDs existentes. Lacunas devem ir a unresolved. Este é um dossiê preliminar, NÃO uma notícia verificada.',
  input:JSON.stringify({topic,notes,authorized_sources:sources})});
 const output=outputText(synthesis);
 if(!output)throw Error('Síntese vazia');
 const dossier=validate(JSON.parse(output) as Dossier,sources);
 await mkdir('research-output',{recursive:true});
 const stamp=new Date().toISOString().replace(/[:.]/g,'-');
 await Promise.all([
  writeFile('research-output/'+stamp+'.json',JSON.stringify({dossier,metadata:{model,generated_at:new Date().toISOString(),status:'human_review_required'}},null,2)),
  writeFile('research-output/'+stamp+'.md',toMarkdown(dossier))
 ]);
 console.log('Dossiê gerado para revisão humana; nada foi publicado.');
}
main().catch((e:unknown)=>{console.error('Pesquisa bloqueada:',e instanceof Error?e.message:'Erro desconhecido');process.exitCode=1});
