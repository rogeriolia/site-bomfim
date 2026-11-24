# Site Bomfim — protótipo frontend independente

Este diretório é um projeto próprio, apenas hospedado dentro de `4lia` para testes. Não usa código, backend ou banco de dados da 4lia.

## Rodar

### Desenvolvimento (site + API, um comando)

```bash
npm install
pip install -r requirements.txt
# opcional: copie .env.bomfim.example → .env (PostgreSQL, Brevo)
python run.py
```

O terminal mostra o endereço do site (**http://localhost:5173/**). `Ctrl+C` encerra Vite e API juntos. Equivalente: `npm run dev`.

Só a API (produção/local): `python run.py --api-only`.

`npm run build` gera a versão estática em `dist/`. **Deploy em produção (Vultr):** `git push origin main` e depois **`npm run deploy`** (usa a chave `~/.ssh/site_bomfim_deploy` e o IP do `.env`). Não depende de secrets no GitHub Actions. URL: `https://site-bomfim.4lia.com.br/site-bomfim/`. Detalhes: [`docs/backend/deploy-github.md`](docs/backend/deploy-github.md).

## URL provisória

O build de produção usa a base `/site-bomfim/`. A URL de testes é
`https://www.4lia.com.br/site-bomfim/`.

No servidor Vultr, o deploy vai para **`/opt/site-bomfim`** (GitHub Actions ou
`scripts/server/bootstrap-from-github.sh`). URL de pré-visualização na VPS:
`https://site-bomfim.4lia.com.br/site-bomfim/` (nginx em
`deploy/nginx/site-bomfim.4lia.com.br.conf.example`). A URL pública
`https://www.4lia.com.br/site-bomfim/` está na **KingHost** — sincronize `dist/`
e `.htaccess` para lá quando for publicar.

O arquivo `.htaccess` da raiz serve `dist/index.html`, mapeia
`/site-bomfim/assets/*` para `dist/assets/*` e encaminha URLs internas do
React Router para o mesmo HTML. Para publicar alterações, execute `npm run build`
e sincronize `dist/` e o `.htaccess` da raiz. O código-fonte não é o ponto de
entrada da versão pública.

Se futuramente apenas o conteúdo de `dist/` for publicado, use o `.htaccess`
incluído no build.

## Duas experiências da home

As duas experiências têm URLs independentes para comparação: `/` é sempre a
home principal de descoberta, para novos clientes; `/inicio-recorrente` é a
home secundária, voltada a rastreio, serviços rápidos e conteúdos. Não há
troca automática por visita, cookie, identificação pessoal ou integração com
analytics nesta fase. Os corredores da vitrine recorrente são ilustrativos e
o botão “Outra rota” troca o destaque sem recarregar a página.

## Páginas

As páginas internas usam quatro faixas editoriais responsivas entre seções:
`coverage` em Rotas, `planning` em Soluções, `operation` em Estrutura e
`editorial` em Conteúdos e Quem somos. Texto, estados e CTAs ficam no componente
`src/components/SectionBanner.jsx`; as fotografias são fundos substituíveis.

As duas homes compartilham a vitrine `src/components/ContentShowcase.jsx`, com
filtros locais por tema, três cards por seleção e banner de conversa comercial.
A biblioteca tem 21 artigos: 11 revisados e 10 novos, organizados em `src/data/articles.json` e `src/data/articleBodies.js`. As referências e seus recortes ficam em `src/data/editorialSources.js`. Os textos distinguem dados de mercado, orientação técnica e exemplos fictícios. O tempo de leitura considera aproximadamente 200 palavras por minuto.

Os desdobramentos dos 21 artigos para LinkedIn, Instagram e e-mail estão em `docs/desdobramentos-editoriais-21-conteudos.md`, com versão estruturada em JSON no mesmo diretório. São 63 peças preparadas, sem postagem ou envio. Os links usam o endereço provisório do site e dependem da sincronização do build para acesso remoto.

| Endereço | Papel |
| --- | --- |
| `/` | Home principal para novos clientes |
| `/inicio-recorrente` | Home secundária para clientes recorrentes |
| `/solucoes` | Soluções de transporte |
| `/rotas` | Busca e cards de corredores |
| `/rotas/:id` | Detalhe de um corredor |
| `/estrutura` | Estrutura institucional |
| `/quem-somos` | Quem somos |
| `/conteudos` | Índice editorial |
| `/conteudos/:slug` | Modelo de artigo |
| `/contato` | Contato comercial demonstrativo |
| `/cotacao` | Solicitação de cotação demonstrativa |
| `/area-do-cliente` | Entrada futura de cliente recorrente |
| `/campanhas/descoberta` | Landing page de topo de funil |
| `/campanhas/consideracao` | Landing page de meio de funil |
| `/campanhas/decisao` | Landing page de fundo de funil |
| `/campanhas/retorno` | Landing page de retomada |
| `/design-system` | Vitrine dos tokens e componentes |

## Limites desta versão

- Formulários das LPs (`/lp/*`) enviam dados quando `python run.py` e o PostgreSQL estão configurados; páginas institucionais de contato/cotação podem permanecer demonstrativas.
- Rotas, distâncias, prazos e frequências estão em `src/data/routes.json` e **são ilustrativos**. Não publicar como informação operacional sem validação.
- Os artigos incluem fontes consultadas em 18/10/2026 e não confirmam cobertura, capacidade ou condições comerciais da Bomfim. Atualizar indicadores e consultar normas vigentes antes de republicar trechos conjunturais ou normativos.
- O rastreio e a Área do Cliente não estão integrados.
- As imagens de `public/assets/` são cópias locais de mockups produzidos no projeto. A extração visual por CSS a partir de alguns mockups é temporária; substituir por fotos-fonte aprovadas antes de produção.
- Fonte de texto provisória: DM Sans; títulos: Manrope. Validar tipografia oficial da marca.

## Estrutura

`src/styles/index.css` define os tokens. `src/components/UI.jsx` concentra as primitivas; os demais componentes são composições compartilhadas. `src/data/` concentra navegação e conteúdo demonstrativo. O header recebe o modo `site` ou `landing`, mas usa a mesma implementação.

Veja [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) para as regras de uso.

## Revisão para agência

O painel separado fica em `https://www.4lia.com.br/site-bomfim/revisao-editorial/`, com busca, filtros por canal, cópia e download dos textos. É um link de revisão sem autenticação, fora da navegação pública e com `noindex`. Os dez novos conteúdos incluem cinco artes de carrossel cada (PNG 1080 × 1350 e SVG editável), com galeria, ampliação e ZIPs no painel. As 50 peças estão em revisão. Os arquivos de distribuição ficam em `public/revisao-editorial/` e são copiados pelo build.

### Regenerar as artes

Scripts em `scripts/carousel-assets/`: `create-carousels.py` compõe os SVGs e atualiza os dados do painel; `render-carousels.cjs` gera PNGs com as fontes locais; `package-carousels.py` cria ZIPs e atualiza a exportação de textos. O render usa o Sharp do runtime local.
