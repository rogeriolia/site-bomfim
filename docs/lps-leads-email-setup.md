# Landing pages e notificações de leads Bomfim

## Fluxos

- `/lp/cotacao` → `/obrigado/cotacao`
- `/lp/embarques-frequentes` → `/obrigado/embarques-frequentes`
- `/lp/falar-comercial` → `/obrigado/comercial`
- `/lp/cotacao-completa` → `/obrigado/cotacao`

Cada LP tem cabeçalho sem navegação, formulário e layout móvel próprio. O endpoint Python `POST /api/leads.php` (FastAPI via `run.py`) valida os campos essenciais e só aceita esses três tipos. Com envio aceito pela API de e-mail, dispara a notificação interna para `apolo@4lia.com.br` e a confirmação para o e-mail do lead. O HTML das duas mensagens usa estilos inline para compatibilidade com clientes de e-mail.

## Modo de teste

Abra uma das LPs com `?mod_test=true`, por exemplo:

`https://www.4lia.com.br/site-bomfim/lp/cotacao?mod_test=true`

O formulário é preenchido com dados fictícios e mostra o aviso de teste. O wizard usa CEPs atendidos reais de Recife e João Pessoa; use `01001-000` para verificar o aviso de CEP sem cobertura. Ao enviar, o lead é gravado com `test_mode=true`; quando configurado, o assunto interno recebe `[TESTE]` e o e-mail de teste vai para `apolo+cliente@4lia.com.br`.

## Configuração da API Python

Defina as variáveis do arquivo `.env.bomfim.example` no ambiente do processo `python run.py` (systemd, supervisor ou `.env` local). Não coloque a chave em React, Vite, HTML ou em arquivo versionado. `BOMFIM_LEADS_EMAIL` tem fallback em `apolo@4lia.com.br`; `BOMFIM_TEST_EMAIL`, em `apolo+cliente@4lia.com.br`. O lead é persistido no PostgreSQL (`BOMFIM_DATABASE_URL`) mesmo sem chave Brevo; nesse caso a API informa `notificationPending` e `clientReceiptPending`, e os status permanecem `pending`. Configure a chave do Brevo e um remetente autenticado para enviar as mensagens. Detalhes de deploy em [`docs/backend/deploy-python.md`](backend/deploy-python.md).

O remetente precisa estar autenticado/verificado na conta Brevo que será fornecida para Bomfim. Configure também o domínio exato em `BOMFIM_SITE_ORIGIN` caso o deploy utilize domínio diferente.

## Payload e atribuição

O navegador envia categoria, campos preenchidos, URL e parâmetros de campanha. A mensagem interna inclui UTMs, `gclid` e `li_fat_id` quando presentes. A confirmação ao cliente não inclui os dados de campanha. Nenhum dado deve ser considerado recebido até o endpoint responder sucesso.
