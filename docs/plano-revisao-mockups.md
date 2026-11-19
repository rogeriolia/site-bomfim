# Plano de revisão dos mockups institucionais

Análise registrada em 18/10/2026. Este documento orienta a próxima rodada de implementação; não autoriza por si só alterações visuais. Aplicar componentes somente após instrução específica do usuário.

## Direção comum

- Usar os mockups como referência de composição, ritmo editorial e hierarquia, sem copiar literalmente identidade, textos, cores ou imagens.
- Aplicar a marca Bomfim e os tokens existentes em `DESIGN_SYSTEM.md` e `src/styles/index.css`: vermelho de marca, grafite, superfícies claras, tipografia e espaçamento atuais.
- Construir composições personalizadas em React com as primitivas e padrões do design system; manter conteúdo em dados quando apropriado.
- Preservar responsividade, acessibilidade de teclado e leitores de tela, alvos de toque e comportamento reduzido de movimento.
- Usar imagens aprovadas da biblioteca visual Bomfim. Não publicar fotos geradas/ilustrativas como prova documental da operação.
- Substituir todo texto de demonstração, números de clientes, depoimentos e contatos fictícios por informação validada antes de publicação.

## Referências já analisadas

### A. Quem somos / Sobre — imagem 1 da primeira rodada

Composição de introdução institucional com foto operacional, texto em duas colunas e pequeno destaque de credibilidade. A referência também sugere processo em etapas. Para Bomfim, priorizar trajetória e contexto confirmados, sem números de experiência ou alegações não verificadas.

### B. Faixa institucional — imagem 2 da primeira rodada

Hero/faixa de marca com fotografia escurecida, mensagem curta e CTA. Aproveitar a hierarquia de leitura, ajustando contraste e cor aos tokens Bomfim.

### C. Vitrine de soluções — imagem 3 da primeira rodada e imagem 2 da rodada nova

Cards combinam imagem, nome da solução, resumo e ação; a segunda referência propõe composição assimétrica escura com texto à esquerda e grade visual à direita. Mapear para `/solucoes`, que já lista carga fracionada, embarques recorrentes, coleta programada e distribuição personalizada. Avaliar adaptação visual sem inventar modalidades (por exemplo, aéreo, marítimo ou ferroviário) não oferecidas/confirmadas.

### D. Equipe / diretoria e gerências — imagem 4 da primeira rodada

Cards de pessoas com foto, nome, função, telefone e e-mail; a solicitação inicial propõe carrossel para diretoria e gerências de unidades. Implementação depende de lista oficial, cargos, contatos diretos autorizados, fotos aprovadas e regra de agrupamento. Até receber os dados, não inventar pessoas ou contatos. Projetar carrossel acessível, com controles explícitos e alternativa navegável por teclado.

### E. Depoimentos — imagem 1 da rodada nova

Faixa de prova social com foto de fundo e cartão sobreposto para avaliação de cliente. Usar somente depoimentos autorizados, com nome/cargo/empresa e validação da citação; estatísticas de clientes exigem fonte e aprovação. Se ainda não houver material, omitir a seção ou deixar como item futuro, sem placeholder fictício.

### F. Página de detalhe de solução — imagem 3 da rodada nova

Modelo editorial com banner e breadcrumb, navegação lateral entre soluções, conteúdo principal, benefícios/processo, FAQ e bloco de contato/arquivo. O projeto já tem página dedicada em `/solucoes/:slug` com hero, público, etapas, preparação, FAQ e próximos passos. Próxima revisão deve comparar essas seções ao mockup, manter navegação contextual e evitar CTA telefônico, PDF ou benefícios não confirmados.

## Mapeamento para o projeto atual

- `/quem-somos`: página existente em `src/pages/Information.jsx`, hoje com narrativa breve, trajetória pendente de validação e duas seções. Candidata a incorporar introdução institucional e equipe.
- `/estrutura`: mesma página genérica; já destaca unidades e pessoas/processos. Diretoria/gerências por unidade pode pertencer aqui ou a “Quem somos”; definir arquitetura na instrução de implementação.
- `/solucoes`: listagem existente em `src/pages/Information.jsx`, com quatro ofertas e ilustrações próprias. Referências C podem informar a composição da vitrine.
- `/solucoes/:slug`: `src/pages/ServiceDetail.jsx` já oferece estrutura de detalhe robusta; evolução provável é visual e de navegação, não reconstrução de conteúdo do zero.
- Depoimentos: não foi identificado módulo de prova social com conteúdo validado; requer decisão e dados antes de implementação.

## Dependências antes da implementação/publicação

1. Definir se equipe fica em “Quem somos”, “Estrutura” ou ambas com escopos distintos.
2. Receber nomes, funções, unidade, telefone, e-mail, autorização de exposição e fotos institucionais aprovadas.
3. Receber depoimentos autorizados e documentação para qualquer indicador numérico.
4. Confirmar serviços oferecidos, conteúdo institucional, benefícios, FAQs e destino de CTAs/arquivos.
5. Confirmar quais imagens da biblioteca são aprovadas como documentação real versus imagens conceituais.
6. Implementar em componentes React próprios, reutilizando tokens, primitivas e padrões acessíveis do projeto.

## Ordem sugerida

1. Validar arquitetura e dados institucionais (equipe, história e unidades).
2. Atualizar “Quem somos”/“Estrutura” com a narrativa e o módulo de equipe.
3. Atualizar a vitrine `/solucoes` com cards e composição inspirados nas referências.
4. Refinar `/solucoes/:slug` com navegação lateral responsiva e hierarquia de detalhe.
5. Adicionar prova social somente após receber conteúdo e autorização.
6. Revisar desktop/mobile, teclado, contraste, movimento reduzido e consistência com o design system.

## Nova referência: alterações nas seções da home

### G. Home — soluções e estrutura (imagem enviada em 18/10/2026, 10:34)

A imagem propõe duas seções editoriais em sequência, com alternância entre texto e fotografia:

- **Soluções para embarcar:** imagem operacional ampla à esquerda; à direita, eyebrow, título, breve orientação, lista de soluções com links individuais, separadores finos e CTA para `/solucoes`.
- **Estrutura em movimento:** texto e CTA à esquerda; fotografia ampla à direita. O texto conecta pessoas, unidades e etapas da carga.
- Manter fundo claro, respiro generoso, cantos arredondados discretos, alinhamento e proporção de imagem consistentes. Usar vermelho Bomfim nos detalhes em vez do vermelho brilhante do mockup quando necessário.
- A lista e as descrições de soluções já existem em `Home.jsx`; validar se a hierarquia, espaçamento, responsividade e recorte das imagens precisam de refinamento. A composição atual já se aproxima da referência, então a mudança futura pode ser uma evolução visual direcionada, não uma substituição conceitual.
- Confirmar o uso de fotos: a imagem atual de conferência (`06-conferencia.webp`) é conceitual; a imagem de armazenagem (`11-armazenagem.webp`) deve ser tratada conforme a classificação e aprovação da biblioteca visual. Preferir imagens Bomfim aprovadas para representar operação real.
- Em mobile, empilhar imagem e conteúdo em ordem lógica; manter cada solução como link individual com foco visível e área de toque adequada.

### Escopo atualizado da rodada de home

1. Refinar a seção de soluções conforme a referência G, mantendo os quatro serviços confirmados no código e seus links atuais.
2. Refinar a seção de estrutura conforme G, com destino `/estrutura` e texto institucional validado.
3. Manter hero e atalhos rápidos fora desta mudança, salvo instrução posterior.
4. Integrar esta orientação com os itens anteriores de “Quem somos/equipe”, vitrine e detalhes de serviços; as seções de home e as páginas internas devem compartilhar tokens e componentes, mas podem ter composições específicas.

## Nova orientação: conteúdos na página inicial

### H. Home — vitrine editorial sem filtros (imagem enviada em 18/10/2026, 11:38)

- Não exibir filtros, chips ou navegação por categorias na página inicial. A seleção por categoria não é necessária nesse contexto.
- Na home, apresentar somente uma curadoria enxuta de conteúdos em cards, com imagem, categoria textual, título e link “Ler conteúdo”, além de um CTA “Ver todos os conteúdos” para `/conteudos`.
- Manter filtros de categorias exclusivamente em `/conteudos`, como já ocorre na experiência atual.
- Os cards da home podem priorizar os conteúdos em destaque ou os mais recentes, conforme a regra editorial definida para a vitrine, sem expor controles de filtragem.
- A referência sugere fileira horizontal de categorias seguida de cards. Para a home, aproveitar apenas o padrão visual dos cards; omitir a fileira de categorias e manter a grade responsiva atual ou uma seleção horizontal acessível, se isso for especificado depois.

### Escopo atualizado da home

A home poderá reunir as seções de soluções, estrutura e vitrine editorial. Na vitrine editorial, não adicionar filtros de categoria; os filtros permanecem na página dedicada de conteúdos.

## Implementado em 18/10/2026

- Home: removidos os filtros de categoria da vitrine editorial; a home mostra três conteúdos em destaque e conserva o link para `/conteudos`.
- Home: atualizadas as composições de soluções e estrutura para classes de seção próprias, espaçamento responsivo e links de serviço com alvos adequados.
- Página `/conteudos`: filtros existentes permanecem como navegação por categoria.
- Build de produção executado com sucesso após as mudanças.

## Ainda depende de material ou próxima rodada

- Carrossel de diretoria/gerências: aguarda dados e fotos oficiais autorizados.
- Depoimentos: aguarda citações e autorização de publicação.
- Páginas de soluções: `/solucoes` agora apresenta as quatro ofertas em composição editorial escura; `/solucoes/:slug` tem navegação lateral entre serviços, contato contextual e âncoras para visão geral, etapas, preparação e dúvidas.
- As páginas de soluções usam fotografias da biblioteca visual do protótipo e preservam o conteúdo descritivo existente; as ilustrações conceituais seguem identificadas nos detalhes.
- A equipe e os depoimentos permanecem como itens futuros, até a entrega de materiais oficiais autorizados.


## Ajuste solicitado: imagens e divisores das seções da home

Em 18/10/2026, a orientação foi remover as linhas entre os serviços e dar mais presença às fotografias nas seções da home, sem cortar as pessoas. As seções de soluções e estrutura passaram a usar faixas fotográficas de largura total, mantendo a proporção das imagens em desktop e exibindo as imagens inteiras antes do conteúdo em telas pequenas. O conteúdo fica em painéis de alto contraste posicionados nas áreas mais livres das fotos. A lista de soluções agora usa espaçamento e links com setas, sem divisores. Os textos alternativos identificam imagens conceituais sem atribuir as pessoas retratadas à equipe Bomfim.


### Refinamento das faixas fotográficas da home

Após nova referência em 18/10/2026: reduzir a altura das faixas fotográficas de desktop, mantendo a imagem principal inteira e centralizada; usar a própria foto como preenchimento lateral suave para preservar a largura total sem cortar pessoas; compactar os painéis flutuantes com sombras. Em telas pequenas, continuar mostrando a foto completa antes do painel.


Complemento em 18/10/2026: removido o preenchimento lateral com repetição da mesma fotografia. As faixas agora usam uma base em gradiente neutro; gradientes suaves sobre a foto dão profundidade. A imagem nítida continua centralizada e sem recorte de pessoas.
