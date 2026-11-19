# Revisão editorial e visual — páginas do site Bomfim

19/10/2026 · Acervo atual · Frontend de homologação

## Entrega

- Títulos da aba, descrições, canonical e Open Graph/Twitter centralizados por URL, com resolução específica para artigos, soluções e rotas.
- Títulos e descrições visíveis revisados nas páginas institucionais, formulários, campanhas, conteúdos e etapas demonstrativas de obrigado.
- Os 21 artigos usam 21 arquivos diferentes do acervo. Campanhas usam cenas relacionadas à intenção de cada página. Imagens podem reaparecer entre famílias de páginas quando o assunto é o mesmo; não foram criados novos visuais.
- Soluções preservam as quatro imagens próprias. Rotas individuais usam representações do destino do acervo de unidades. Legendas de “Imagem ilustrativa” foram removidas da interface, mantendo textos alternativos descritivos sem apresentar representações como prova fotográfica da operação.
- As páginas utilitárias de privacidade e denúncia não receberam imagens decorativas desnecessárias. O catálogo define também suas imagens de compartilhamento.
- Nenhuma promessa de prazo, cobertura, condição comercial ou histórico institucional foi inventada. Formulários e páginas de obrigado continuam explicitamente demonstrativos.
- Homologação mantém `noindex, nofollow`. A flag `VITE_PUBLIC_INDEXING=true` é reservada à publicação definitiva; páginas utilitárias e campanhas continuam sem indexação por padrão.

## Integração futura em Python/CMS

A matriz contém título SEO sem o sufixo de marca, H1, descrição, arquivo visual, área e intenção de indexação de cada URL. `indexable` representa a política futura de cada página, não o estado atual da homologação. Usar o domínio definitivo para canonical/Open Graph em produção.

A SPA atualiza os metadados após navegar. A equipe de backend deve servir esses valores no HTML inicial por página para previews de redes sociais e buscadores que não executam JavaScript. A revisão não implementa SSR, CMS, pixels nem APIs. Confirmar textos operacionais e contatos com a Bomfim antes do lançamento.

Arquivos: [matriz CSV](matriz-paginas.csv) e [matriz JSON](matriz-paginas.json). Regenerar com `python3 scripts/export-page-review.py` na raiz do projeto.

## Matriz de revisão

| URL | Título SEO | H1 | Imagem do acervo |
|---|---|---|---|
| / | Carga fracionada e distribuição para empresas no Nordeste | Conectamos sua carga ao Nordeste | visuals-2026/05-hero-corredores.webp |
| /area-do-cliente | Portal e rastreamento de cargas | Acesso e rastreio no lugar certo. | visuals-2026/10-atendimento.webp |
| /aviso-de-entrega | Avisos sobre entregas, unidades e rotas | Informações que podem afetar sua entrega. | visuals-2026/09-frota-leve.webp |
| /avisos | Avisos sobre entregas, unidades e rotas | Informações que podem afetar sua entrega. | visuals-2026/09-frota-leve.webp |
| /biblioteca-visual | Acervo visual do projeto | Acervo visual para o site Bomfim | visuals-2026/11-armazenagem.webp |
| /campanhas/consideracao | Planejamento de rotas e embarques | Mais clareza para planejar seus embarques. | visuals-2026/06-conferencia.webp |
| /campanhas/consideracao/obrigado/coleta | Seu próximo embarque começa aqui — demonstração — consideracao | Seu próximo embarque começa aqui. | visuals-2026/03-hero-coleta.webp |
| /campanhas/consideracao/obrigado/contato | Obrigado por conversar com a Bomfim — demonstração — consideracao | Obrigado por conversar com a Bomfim. | visuals-2026/04-hero-atendimento.webp |
| /campanhas/consideracao/obrigado/cotacao | Mais um passo para sua carga seguir viagem — demonstração — consideracao | Mais um passo para sua carga seguir viagem. | visuals-2026/08-motorista.webp |
| /campanhas/decisao | Converse sobre sua operação de transporte | Vamos definir o próximo passo da sua operação. | visuals-2026/01-hero-pessoas.webp |
| /campanhas/decisao/obrigado/coleta | Seu próximo embarque começa aqui — demonstração — decisao | Seu próximo embarque começa aqui. | visuals-2026/03-hero-coleta.webp |
| /campanhas/decisao/obrigado/contato | Obrigado por conversar com a Bomfim — demonstração — decisao | Obrigado por conversar com a Bomfim. | visuals-2026/04-hero-atendimento.webp |
| /campanhas/decisao/obrigado/cotacao | Mais um passo para sua carga seguir viagem — demonstração — decisao | Mais um passo para sua carga seguir viagem. | visuals-2026/08-motorista.webp |
| /campanhas/descoberta | Distribuição para empresas no Nordeste | Sua distribuição no Nordeste começa por uma boa rota. | visuals-2026/14-distribuicao-urbana.webp |
| /campanhas/descoberta/obrigado/coleta | Seu próximo embarque começa aqui — demonstração — descoberta | Seu próximo embarque começa aqui. | visuals-2026/03-hero-coleta.webp |
| /campanhas/descoberta/obrigado/contato | Obrigado por conversar com a Bomfim — demonstração — descoberta | Obrigado por conversar com a Bomfim. | visuals-2026/04-hero-atendimento.webp |
| /campanhas/descoberta/obrigado/cotacao | Mais um passo para sua carga seguir viagem — demonstração — descoberta | Mais um passo para sua carga seguir viagem. | visuals-2026/08-motorista.webp |
| /campanhas/retorno | Retome seu planejamento de distribuição | Suas próximas rotas merecem uma conversa. | visuals-2026/17-banner-cobertura.webp |
| /campanhas/retorno/obrigado/coleta | Seu próximo embarque começa aqui — demonstração — retorno | Seu próximo embarque começa aqui. | visuals-2026/03-hero-coleta.webp |
| /campanhas/retorno/obrigado/contato | Obrigado por conversar com a Bomfim — demonstração — retorno | Obrigado por conversar com a Bomfim. | visuals-2026/04-hero-atendimento.webp |
| /campanhas/retorno/obrigado/cotacao | Mais um passo para sua carga seguir viagem — demonstração — retorno | Mais um passo para sua carga seguir viagem. | visuals-2026/08-motorista.webp |
| /canal-de-denuncias | Canal de denúncias | Relate uma situação com segurança. | visuals-2026/01-hero-pessoas.webp |
| /coleta | Solicitar coleta de carga | Prepare o próximo embarque da sua empresa. | visuals-2026/03-hero-coleta.webp |
| /contato | Contato com o comercial | Vamos planejar a operação da sua empresa. | visuals-2026/04-hero-atendimento.webp |
| /conteudos | Conteúdos sobre mercado, gestão e logística | Informação para o dia a dia da sua empresa. | visuals-2026/12-triagem.webp |
| /conteudos/ad-valorem-gris-e-seguro | Ad valorem, GRIS e seguro: entenda a diferença | Ad valorem, GRIS e seguro: entenda a diferença | services/distribuicao-personalizada-3d.webp |
| /conteudos/alem-do-preco-na-cotacao | Além do preço: o que avaliar numa cotação de carga fracionada | Além do preço: o que avaliar numa cotação de carga fracionada | visuals-2026/15-equipe.webp |
| /conteudos/atraso-antes-da-estrada | O que pode atrasar uma coleta antes da saída | O que pode atrasar uma coleta antes da saída | visuals-2026/07-carregamento.webp |
| /conteudos/aumento-preco-indice-orcamento | O preço mudou. Você sabe de onde veio o aumento? | O preço mudou. Você sabe de onde veio o aumento? | visuals-2026/08-motorista.webp |
| /conteudos/conferencia-e-confianca | Conferência de carga: o que registrar ao receber | Conferência de carga: o que registrar ao receber | visuals-2026/02-hero-estrutura.webp |
| /conteudos/confirmar-rota-no-nordeste | Como confirmar se uma rota atende sua operação no Nordeste | Como confirmar se uma rota atende sua operação no Nordeste | hero-intercapital-bomfim-v2.webp |
| /conteudos/dados-versao-certa | Quanto tempo sua equipe perde procurando a informação certa? | Quanto tempo sua equipe perde procurando a informação certa? | visuals-2026/16-hero-home-recorrente.webp |
| /conteudos/embalagem-etiqueta-legivel | Embalagem e etiqueta: o que precisa continuar legível até a entrega? | Embalagem e etiqueta: o que precisa continuar legível até a entrega? | visuals-2026/12-triagem.webp |
| /conteudos/estoque-cheio-produto-faltando | Estoque cheio, produto faltando: por onde começar? | Estoque cheio, produto faltando: por onde começar? | visuals-2026/11-armazenagem.webp |
| /conteudos/ia-pequena-empresa-primeira-tarefa | IA na pequena empresa: escolha uma tarefa antes da ferramenta | IA na pequena empresa: escolha uma tarefa antes da ferramenta | visuals-2026/04-hero-atendimento.webp |
| /conteudos/informacao-da-entrega | Quando a informação da entrega chega tarde | Quando a informação da entrega chega tarde | visuals-2026/01-hero-pessoas.webp |
| /conteudos/o-que-compoe-o-valor-do-frete | O que compõe o valor do frete? | O que compõe o valor do frete? | visuals-2026/05-hero-corredores.webp |
| /conteudos/pedido-whatsapp-acompanhamento | Seu pedido nasceu no WhatsApp. Quem acompanha agora? | Seu pedido nasceu no WhatsApp. Quem acompanha agora? | visuals-2026/10-atendimento.webp |
| /conteudos/piso-minimo-e-carga-fracionada | Piso mínimo: lotação e fracionada têm o mesmo escopo? | Piso mínimo: lotação e fracionada têm o mesmo escopo? | services/carga-fracionada-3d.webp |
| /conteudos/planejar-fretes-recorrentes | Como planejar fretes recorrentes sem comprometer o abastecimento | Como planejar fretes recorrentes sem comprometer o abastecimento | visuals-2026/09-frota-leve.webp |
| /conteudos/preparar-carga-para-coleta | Como preparar uma carga fracionada para coleta | Como preparar uma carga fracionada para coleta | visuals-2026/03-hero-coleta.webp |
| /conteudos/reposicao-pecas-vendas-oscilam | Reposição de peças: o que olhar quando as vendas oscilam? | Reposição de peças: o que olhar quando as vendas oscilam? | services/embarques-recorrentes-3d.webp |
| /conteudos/reposicao-validade-saude | Vender mais exige rever a reposição? Nem sempre do mesmo jeito | Vender mais exige rever a reposição? Nem sempre do mesmo jeito | visuals-2026/13-qualidade.webp |
| /conteudos/status-antes-da-automacao | Antes de automatizar o estoque, combine o que cada status significa | Antes de automatizar o estoque, combine o que cada status significa | visuals-2026/06-conferencia.webp |
| /conteudos/vale-pedagio-na-leitura-da-rota | Vale-pedágio: o que conferir na contratação? | Vale-pedágio: o que conferir na contratação? | visuals-2026/17-banner-cobertura.webp |
| /conteudos/varejo-media-e-mix | Varejo perto da estabilidade: o que a média esconde do seu mix | Varejo perto da estabilidade: o que a média esconde do seu mix | visuals-2026/14-distribuicao-urbana.webp |
| /cotacao | Solicitar cotação de transporte | Sua próxima cotação começa por aqui. | visuals-2026/08-motorista.webp |
| /design-system | Guia visual do site | Um sistema para site, conteúdo e campanhas. | visuals-2026/06-conferencia.webp |
| /estrutura | Estrutura e unidades no Nordeste | Pessoas e estrutura por trás de cada embarque. | visuals-2026/02-hero-estrutura.webp |
| /inicio-recorrente | Atendimento e serviços para sua operação | Sua operação continua por aqui. | visuals-2026/16-hero-home-recorrente.webp |
| /obrigado/coleta | Seu próximo embarque começa aqui — demonstração | Seu próximo embarque começa aqui. | visuals-2026/03-hero-coleta.webp |
| /obrigado/contato | Obrigado por conversar com a Bomfim — demonstração | Obrigado por conversar com a Bomfim. | visuals-2026/04-hero-atendimento.webp |
| /obrigado/conteudos | Que bom ter você por perto — demonstração | Que bom ter você por perto. | visuals-2026/12-triagem.webp |
| /obrigado/cotacao | Mais um passo para sua carga seguir viagem — demonstração | Mais um passo para sua carga seguir viagem. | visuals-2026/08-motorista.webp |
| /obrigado/denuncia | Etapa de revisão concluída — demonstração | Etapa de revisão concluída. | visuals-2026/13-qualidade.webp |
| /obrigado/rotas | Boas rotas começam com um bom planejamento — demonstração | Boas rotas começam com um bom planejamento. | visuals-2026/04-hero-atendimento.webp |
| /privacidade | Privacidade e uso de dados | Política de Privacidade | visuals-2026/13-qualidade.webp |
| /quem-somos | Sobre a Bomfim Cargas | Desde 1991, no caminho de quem movimenta o Nordeste. | visuals-2026/15-equipe.webp |
| /rotas | Rotas e distribuição entre cidades | Distribuição entre cidades. Estoque onde precisa estar. | routes-hero-bomfim-v2.webp |
| /rotas/aracaju-salvador | Aracaju para Salvador: distribuição e estoques | Aracaju → Salvador | units/salvador.webp |
| /rotas/feira-recife | Feira de Santana para Recife: distribuição e estoques | Feira de Santana → Recife | units/recife.webp |
| /rotas/fortaleza-natal | Fortaleza para Natal: distribuição e estoques | Fortaleza → Natal | units/natal.webp |
| /rotas/fortaleza-teresina | Fortaleza para Teresina: distribuição e estoques | Fortaleza → Teresina | hero-intercapital-bomfim-v2.webp |
| /rotas/joao-pessoa-natal | João Pessoa para Natal: distribuição e estoques | João Pessoa → Natal | units/natal.webp |
| /rotas/joao-pessoa-recife | João Pessoa para Recife: distribuição e estoques | João Pessoa → Recife | units/recife.webp |
| /rotas/maceio-aracaju | Maceió para Aracaju: distribuição e estoques | Maceió → Aracaju | units/aracaju.webp |
| /rotas/recife-fortaleza | Recife para Fortaleza: distribuição e estoques | Recife → Fortaleza | units/fortaleza.webp |
| /rotas/recife-maceio | Recife para Maceió: distribuição e estoques | Recife → Maceió | units/maceio.webp |
| /rotas/recife-natal | Recife para Natal: distribuição e estoques | Recife → Natal | units/natal.webp |
| /rotas/recife-salvador | Recife para Salvador: distribuição e estoques | Recife → Salvador | units/salvador.webp |
| /rotas/salvador-feira | Salvador para Feira de Santana: distribuição e estoques | Salvador → Feira de Santana | units/feira-de-santana.webp |
| /solucoes | Transporte de cargas no Nordeste | Transporte para a rotina da sua empresa no Nordeste. | visuals-2026/07-carregamento.webp |
| /solucoes/carga-fracionada | Carga fracionada para empresas | Sua remessa não precisa ocupar um caminhão inteiro. | services/carga-fracionada-3d.webp |
| /solucoes/coleta-programada | Coleta programada para empresas | Agende a coleta da sua carga. | services/coleta-programada-3d.webp |
| /solucoes/distribuicao-personalizada | Distribuição personalizada para empresas | Planeje entregas para vários destinos. | services/distribuicao-personalizada-3d.webp |
| /solucoes/embarques-recorrentes | Embarques recorrentes para empresas | Organize seus embarques recorrentes. | services/embarques-recorrentes-3d.webp |
| /tecnologia | Tecnologia e acompanhamento de cargas | Informação para acompanhar sua carga e orientar o próximo passo. | visuals-2026/16-hero-home-recorrente.webp |
| /unidades | Endereços e contatos das unidades | Unidades Bomfim no Nordeste. | visuals-2026/11-armazenagem.webp |
