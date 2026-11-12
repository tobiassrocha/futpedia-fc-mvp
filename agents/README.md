# Agente 01 — Pesquisador Histórico

Agente em TypeScript executado manualmente no GitHub Actions. **Não publica matérias, cria commits nem abre PRs.**

## Fluxo
1. Pesquisa externa com a ferramenta `web_search` na Responses API.
2. Extrai URLs apenas das citações produzidas pela ferramenta.
3. Cria um dossiê estruturado em uma segunda chamada, sem acesso à web.
4. Valida todas as URLs contra as citações observadas, referência de cada afirmação e pelo menos dois domínios distintos.
5. Salva arquivos JSON e Markdown como artefatos para revisão humana (14 dias).

Esses testes **não atestam a veracidade do texto**. A fonte pode estar errada, não sustentar a afirmação ou replicar outra fonte. Os artigos históricos continuam exigindo checagem documental e aprovação editorial.

## Uso
Configure o secret `OPENAI_API_KEY` em **Settings → Secrets and variables → Actions**. Em **Actions → Historical research (manual) → Run workflow**, informe a pauta e baixe o artefato `historical-dossier`.

Rodar localmente com Node 22:
```sh
node --experimental-strip-types --test agents/researcher-core.test.ts
OPENAI_API_KEY=... TOPIC="História do Glória de Vacaria" node --experimental-strip-types agents/researcher.ts
```

Cada execução faz duas chamadas de modelo, com pesquisa web na primeira, podendo gerar múltiplas buscas tarifadas. Configure limites financeiros na plataforma da API. A assinatura ChatGPT não inclui uso gratuito da API.

Nenhuma chave é armazenada nos arquivos do repositório.
