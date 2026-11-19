# Revisão Hallmark: páginas de conversão Bomfim

**Data:** 10/11/2026  
**Escopo:** `/lp/cotacao`, `/lp/cotacao-completa`, `/lp/embarques-frequentes`, `/lp/falar-comercial` e confirmações `/obrigado/cotacao`, `/obrigado/embarques-frequentes`, `/obrigado/comercial`.

## Síntese

O conjunto já tem uma base de conversão adequada: LPs sem navegação concorrente, formulário ao lado do hero no desktop, CTA que leva ao formulário, três campos iniciais e e-mail opcional. No celular vira uma coluna, sem rolagem horizontal. As prioridades identificadas foram corrigidas nesta rodada; pendências de revisão jurídica e configuração de e-mail continuam dependentes da operação.

## Achados priorizados

### P0 — resolver antes de comprar tráfego

1. **Corrigido — aviso de cookies cobria conteúdo.** Nas capturas anteriores de 1280×800 e 375 px o aviso cobria controles. Foi movido para o fluxo, abaixo do cabeçalho das LPs, em vez de flutuar sobre campos e CTAs.
2. **Corrigido — consentimento correspondia a categorias excessivas.** “Permitir medição” agora ativa somente analytics; `marketing` fica falso. A versão do consentimento foi atualizada para solicitar uma nova escolha.
3. **Corrigido — política contradizia o fluxo.** O texto agora descreve envio/armazenamento de leads, consulta de CEP e telemetria condicionada ao consentimento, sem afirmar que um pixel de remarketing está ativo. A revisão jurídica e a confirmação de retenção/base legal continuam pendentes antes de publicação.

### P1 — conversão e acessibilidade

4. **Corrigido — wizard concentrava origem e destino.** A rota agora tem três passos, origem, destino e contato; origem e destino aparecem separadamente, a rota continua opcional e cada avanço tem telemetria `form_step` somente após consentimento.
5. **Corrigido — baixo contraste e foco.** A borda de campos foi escurecida e inputs têm anel de foco de teclado explícito.
6. **Corrigido — rótulos longos.** As ações iniciais foram encurtadas para “Pedir cotação”, “Falar sobre envios” e “Falar com comercial”. O aceite curto de cookies tem tamanho de fonte menor em telas compactas.
7. **Corrigido — texto repetido no hero.** Nas LPs dedicadas há um único ponto curto; a frase de garantia repetida foi removida. Links de cobertura e unidades continuam disponíveis.

### P2 — continuidade após conversão

8. **Corrigido — mensagem de cotação prometia dados não coletados.** A confirmação agora informa recebimento e retorno pelo contato fornecido.
9. **Corrigido — próximo passo.** As três telas de obrigado agora oferecem atalho contextual para WhatsApp/0800, além de voltar ao início.
10. **A animação é breve e acessível a movimento reduzido.** A comemoração em canvas dura cerca de 2,2 s e é desativada com `prefers-reduced-motion` em [ThankYou.jsx](/Users/apololira/PhpstormProjects/4lia/site-bomfim/src/pages/ThankYou.jsx:16). A captura estática não mostra os confetes porque a janela é curta; validar em uma visita ao vivo e manter a mensagem de sucesso clara sem a animação.

## Resultado da correção

- O aviso de cookies não cobre mais formulário; “Permitir medição” grava `analytics=true` e `marketing=false`.
- O wizard agora tem três etapas e preserva a rota como opcional; avanço de etapa usa o evento `form_step` somente após consentimento analítico.
- O texto do hero e os botões das LPs ficaram mais curtos. Campos receberam borda de maior contraste e foco visível.
- As páginas de obrigado confirmam o retorno pelo contato e apresentam WhatsApp/0800; a animação continua respeitando movimento reduzido.
- **Ainda pendente antes de mídia:** revisão jurídica da política de privacidade e configuração/validação da chave de e-mail de produção. Após publicação, comparar início/conclusão do wizard com a LP de contato curto.

## Método e limites

Rodei Hallmark `sloplint --render` nas sete rotas, em renderizações de 320, 375, 414, 1280, 1440 e 1920 px, e inspecionei as capturas desktop e mobile. O check visual usou `mod_test=true` nas LPs; os leads de teste continuam marcados como `test_mode`.

O CSS do site está concentrado em um stylesheet global. Quando esse arquivo é passado integralmente ao linter, ele reporta centenas de ocorrências de páginas fora deste escopo. Esses totais não representam um score das LPs e não são usados aqui. Após as correções, verifiquei a cotação a 320 e 1280 px; no wizard percorri origem, destino, contato e confirmação com os CEPs de teste. O contato WhatsApp some enquanto o formulário está à vista. A escolha “Permitir medição” foi conferida no armazenamento local e habilita analytics sem marketing.
