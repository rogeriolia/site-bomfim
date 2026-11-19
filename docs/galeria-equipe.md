# Galeria da equipe Bomfim

Endereço previsto: https://4lia.com.br/site-bomfim/galeria-equipe/

A página está fora dos menus e do rodapé. Inclui 25 imagens conceituais com pessoas uniformizadas, filtros, ampliação e download individual ou em ZIP. Possui `noindex,nofollow,noarchive`, mas é pública, sem autenticação.

Fonte: `scripts/build-team-gallery.mjs`. O comando `npm run build` gera automaticamente o HTML e o ZIP em `public/galeria-equipe/`, depois os copia para `dist/galeria-equipe/`.

No servidor com o projeto espelhado, sincronizar `dist/` e o `.htaccess` da raiz. Se somente o conteúdo de `dist/` for publicado na raiz pública, a pasta estática `galeria-equipe/` funciona diretamente.

Não divulgar o endereço como ativo antes de confirmar que ele mostra o título “Pessoas que representam a Bomfim.” e que as imagens e o ZIP carregam. A resposta HTTP 200 isolada não confirma isso: o servidor pode retornar o HTML padrão do aplicativo.
