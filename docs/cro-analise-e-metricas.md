# CRO e métricas das páginas Bomfim

## Escopo

Páginas de mídia paga: `/lp/cotacao`, `/lp/cotacao-completa`, `/lp/embarques-frequentes` e `/lp/falar-comercial`. A jornada de cotação por rota compartilha o wizard em `/lp/cotacao-completa`.

## Decisões de CRO

- Formulário inicial curto: nome, empresa e WhatsApp; e-mail opcional.
- Origem e destino são opcionais no wizard. A origem revela estados e cidades principais em duas colunas, seguida de busca nos municípios restantes; destino aparece depois da origem.
- CNPJ, pagador, endereço detalhado, cubagem, medidas, perfil e frequência ficam para a conversa com atendimento.
- Há saída explícita para quem prefere informar a rota depois e navegação em duas etapas.
- O modo `?mod_test=true` preenche o contato e usa CEPs reais cobertos (Recife `50030-230`, João Pessoa `58010-000`). Uma consulta fora da cobertura, por exemplo `01001-000`, informa que não há atendimento no momento e grava a verificação.
- Eventos de comportamento só são enviados com consentimento analítico. Nenhum valor digitado em formulário é coletado pela telemetria.

## Instrumentação e armazenamento

Banco PostgreSQL isolado `bomfim_analytics`, no servidor já usado pelo Lia Lab2b. O schema `api/schema.sql` cria leads, sessões anônimas, eventos, verificações de cobertura e a base de cobertura, com visões agregadas:

- `bomfim_landing_metrics_daily`: acessos, sessões, início/conclusão de formulário, conversões e taxa por página/dia.
- `bomfim_online_now`: sessões com heartbeat nos últimos dois minutos.
- `bomfim_heatmap_events`: coordenadas normalizadas de clique/movimento/rolagem para mapa de calor, sem conteúdo de campos.

O monitoramento cobre visualizações, usuários ativos, cliques, início e envio de formulário, conversões e interações de mapa de calor. Eventos incluem rota e campanha/UTMs permitidos. A coleta respeita a escolha de consentimento analítico.

## Critério para otimização

Acompanhar taxa de início e conclusão por página e dispositivo, abandono entre etapas do wizard, consultas de cobertura sem conversão e conversão final por campanha. Primeiro validar estabilidade e volume; depois testar alterações isoladas (CTA, título, etapa de rota), comparando conversão e qualidade do lead, não apenas cliques.
