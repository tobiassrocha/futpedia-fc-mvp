# Domínio oficial da Futpedia FC

Domínio canônico: **https://futpediafc.com.br**.

O portal continua hospedado gratuitamente no GitHub Pages e publicado pelo GitHub Actions. As configurações de DNS são administradas no Registro.br.

## Ordem segura de ativação

1. **Antes de integrar esta PR**, abra o Registro.br e confirme que os nameservers do domínio utilizam o DNS do Registro.br. Caso use outro serviço, configure os registros no DNS autoritativo em uso.
2. Em GitHub → repositório → Settings → Pages → Custom domain, informe `futpediafc.com.br` e salve **antes de apontar o DNS**, conforme a recomendação de segurança do GitHub. A opção Source continua como **GitHub Actions**. O workflow de deploy **não depende de arquivo CNAME**.
3. No editor avançado da zona DNS do Registro.br, crie os registros A abaixo para a raiz do domínio (campo nome vazio ou `@`, conforme o painel). Não inclua entradas A conflitantes.
4. Crie um registro CNAME para `www` apontando para `tobiassrocha.github.io` (sem o nome do repositório).
5. Aguarde a propagação e confira os apontamentos.
6. Integre esta PR após o DNS e a configuração do domínio no GitHub estarem prontos. O build passará a gerar rotas na raiz, não em `/futpedia-fc-mvp/`.
7. Depois do deploy, confirme homepage e páginas internas em `https://futpediafc.com.br/`, configure **Enforce HTTPS** quando disponível e confira redirecionamento de `www` para o domínio canônico.
8. Somente após a publicação estável, implemente Search Console, sitemap, analytics e divulgação pública.

### Registros IPv4 oficiais do GitHub Pages

| Tipo | Nome/host | Valor |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | tobiassrocha.github.io |

Os registros `AAAA` (IPv6) são opcionais. Caso sejam configurados, use os endereços oficiais descritos na documentação do GitHub Pages, sem manter entradas conflitantes.

No Registro.br o nome para o domínio raiz pode aparecer como campo vazio, em vez de `@`.

**Cuidado:** não crie registro CNAME no domínio raiz; utilize A. Evite registros DNS wildcard. O domínio adicional e a opção de HTTPS são administrados no GitHub Pages, não no repositório.

## Por que não criar CNAME em public/

Com o GitHub Pages publicado via workflow GitHub Actions, o arquivo `CNAME` não é necessário. A configuração é feita em **Settings → Pages → Custom domain**.

## Verificações sugeridas

```sh
dig futpediafc.com.br A +short
dig www.futpediafc.com.br CNAME +short
```

Confirme a publicação e o certificado HTTPS com o navegador; a propagação de DNS e a emissão do certificado podem levar algum tempo.

### Referências

- [GitHub: configurar domínio personalizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Astro: deploy no GitHub Pages](https://docs.astro.build/pt-br/guides/deploy/github/)
- [Registro.br: serviço DNS autoritativo](https://registro.br/tecnologia/caracteristicas-tecnicas/)
