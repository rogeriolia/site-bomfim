# Publicação e conferência — 18/10/2026

URL da biblioteca: https://www.4lia.com.br/site-bomfim/conteudos

Painel da agência: https://www.4lia.com.br/site-bomfim/revisao-editorial/

## Conferência na versão publicada

- 21 URLs distintas abertas no navegador: todas renderizaram título, quatro seções e referências.
- Índices de seções: nenhum destino ausente nos 21 artigos.
- Filtros testados por clique: Mercado e gestão (5), Pessoas e confiança (4), Tecnologia e produtividade (3), Operação (6), Frete sem caixa-preta (3).
- Todos: 20 cards na lista mais o artigo em destaque; contador ajustado para explicitar os 21 conteúdos.
- Painel da agência: 21 artigos e 63 materiais carregados; filtros por LinkedIn, Instagram e e-mail retornaram 21 materiais cada.
- Busca por WhatsApp retornou dois artigos; busca inexistente mostrou estado vazio.
- Botão de copiar texto: mensagem de sucesso e conteúdo confirmado na área de transferência do navegador.
- Downloads de Markdown e JSON: respostas HTTP 200; JSON usado pelo próprio painel para renderizar as 63 peças.
- Nove das 11 referências externas responderam HTTP 200 na conferência direta. Os dois links do IBGE responderam 403 ao cliente HTTP, mas ambos abriram normalmente no navegador e exibiram os títulos esperados; não foram classificados como links quebrados.
- Build gerado com sucesso e arquivos publicados em /www/site-bomfim/dist. Regras da pasta raiz atualizadas para servir o painel separado.

Backup dos pontos de entrada anteriores em `.codex-build/bomfim-deploy-*` na raiz local do workspace. Publicação por upload de arquivos novos e troca de entrada; assets anteriores preservados.

O painel não envia mensagens nem publica em redes. Contém textos, roteiro de carrossel, legendas e e-mails; não contém artes finais. É acessível por link, sem autenticação, e tem noindex/nofollow.

Evidência visual: `painel-agencia.png`.
