# Bomfim — arquitetura de conversão e análise CRO

**Escopo:** site `site-bomfim` no endereço provisório `https://www.4lia.com.br/site-bomfim/`. As rotas abaixo são identificadas no código; não confirmei publicação ou funcionamento remoto. A versão atual é um protótipo: formulários simulam o envio e não transmitem dados.

## Decisão de arquitetura

Manter o site institucional/editorial para descoberta orgânica e clientes existentes. Criar um grupo independente de landing pages para mídia paga, com cabeçalho minimalista (marca + CTA da própria página), sem navegação institucional nem links concorrentes. O rodapé deve limitar-se a privacidade e contato essencial. Páginas de obrigado também ficam fora da navegação.

Limitar a captação a **três formulários**:

1. **Cotação pontual** — origem/destino e dados essenciais da carga. CTA: “Solicitar cotação”.
2. **Embarques frequentes** — destinos, frequência, volume/perfil e necessidade da operação. CTA: “Avaliar embarques recorrentes”.
3. **Falar com comercial** — formulário curto para operação que ainda precisa de diagnóstico. CTA: “Falar com o comercial”.

Não criar formulário separado para coleta. Encaminhar esse caso para cotação ou comercial, conforme pontual/recorrente. Contato geral, páginas antigas de campanha e newsletter não devem ser destinos de anúncios.

## Mapa de URLs existentes

Prefixo provisório para os links absolutos: `https://www.4lia.com.br/site-bomfim`.

| URL | Papel atual | Ação para mídia paga |
| --- | --- | --- |
| `/` | Home para novos clientes | Institucional/SEO; não usar como destino padrão de anúncio |
| `/inicio-recorrente` | Home para clientes atuais | Manter separada de aquisição |
| `/solucoes` | Visão geral de soluções | Conteúdo de apoio |
| `/solucoes/:slug` | Detalhes de solução; inclui `/solucoes/embarques-recorrentes` | Usar como conteúdo orgânico; CTA para LP recorrente |
| `/rotas` | Consulta de rotas/cobertura | Apoio à consideração; validar dados demonstrativos antes de publicar |
| `/rotas/planejar` | Planejador de operação | Avaliar migração/encaminhamento para LP recorrente |
| `/estrutura`, `/tecnologia`, `/quem-somos`, `/unidades` | Institucional e prova de operação | Manter no site institucional |
| `/conteudos`, `/conteudos/:slug` | Conteúdo editorial | Audiência potencial de remarketing LinkedIn, com consentimento/configuração adequada |
| `/contato` | Contato genérico | Retirar de campanhas de captação; consolidar no formulário comercial |
| `/comercial` | Formulário comercial atual | Candidato à LP “falar com comercial” (reconstruir isolada) |
| `/cotacao` | Wizard de cotação | Candidato à LP “cotação pontual” (reconstruir isolada) |
| `/coleta` | Solicitação de coleta separada | Descontinuar como formulário independente; redirecionar para cotação/comercial |
| `/campanhas` | Vitrine interna de protótipos | Não divulgar em anúncios |
| `/campanhas/descoberta`, `/campanhas/consideracao`, `/campanhas/decisao`, `/campanhas/retorno` | Quatro variantes de campanha, todas hoje usam o mesmo formulário de contato | Substituir por três LPs de intenção; arquivar variantes redundantes |
| `/obrigado/:kind` e `/campanhas/:campaign/obrigado/:kind` | Confirmações genéricas/demonstrativas | Substituir por três destinos específicos e sem redirecionamento automático |
| `/area-do-cliente`, `/avisos`, `/aviso-de-entrega`, `/canal-de-denuncias`, `/privacidade` | Serviço/atendimento/legal | Manter fora da aquisição paga |

Padrão proposto (slugs a confirmar na implementação):

- `/lp/cotacao` → `/obrigado/cotacao`
- `/lp/embarques-frequentes` → `/obrigado/embarques-frequentes`
- `/lp/falar-comercial` → `/obrigado/falar-comercial`

Criar aliases/redirecionamentos de `/cotacao`, `/comercial` e `/coleta` conforme a origem. Não redirecionar `/contato` sem verificar uso por canais existentes.

## Páginas de obrigado

Uma página por intenção, sem menu, com confirmação clara, próximos passos e evento próprio. Não usar contador que retorna à home: o componente atual volta automaticamente após cinco segundos, o que interrompe a leitura e pode atrapalhar a atribuição. Incluir link de volta como opção secundária.

- **Cotação:** resumir o próximo passo, informar que a equipe validará rota/carga e oferecer telefone como alternativa.
- **Embarques frequentes:** confirmar recebimento da solicitação de avaliação e explicar quais informações podem ser úteis na conversa.
- **Comercial:** confirmar contato e apresentar canal alternativo, sem abrir outro formulário.

Só mostrar “recebemos sua solicitação” quando a integração realmente confirmar o envio. Hoje o frontend apenas navega para uma página de demonstração.

## CRO — achados e recomendações

### Achados no protótipo

- Formulários hoje apenas validam no navegador e navegam; não há envio a CRM/endpoint.
- `/comercial` tem formulário extenso: dados de contato, CEP/cidade, frequência, segmento e outros dados. Bom contexto para qualificação, mas pode gerar atrito em tráfego frio.
- `/cotacao` tem wizard com múltiplas etapas; preservar a intenção, mas testar primeiro uma versão de poucos campos e deixar detalhes da carga para etapa posterior/retorno comercial.
- `/coleta` duplica campos e intenção com cotação e comercial.
- Páginas de campanha já têm cabeçalho simplificado, mas oferecem links para Início, Rotas e Conteúdos e têm seção “Outros caminhos”. Isso desvia o clique da conversão pretendida.
- Os quatro slugs de campanha reaproveitam a mesma estrutura/formulário de contato, sem alinhamento real entre palavra-chave, anúncio e oferta.
- Formulários e confirmações informam explicitamente que são demonstrações; não podem ser usados como captação real antes de integrar e validar o recebimento.
- Rotas, prazos e frequências do catálogo são identificados no README como ilustrativos; não os prometer em anúncios/LP sem validação operacional.

### Recomendações para primeira rodada

1. **Correspondência de intenção:** grupos de anúncios de cotação pontual → LP cotação; termos de transportadora/rotina/embarque recorrente → LP frequentes; termos genéricos de solução/contato B2B → LP comercial.
2. **Uma promessa e um CTA principal por LP.** Sem navbar com links, mega menu, links editoriais, rastreio ou CTA alternativo competindo no primeiro viewport.
3. **Formulário progressivo:** pedir primeiro nome, empresa, e-mail corporativo, WhatsApp, origem/destino e intenção/frequência. Carga detalhada apenas na cotação, em etapa opcional ou no contato comercial.
4. **Confiança antes do envio:** explicar escopo atendido com fatos aprovados; usar evidências verificáveis (cobertura, processo, atendimento), sem prazos, números ou claims não confirmados.
5. **Remarketing LinkedIn:** criar audiências por visitas às LPs e páginas de solução, com exclusão de quem converteu e janelas coerentes com ciclo B2B. Usar consentimento/cookies e Insight Tag conforme governança de privacidade; excluir clientes recorrentes da comunicação de aquisição quando possível.
6. **Medição:** eventos separados `form_start`, `form_submit_success` (somente após confirmação real do endpoint) e visualização de cada obrigado. Persistir UTMs, gclid e parâmetros do LinkedIn até CRM; deduplicar conversões e importar qualidade do lead quando houver integração.
7. **Experimentos:** testar mensagem/ângulo e tamanho do formulário em ciclos separados. Métrica primária: lead qualificado por sessão/custo por lead qualificado, não apenas envio bruto. Acompanhar abandono, taxa de conversão por dispositivo e velocidade da página.

## Plano de implementação

1. Confirmar matriz de cobertura, perfil de carga aceito, SLA de retorno e destino operacional dos leads.
2. Integrar os três formulários a CRM/endpoint e registrar origem/campanha com validação de sucesso.
3. Montar as três LPs sem navegação, adaptadas ao mobile, acessíveis e com links legais mínimos.
4. Criar três páginas de obrigado e eventos de conversão distintos; remover redirecionamento automático.
5. Configurar Google Ads (conversão primária após envio aceito; chamadas como conversão secundária) e LinkedIn Insight Tag/audiências após consentimento.
6. Testar envio ponta a ponta, deduplicação, UTMs, páginas de obrigado, teclado/mobile e mensagens de erro antes de ativar campanhas.

## Referências de código consultadas

- `src/App.jsx` — rotas e aplicação global do header/footer.
- `src/components/SiteHeader.jsx` — links no header de landing.
- `src/pages/Conversion.jsx` — formulários compartilhados por contato/comercial/cotação/coleta e campanhas.
- `src/pages/ThankYou.jsx` — tipos de confirmação e retorno automático à home.
- `src/pages/QuoteWizard.jsx`, `src/components/CommercialFields.jsx` — cotação e qualificação comercial.
- `src/data/navigation.js`, `src/data/pageCatalog.json` — navegação e metadados.
- `README.md`, `.htaccess`, `vite.config.js` — natureza de protótipo, prefixo e publicação provisória.
