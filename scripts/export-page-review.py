"""Exporta a matriz editorial do frontend para a equipe de CMS/Python."""
import csv
import json
import re
from pathlib import Path
root = Path(__file__).resolve().parents[1]
rows = []
catalog = json.loads((root/'src/data/pageCatalog.json').read_text())
for path, page in catalog.items():
    rows.append({'path': path, **page})
for article in json.loads((root/'src/data/articles.json').read_text()):
    rows.append(dict(path='/conteudos/'+article['slug'], title=article['title'], heading=article['title'], description=article['summary'], image=article['image'], imageAlt=article['imageAlt'], area='content', indexable=True))
service_text = (root/'src/data/services.js').read_text()
try:
    pilot, _ = json.JSONDecoder().raw_decode(service_text[service_text.index('{'):])
except json.JSONDecodeError:
    pilot = None
if pilot:
    rows.append(dict(path='/solucoes/'+pilot['slug'],title=pilot['name']+' para empresas',heading=pilot['title'],description=pilot.get('metaDescription',pilot['intro']),image=pilot['illustration'],imageAlt=pilot['visualAlt'],area='institutional',indexable=True))
for block in (root/'src/data/services.js').read_text().split("slug: '")[1:]:
    def field(name):
        found = re.search(r"\b"+name+r": '([^']*)'", block)
        return found.group(1) if found else ''
    slug = block.split("'",1)[0]
    rows.append(dict(path='/solucoes/'+slug,title=field('name')+' para empresas',heading=field('title'),description=field('intro'),image=field('illustration'),imageAlt=field('visualAlt'),area='institutional',indexable=True))
cities={'Recife':'recife','Maceió':'maceio','Natal':'natal','Salvador':'salvador','Fortaleza':'fortaleza','Aracaju':'aracaju','Feira de Santana':'feira-de-santana','João Pessoa':'joao-pessoa'}
for route in json.loads((root/'src/data/routes.json').read_text()):
    origin,destination=route['origin'],route['destination']
    rows.append(dict(path='/rotas/'+route['id'],title=f'{origin} para {destination}: distribuição e estoques',heading=f'{origin} → {destination}',description=f'Planeje a distribuição de {origin} para {destination}. Confira os pontos de referência e reúna as informações para avaliar sua operação com a Bomfim.',image=f'/assets/units/{cities[destination]}.webp' if destination in cities else '/assets/hero-intercapital-bomfim-v2.webp',area='institutional',indexable=True))
rows.sort(key=lambda r:r['path'])
out=root/'docs/backend'; out.mkdir(exist_ok=True)
(out/'matriz-paginas.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
with (out/'matriz-paginas.csv').open('w',newline='',encoding='utf-8-sig') as f:
    writer=csv.DictWriter(f,fieldnames=['path','title','heading','description','image','imageAlt','area','indexable','canonicalPath'],extrasaction='ignore');writer.writeheader();writer.writerows(rows)
text='''# Revisão editorial e visual — páginas do site Bomfim

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
'''
for r in rows:
    vals=[r['path'],r['title'],r['heading'],r['image'].replace('/assets/','')]
    text+='| '+' | '.join(v.replace('|','\\|') for v in vals)+' |\n'
(out/'revisao-editorial-paginas.md').write_text(text)
print(f'Matriz exportada: {len(rows)} URLs; 21 artigos com imagens distintas.')
