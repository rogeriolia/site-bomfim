from pathlib import Path
import json,zipfile,urllib.request
from PIL import Image,ImageOps,ImageDraw
root=Path(__file__).resolve().parents[2];base=root/'public/revisao-editorial';out=base/'carrosseis';data=json.loads((base/'conteudos.json').read_text());fonts=Path(__file__).parent/'fonts'
for family in ['manrope','dmsans']:
 file=fonts/(family+'-OFL.txt')
 if not file.exists():file.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/OFL.txt').read())
readme='''BOMFIM — CARROSSEL PARA REVISÃO\n\nFormato: 1080 × 1350 pixels (4:5), cinco telas.\nPNG: prévia em alta resolução, sRGB.\nSVG: vetor editável, com texto e logotipo vetorial.\nFontes: Manrope e DM Sans; arquivos e licenças OFL incluídos.\nIdentidade aplicada: vermelho #E8002D, azul-escuro #10233B, fundo #F5F7FA.\nO sistema visual segue a versão de testes do site Bomfim; a validação final da identidade cabe à marca.\nDados citados são acompanhados de fonte/período nas telas e na legenda.\nExemplos de cálculo e processo estão identificados como fictícios/hipotéticos.\nNão há fotografia gerada nem depoimento ou resultado atribuído à Bomfim.\nArtes destinadas à revisão, sem publicação automática em redes sociais.\nSVGs usam texto editável: instale as fontes incluídas para preservar a aparência.\n'''
for item in data['items'][:10]:
 art=item['instagram']['artwork'];folder=out/item['slug'];paths=[]
 for i in range(1,6):
  for suffix in ['.png','.svg']:paths.append(folder/(f'{i:02d}'+suffix))
 for p in paths:
  if not p.exists():raise RuntimeError(str(p))
  if p.suffix=='.png':
   with Image.open(p) as image:
    if image.size!=(1080,1350):raise RuntimeError('wrong size')
 with zipfile.ZipFile(folder/(item['slug']+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
  for p in paths:z.write(p,p.name)
  for p in fonts.iterdir():z.write(p,'fontes/'+p.name)
  z.writestr('LEIA-ME.txt',readme);z.writestr('legenda.txt',item['instagram']['caption']);z.writestr('artigo.txt',item['articleUrl'])
 contact=Image.new('RGB',(1350,338),'#F5F7FA')
 for i in range(5):
  im=Image.open(folder/(f'{i+1:02d}.png')).convert('RGB').resize((270,338));contact.paste(im,(i*270,0))
 contact.save(folder/'previa-completa.jpg',quality=92)
with zipfile.ZipFile(out/'bomfim-10-carrosseis.zip','w',zipfile.ZIP_DEFLATED) as z:
 for item in data['items'][:10]:
  folder=out/item['slug']
  for p in folder.iterdir():
   if p.suffix in ['.png','.svg']:z.write(p,item['slug']+'/'+p.name)
  z.writestr(item['slug']+'/legenda.txt',item['instagram']['caption'])
 for p in fonts.iterdir():z.write(p,'fontes/'+p.name)
 z.writestr('LEIA-ME.txt',readme)
lines=['# Desdobramentos — 21 conteúdos Bomfim','','Painel de revisão: https://www.4lia.com.br/site-bomfim/revisao-editorial/','','Os dez novos conteúdos incluem 50 artes em PNG e SVG editável. Os ZIPs incluem fontes e licenças. Nenhuma postagem ou envio é feito por este material.','']
for number,item in enumerate(data['items'],1):
 lines += [f'## {number}. {item["title"]}','','Artigo: '+item['articleUrl'],'','### LinkedIn','',item['linkedin']['text'],'','### Instagram','']
 if item['instagram'].get('artwork'):lines += ['**Artes e editáveis:** https://www.4lia.com.br/site-bomfim/revisao-editorial/'+item['instagram']['artwork']['zip'],'']
 for index,slide in enumerate(item['instagram']['slides'],1):lines += [f'**Tela {index}**','',slide,'']
 lines += ['**Legenda**','',item['instagram']['caption'],'','**Texto alternativo**','',item['instagram']['altText'],'','### E-mail','','**Assunto:** '+item['email']['subject'],'','**Prévia:** '+item['email']['preheader'],'',item['email']['body'],'','**Botão:** '+item['email']['cta']+' — '+item['email']['url'],'']
text='\n'.join(lines)+'\n';(base/'conteudos.md').write_text(text);(root/'docs/desdobramentos-editoriais-21-conteudos.md').write_text(text)
print('10 individual ZIPs + complete ZIP ready; 50 PNGs validated at 1080×1350; text exports updated.')
