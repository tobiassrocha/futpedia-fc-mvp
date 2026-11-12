export type Citation = {url:string; title:string};
export type Source = Citation & {id:string;publisher:string};
export type Fact = {statement:string;source_ids:string[]};
export type Dossier = {topic:string;summary:string;sources:Source[];claims:Fact[];timeline:{period:string;description:string;source_ids:string[]}[];unresolved:string[];editorial_notes:string[]};
export function canonical(input:string):string {
 const u=new URL(input);
 if(!['http:','https:'].includes(u.protocol))throw Error('URL inválida');
 u.hash='';return u.toString().replace(/\/$/,'');
}
export function citations(response:any):Citation[]{
 const seen=new Map<string,Citation>();
 for(const item of response?.output??[])for(const part of item?.content??[])for(const a of part?.annotations??[]){
   if(a.type!=='url_citation'||!a.url)continue;
   try{const u=canonical(a.url);seen.set(u,{url:u,title:a.title||u});}catch{}
 }
 return [...seen.values()];
}
export function outputText(response:any):string{
 return (response?.output??[]).flatMap((x:any)=>x.content??[]).filter((c:any)=>c.type==='output_text').map((c:any)=>c.text??'').join('\n').trim();
}
export function validate(data:Dossier, citationsList:Citation[]):Dossier{
 const good=(v:unknown,n=1)=>typeof v==='string'&&v.trim().length>=n;
 if(!data||!good(data.topic,10)||!good(data.summary,60))throw Error('Tema ou resumo incompleto');
 if(!Array.isArray(data.sources)||!Array.isArray(data.claims)||!Array.isArray(data.timeline)||!Array.isArray(data.unresolved)||!Array.isArray(data.editorial_notes))throw Error('Estrutura incompleta');
 const allowed=new Set(citationsList.map(c=>canonical(c.url)));const ids=new Set<string>();const hosts=new Set<string>();
 for(const s of data.sources){
  if(!good(s.id)||!good(s.title)||!good(s.publisher))throw Error('Fonte incompleta');
  const u=canonical(s.url);
  if(!allowed.has(u))throw Error('Fonte não citada pela pesquisa: '+u);
  if(ids.has(s.id))throw Error('ID duplicado');
  ids.add(s.id);hosts.add(new URL(u).hostname.replace(/^www\./,''));
 }
 if(ids.size<2||hosts.size<2)throw Error('Pesquisa exige duas fontes de domínios distintos');
 const refs=(list:unknown)=>{if(!Array.isArray(list)||!list.length||list.some(id=>!ids.has(id)))throw Error('Afirmação sem fonte válida')};
 if(data.claims.length<3)throw Error('Menos de três afirmações');
 for(const c of data.claims){if(!good(c.statement,15))throw Error('Afirmação curta');refs(c.source_ids)}
 for(const e of data.timeline){if(!good(e.period)||!good(e.description,10))throw Error('Cronologia inválida');refs(e.source_ids)}
 if(data.unresolved.some(x=>!good(x))||data.editorial_notes.some(x=>!good(x)))throw Error('Notas inválidas');
 return data;
}
export function toMarkdown(d:Dossier):string{
 const source=new Map(d.sources.map(s=>[s.id,s]));
 const links=(ids:string[])=>ids.map(id=>{const s=source.get(id)!;return '['+id+']('+s.url+')'}).join(', ');
 return ['# Dossiê: '+d.topic,'','> PESQUISA PRELIMINAR — revisão humana obrigatória. Não publicar.','','## Resumo',d.summary,'','## Afirmações',...d.claims.map(c=>'- '+c.statement+' ('+links(c.source_ids)+')'),'','## Cronologia',...d.timeline.map(e=>'- **'+e.period+'** — '+e.description+' ('+links(e.source_ids)+')'),'','## Lacunas',...d.unresolved.map(x=>'- '+x),'','## Notas editoriais',...d.editorial_notes.map(x=>'- '+x),'','## Fontes',...d.sources.map(s=>'- '+s.id+': ['+s.title+']('+s.url+') — '+s.publisher),''].join('\n');
}
