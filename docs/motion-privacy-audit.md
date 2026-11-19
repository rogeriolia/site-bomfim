# Auditoria de movimento, viewport e privacidade — protótipo

## Decisões de movimento

| Contexto | Regra aplicada | Motivo |
| --- | --- | --- |
| Navegação entre rotas | Sem fade ou deslocamento da página inteira | Evitar flash e perda de referência visual |
| Hero e primeira seção | Estáticos | Conteúdo principal aparece imediatamente |
| Seções seguintes | Entrada única de 240 ms, 7 px e opacidade inicial 94% | Sinalizar progressão sem esconder conteúdo antes do JavaScript |
| Mega menu | Entrada de 150 ms | Dar resposta ao acionamento |
| `prefers-reduced-motion` | Sem animação de seção/menu e sem zoom de imagem | Respeitar preferência do sistema |
| Planejador | Scroll suave só na ação de abrir contato; instantâneo com movimento reduzido | Movimento tem causa explícita |

Não usar parallax, flash, skeleton de página inteira nem animação de altura do hero. A revelação é progressiva e não deve bloquear leitura ou foco.

## Viewports verificados

Em 320, 390, 768, 1024 e 1440 px, a home não apresentou largura horizontal maior que o viewport. Em 320, 768 e 1440 px, foram verificados `/rotas`, `/conteudos`, artigo, landing page e `/privacidade`; não houve overflow horizontal e o banner de privacidade apareceu em todas as rotas. A validação visual final em dispositivos reais continua recomendada.

## Consentimento e publicação

- Preferências locais versão 1: categorias demonstrativas `analytics` e `marketing` desligadas por padrão; botões de rejeição e aceitação com igual acesso; personalização e revogação pelo rodapé.
- Não há analytics nem pixels ativos neste protótipo. Nenhum script opcional é liberado pelas preferências. Antes de adicionar GA4, GTM ou mídia paga, revisar finalidades com jurídico, integrar bloqueio prévio real e invalidar a versão 1 das preferências para pedir escolha novamente.
- Há armazenamento local da escolha e armazenamento de sessão da seleção de rotas. Os formulários não têm backend. Consultas opcionais de CEP/CNPJ podem enviar o número consultado à BrasilAPI; fontes são carregadas do Google Fonts.
- A página `/privacidade` é um texto preliminar, não uma política jurídica final. Validar responsável, encarregado, bases legais, prazos, fornecedores, exercício de direitos e versão de produção antes de publicar.

Referências: [Guia de cookies da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais) e [Consent Mode do Google](https://developers.google.com/tag-platform/security/guides/consent).
