# Carrosséis Bomfim — 10 novos conteúdos

Entrega para revisão: 18/10/2026. Total: 10 carrosséis × 5 telas = 50 artes.

- Formato PNG: 1080 × 1350, proporção 4:5, composição editorial em vetor renderizado.
- Editáveis: SVG com texto e logotipo vetorial original. Fontes Manrope e DM Sans incluídas nos ZIPs com licença OFL.
- Paleta do site: vermelho #E8002D, azul-escuro #10233B, texto #1F2330, fundo #F5F7FA.
- Diagramação: margem de 64 px, tipografia hierarquizada, alternância de capas escuras e telas claras, número de tela e chamada de continuidade.
- Dados: fonte e período nas telas com indicadores; casos, exemplos fictícios e limites de interpretação identificados. Gráfico de varejo diferencia valores positivos e negativos em torno do zero.
- Não utiliza fotografia documental ou imagens geradas de instalações/equipes. A informação visual é construída em diagramas e tipografia.
- Referência de identidade: DESIGN_SYSTEM.md e logotipo existente do site de testes. Paleta/tipografia continuam sujeitas à validação da marca descrita nesse documento.

## Acesso e arquivos

Painel: https://www.4lia.com.br/site-bomfim/revisao-editorial/

Pacote completo: https://www.4lia.com.br/site-bomfim/revisao-editorial/carrosseis/bomfim-10-carrosseis.zip

Cada um dos dez primeiros artigos possui galeria de cinco telas, botão de ampliação, downloads PNG por tela e ZIP individual com PNGs, SVGs, fontes e legenda. A visualização ampliada tem anterior/próxima, setas do teclado e fechamento por Escape. O painel permite filtrar somente os conteúdos com artes.

## Regeneração

1. `python3 scripts/carousel-assets/create-carousels.py`
2. `node scripts/carousel-assets/render-carousels.cjs`
3. `python3 scripts/carousel-assets/package-carousels.py`
4. `npm run build`

Os scripts trabalham sobre os dez novos conteúdos, preservando os outros onze. Não enviam posts ou e-mails.

## Verificações locais

Contagem dos dez carrosséis, dimensões dos 50 PNGs, existência dos 50 SVGs, integridade dos ZIPs, referências do manifesto e sintaxe do JavaScript do painel. Inspeção visual de capas e telas internas; sem sobreposição dos blocos principais de texto com os diagramas (limites validados no gerador).

## Conferência na versão publicada

- 10 galerias e 50 prévias carregadas no painel.
- Filtro “Mostrar só os 10 conteúdos com artes” retornou os dez artigos novos.
- Modal de ampliação, próxima/anterior e fechamento por Escape conferidos no navegador.
- Visualização em 390 e 320 px: sem transbordamento horizontal da página; galeria com rolagem própria.
- 50 URLs PNG responderam HTTP 200 e confirmaram dimensões 1080 × 1350 pelo cabeçalho do arquivo.
- ZIP completo baixado e validado, com 50 PNGs e 50 SVGs, além de fontes/licenças e legendas.
- Evidências: `docs/qa-publicacao/carrosseis-servidor.json` e `docs/qa-publicacao/artes-painel-publicado.png`.
