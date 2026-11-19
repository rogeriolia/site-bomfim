# Design system Bomfim — revisão de componentes de marketing

## Direção

Sistema editorial e comercial para site público e landing pages. Não se apoia em padrões de dashboard interno: espaço, fotografia, hierarquia de mensagem e CTA mudam conforme o contexto, enquanto tokens e componentes permanecem comuns.

## Paleta

| Papel | Token | Valor | Uso |
| --- | --- | --- | --- |
| Marca | `--brand` | `#E8002D` | Header, CTA primário, links, acentos |
| Texto | `--ink` | `#1F2330` | Títulos, valores, nomes das rotas |
| Texto secundário | `--muted` | `#6B7280` | Rótulos e informações auxiliares |
| Contraste | `--dark` | `#10233B` | Hero escuro, footer e áreas de contraste |
| Canvas | `--canvas` | `#F5F7FA` | Seções alternadas |
| Superfície leve | `--soft` | `#F3F4F6` | Chips e quadros de dados |
| Borda | `--line` | `#E3E8EF` | Cards e divisões |

O vermelho de marca é aproximação do mockup; conferir valor exato com manual de identidade. O header e footer usam o SVG compacto existente em `public/assets/bomfim-logo-compact.svg` com filtro branco para aplicação sobre fundo vermelho/escuro. O SVG branco original também está em `public/assets/bomfim-logo-white.svg`, mas tem uma área interna de respiro muito grande. Confirmar com a marca qual versão vetorial compacta é definitiva. Não recriar o lettering.

## Tipografia e layout

- Display: Manrope 800; texto: DM Sans. Fontes provisórias até validação da identidade.
- Largura máxima de conteúdo: 1280 px. Margens: 24 px desktop e 16 px mobile.
- Espaçamento em incrementos de 4/8 px; seções entre 64 e 112 px.
- Bordas de 8, 12 e 20 px. Sombras leves apenas para elevação real.
- Grid responsivo mobile-first; alvos de toque de pelo menos 44 px.

## Componentes

Primitivas: `Button`, `ArrowLink`, `Chip`, `Field`, `Dialog`, `SectionIntro`.

Composições: `SiteHeader` (navegação institucional e modo landing), `MegaMenu`, `MarketingHero`, `HeroActions`, `HeroUtilityLinks`, `EditorialFeature` (foto inteira ao lado de conteúdo informativo, com alternância de lado), `SolutionCard` (imagem, resumo e acesso ao detalhe), `SiteFooter`, `RouteSearch`, `RouteCard`, `CorridorPreview`, `CommercialContact`, `ArticleCard`, `ArticleImage`, `CategoryPills`.

Regras: cada componente tem uma responsabilidade; dados em JSON ou arquivos de configuração; evitar propriedades booleanas em excesso. Formulários têm labels e estados demonstrativos explícitos. `Dialog` usa o elemento HTML nativo para foco e Escape.

## Dois fluxos, mesma base

- **Site institucional:** navegação por Soluções, Cobertura, Estrutura, Comercial e Conteúdos. Os quatro primeiros têm mega menu desktop e divulgação mobile. Cotação, comercial e Área do Cliente continuam acessíveis no header.
- **Landing pages:** header reduzido, mensagem focada em uma etapa do funil e uma conversão principal (`#formulario`). O link secundário apenas explica a mesma oferta (`#como-funciona`), sem desviar o tráfego pago para outra área do site. URLs distintas para descoberta, consideração, decisão e retorno.

## Padrões de experiência pública

- **Mega menu:** 3 zonas — links escaneáveis com descrição, imagem de operação e ação contextual. Usa links reais de navegação; o botão de topo apenas abre/fecha o painel. Fecha por Escape, clique fora e mudança de página. Em telas abaixo de 1280 px vira uma lista de grupos expansíveis.
- **Hero:** `MarketingHero` separa a camada visual da mensagem e oferece tamanhos `large`, `compact` e `campaign`. `HeroActions` e `HeroUtilityLinks` compõem a jornada institucional, sem impor os mesmos CTAs em campanhas.
- **CTA:** no site, cotação e contato podem coexistir quando servem necessidades distintas; ações utilitárias de cliente ficam separadas. Na campanha, um CTA principal aponta ao formulário da própria página, com repetição coerente no final.
- **Imagem:** fotografia de frota, armazenagem, pessoas e operação; evitar cidade turística como evidência de cobertura. Hero precisa de área de respiro para texto, cards de uma seção usam proporção consistente, e texto nunca deve estar embutido na foto final. Home, serviços, rotas e campanhas usam agora imagens independentes da interface. As três imagens `*-v2.png` são conceituais, geradas para o protótipo; não representam necessariamente frota, instalações ou colaboradores reais da Bomfim. Substituir por fotografia aprovada antes da publicação.
- **Seções:** `SectionIntro` controla a introdução; corpo é composto conforme necessidade (rotas, conteúdo, estrutura, formulário), evitando um componente genérico com dezenas de opções booleanas.
- **Composição editorial:** fotos de seções informativas permanecem em mídia própria dentro do container, com cantos `--radius-lg`; não usar imagem de fundo full width nem sobrepor painel de texto à foto. Preserve a proporção original ou escolha object-position que mantenha pessoas e objetos relevantes inteiros no enquadramento. Alternar imagem e texto entre seções, sem aumentar a altura além do necessário para o conteúdo.
- **Vitrine de soluções:** usar cards informativos com imagem em sua proporção original, nome, descrição e ação clara. Em desktop, dois cards por linha com largura suficiente; em telas menores, uma coluna. Não condensar todas as soluções em miniaturas ao lado do hero.

## Referência de mercado

Untitled UI oferece também uma biblioteca para sites de marketing, não apenas aplicativos internos. Adotamos princípios de seções composáveis, navegação responsiva e hierarquia clara de CTA, sem copiar componentes proprietários. Para navegação de site, o padrão é links e botões de divulgação, não `role="menu"` de aplicação.

## Antes da produção

Validar logo e cores oficiais, fotos-fonte e direitos de uso, dados operacionais, copy técnica dos artigos, conteúdo institucional, textos LGPD, destino real dos formulários, SEO/renderização de artigos e integração da Área do Cliente.

## Imagens conceituais desta revisão

- `home-hero-operations-v2.png`: caminhão regional branco em via urbano-industrial nordestina, espaço escuro livre à esquerda para título HTML; sem marca ou texto dentro da imagem.
- `warehouse-team-v2.png`: equipe conferindo carga e documentos em ambiente de cross-dock; imagem editorial, sem marca.
- `urban-delivery-v2.png`: entrega urbana com veículo leve e carrinho de carga; imagem editorial, sem marca.
- `home-hero-branded-v3.png`: alternativa de hero inspirada nos mockups da home, com caminhão de carga maior e marca aplicada na carroceria; usada na home e na cobertura.
- `client-entry-branded-v3.png`: alternativa clara com caminhão no centro de distribuição, usada na entrada visual da Área do Cliente.

As imagens foram geradas com o recurso integrado de imagem. A logo oficial permanece aplicada por SVG na interface. A aplicação da marca nos caminhões de `*-v3.png` é uma aproximação gerada por IA a partir do vetor oficial e precisa de revisão do designer antes do uso público.

## Ajuste de navegação desta rodada

No header, o logotipo visual foi reduzido em cerca de 20%, os links de primeiro nível usam peso regular, e o acesso à Área do Cliente não tem mais divisor vertical. Os botões de cotação e contato mantêm ênfase própria como ações, separadas dos links de navegação.
