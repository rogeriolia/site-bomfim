# Bomfim — dicionário de medição v1

Complemento ao [modelo inicial](README.md). Métricas analíticas descrevem apenas o universo com medição autorizada; solicitações recebidas são o total operacional do backend. Não apresentar esses universos como se fossem iguais.

## Painéis e perguntas

| Visão | Pergunta | Métricas principais | Filtros |
|---|---|---|---|
| Visão geral | O site atrai e gera demanda? | Sessões, navegadores, solicitações recebidas, sessões convertidas | Período, ambiente, origem, dispositivo |
| Institucional | Quais serviços e rotas geram interesse? | Páginas, CTAs, destinos selecionados, abertura de contato | Página, serviço, origem de aquisição |
| Conteúdos | O visitante realmente lê e avança? | Visualizações, leitura qualificada, conclusão, CTA e conversão assistida | Artigo, categoria, origem, dispositivo |
| Landing pages | Qual campanha traz resultado? | Sessões de entrada, início de formulário, tentativas e conversões confirmadas | Campanha, estágio, canal, público declarado |
| Formulários | Onde existe atrito? | Sessões com início, erro, tentativa e sucesso | Formulário, campo com erro, dispositivo |
| Públicos | Quem demonstra qual interesse? | Conteúdo, rotas, abandono, declaração de cliente/prospect, intenção de atendimento | Consentimento, janela e contexto |
| Qualidade | A medição está íntegra? | Eventos rejeitados, duplicados, atraso de ingestão, erros de API | Ambiente, versão do coletor |

A visão de qualidade exige logs técnicos agregados adicionais no backend, sem payload de formulário. O esquema v1 não armazena rejeições como eventos de visitantes.

## Definições que evitam interpretações erradas

- **Navegador:** UUID pseudônimo de um navegador consentido; não é cliente nem pessoa única.
- **Sessão:** visita encerrada após 30 minutos de inatividade. Dimensões de entrada ficam fixas até a próxima sessão.
- **Área:** `institutional`, `content`, `landing`, `conversion`, `utility`. Separar relatório por área de entrada ou área visitada, nomeando explicitamente a escolha.
- **Taxa de conversão por sessão:** sessões com pelo menos uma conversão confirmada ÷ sessões elegíveis. Contar solicitações por sessão é outra métrica, que pode exceder 100%.
- **Início de formulário:** primeira interação com campo, uma vez por formulário/sessão.
- **Abandono:** sessão com início de formulário, sem conversão daquele formulário; fechar resultado após o término da sessão. Taxa = sessões abandonadas ÷ sessões que iniciaram.
- **Leitura qualificada:** artigo com pelo menos 30 segundos ativos e 50% de profundidade, ambos na mesma visualização.
- **Leitura concluída:** pelo menos 60 segundos ativos e 90% de profundidade; é sinal comportamental, não prova de compreensão. Profundidade usa altura útil do artigo, não rodapé/relacionados.
- **Conversão assistida por conteúdo:** sessão que leu artigo de forma qualificada antes da conversão, dentro da mesma sessão. Um lead assistido por vários artigos pode aparecer em vários artigos; não somar como leads únicos.
- **Saída para portal:** clique para software externo; não indica login, atendimento concluído ou cliente confirmado.
- **Custo/CPL/ROAS:** não disponíveis só com dados do site. Exigem integração de investimento de mídia; ROAS também exige receita atribuída do CRM. Não simular esses valores.

## Eventos e campos

Todos os eventos usam UUID de deduplicação, sessão, momento, recibo de consentimento e visualização quando aplicável. Os nomes abaixo são o contrato próprio; GTM pode mapear para eventos recomendados GA4.

| Evento próprio | Quando registrar | Campos adicionais permitidos |
|---|---|---|
| `page_views` (registro, não linha em events) | Nova navegação real | Página, pathname sem query/hash, área, tipo, slug |
| `cta_click` | Ação editorial/comercial | `cta_id` cadastrado |
| `form_start` | Primeira interação no formulário | `form_id` |
| `form_error` | Validação impede avanço | `form_id`, `field_key`; sem valor digitado |
| `form_submit_attempt` | Tentativa de envio | `form_id` |
| `conversions` (registro separado) | API confirma recebimento | Formulário, token opaco, campanha, área de origem |
| `route_origin_select` | Troca da origem | `route_id` quando aplicável; sem endereço/CEP |
| `route_destination_select` | Seleção de destino | `route_id`, `destination_count` |
| `route_plan_open` | Abre o contato do planejador | `destination_count` |
| `content_engaged` | Atinge 30s ativos e 50% | `content_slug`; uma vez por visualização |
| `content_complete` | Atinge 60s ativos e 90% | `content_slug`; uma vez por visualização |
| `portal_outbound` | Acesso ao portal/rastreio externo | `cta_id`; nunca documento/código consultado |
| `phone_click` / `whatsapp_click` | Clique no canal de atendimento | `cta_id`; sem o contato pessoal do visitante |

Não registrar snapshots de campos ou texto livre. Campos de origem, meio e campanha aceitam somente valores normalizados e limitados pelo backend. Capturar UTMs permitidas, nunca URL/referrer integral; referências externas só por host. IDs de clique de mídia não entram no modelo inicial.

## Aquisição e contexto de conversão

- `entry_area` e `campaign_id` na sessão representam a entrada. `source_area` na conversão representa o contexto onde a solicitação foi originada.
- Se uma landing encaminha o usuário à cotação institucional, preservar campanha validada no contexto de negócio até o envio; não inferir campanha pelo endereço do obrigado.
- Relatórios de entrada têm sessões mutuamente exclusivas por área. Relatórios de áreas visitadas têm sobreposição: a mesma sessão pode visitar conteúdo e institucional.
- Janelas entre sessões não são atribuídas nesta v1. Um ID de navegador pode apoiar análises futuras, mas não dá identidade entre dispositivos.
- Eventos comerciais/recebimento seguem para GA4 por uma única implementação, evitando dupla conversão de GTM e backend. Pixels usam autorização de marketing e token de deduplicação adequado à plataforma.

## Separação de públicos

| Público | Regra inicial | Limitação |
|---|---|---|
| Desconhecido | Sem declaração/CRM | Não é sinônimo de novo cliente |
| Cliente declarado | Respondeu que já é cliente | Ainda não confirmado pelo CRM |
| Prospect declarado | Respondeu que não é cliente | Não inferir pela primeira visita |
| Cliente confirmado | CRM validou a relação | Integração futura, fora da v1 |
| Interesse em atendimento | Clique no portal, telefone ou WhatsApp | Pode ser prospect ou cliente |
| Conteúdo engajado | Leitura qualificada em 30 dias | Requer consentimento de marketing para ativação em mídia |
| Abandono | Iniciou e não concluiu formulário na sessão encerrada | Excluir conversões posteriores conforme regra da campanha |

Os públicos são critérios documentados, não listas já publicadas nas plataformas. GA4/GTM e a base própria precisam compartilhar nomes e regras, sem compartilhar PII.
