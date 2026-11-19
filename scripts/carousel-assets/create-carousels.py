"""Build editable SVG carousel art. Render PNG using render-carousels.cjs afterwards."""
from pathlib import Path
from PIL import ImageFont
import json,html,re
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/revisao-editorial/carrosseis';OUT.mkdir(parents=True,exist_ok=True)
FONTS=Path(__file__).parent/'fonts'
DATA=json.loads((ROOT/'public/revisao-editorial/conteudos.json').read_text())
RED='#E8002D';DARK='#10233B';INK='#1F2330';MUTED='#526176';PALE='#F5F7FA';LINE='#DDE4EE'
LOGO=(ROOT/'public/assets/bomfim-logo-compact.svg').read_text();LOGOINNER=re.search(r'<svg[^>]*>(.*)</svg>',LOGO,re.S).group(1)
# Every slide has authored copy and a diagram tied to its actual topic; no stock performance claims.
SETS=[
('ESTOQUE E CAIXA','stock',[
('Estoque cheio.\nProduto faltando.','O saldo total pode esconder o item que seu cliente precisa.','Perguntas melhores para a reposição.'),
('O que está no depósito\nnem sempre está disponível.','Produtos reservados, bloqueados ou sem condição de venda precisam aparecer separados.','Separe saldo físico, disponível e comprometido.'),
('Quatro semanas\nsão suficientes?','Se a reposição leva seis, o saldo merece atenção. A conta inicial não define o estoque de segurança.','EXEMPLO FICTÍCIO · ritmo de saída constante'),
('Comece por\num grupo de itens.','O caso CSN relatou revisão de quase 300 políticas e R$ 75 milhões liberados em estoque. É um caso divulgado com fornecedor participante, não uma meta para sua empresa.','Fonte: Tecnologística · 13/10/2026'),
('Antes de comprar mais,\nrevise o critério.','Compare giro, saldo e reposição. Dê prioridade aos itens críticos para o atendimento.','Salve este roteiro para conversar com compras.')]),
('MERCADO E DEMANDA','market',[
('Uma média.\nMuitos caminhos.','O varejo pode parecer estável enquanto as categorias seguem direções diferentes.','Olhe para o mercado. Decida pelo seu mix.'),
('Varejo: +0,1%\nem agosto.','Variação sobre julho de 2026, com ajuste sazonal. O total nacional não descreve todos os produtos.','Fonte: IBGE · PMC · divulgado em 15/10/2026'),
('Os setores não\nseguiram a média.','Informática e escritório cresceram. Móveis e eletrodomésticos recuaram no mesmo recorte mensal.','Brasil · agosto/julho 2026 · ajuste sazonal · IBGE'),
('Seu produto precisa\nde uma leitura própria.','Cruze o indicador de mercado com vendas, margem e disponibilidade. Uma falta de produto também pode limitar as vendas.','O dado nacional não prevê o próximo mês.'),
('Revise o mix\ncom três perguntas.','A categoria corresponde ao meu setor? A variação é preço ou volume? Faltou produto para vender?','Salve e use na próxima conversa sobre compras.')]),
('ATENDIMENTO E VENDAS','messages',[
('O pedido saiu\nda conversa?','Uma confirmação em texto. Uma mudança em áudio. Qual versão chegou à expedição?','Organize a passagem entre venda e operação.'),
('O canal é popular.\nO registro precisa ser claro.','79% das empresas pesquisadas usavam WhatsApp ou Telegram em 2025. O indicador reúne as duas plataformas.','Fonte: Cetic.br · TIC Empresas 2025'),
('Uma ficha curta\nevita adivinhação.','Identifique pedido e versão. Registre itens, quantidades, destino e condições confirmadas.','Modelo de processo · adapte à sua equipe'),
('Destaque o que\nainda falta confirmar.','Pedido aceito não significa prazo validado. Registre pendência, responsável e próximo retorno.','EXEMPLO FICTÍCIO · pedido 482'),
('A passagem termina\nquando alguém assume.','O próximo profissional consegue continuar o atendimento sem reler toda a conversa?','Salve o roteiro e teste com um pedido.')]),
('TECNOLOGIA E PRODUTIVIDADE','ai',[
('Escolha a tarefa.\nDepois, a IA.','O primeiro teste deve resolver um trabalho que sua equipe conhece.','Comece pequeno. Meça. Revise.'),
('15% das pequenas\npesquisadas usavam IA.','TIC Empresas 2025: pequenas com 10 a 49 pessoas ocupadas. Não é um indicador de todos os MEIs.','Fonte: Cetic.br · adoção não comprova produtividade'),
('Teste uma resposta\nque possa ser conferida.','Classificar solicitações é um exemplo. Defina a resposta esperada e quem fará a revisão.','Use exemplos sem dados pessoais ou comerciais sensíveis.'),
('Meça o trabalho\naté a correção final.','Compare tempo de execução, revisão e retrabalho. Observe também a consequência de cada erro.','Sugestão de piloto · sem promessa de economia'),
('Amplie só o que\na equipe controla.','Registre falhas e critérios de aprovação. Mantenha uma alternativa manual para continuar o trabalho.','Salve este roteiro antes de escolher a ferramenta.')]),
('COMPRAS E CUSTOS','price',[
('O preço mudou.\nQual conta mudou?','Total do orçamento, preço por unidade e quantidade são coisas diferentes.','Abra a conta antes de negociar.'),
('A compra anterior:\n100 unidades.','No exemplo, cada unidade custa R$ 20. O total é R$ 2.000.','EXEMPLO FICTÍCIO · valores para explicar a comparação'),
('A nova compra:\n120 unidades.','Cada unidade passa a R$ 21. O total chega a R$ 2.520. Quantidade e preço mudaram juntos.','EXEMPLO FICTÍCIO · não é cotação Bomfim'),
('Total: +26%.\nUnidade: +5%.','O Sinapi variou 0,30% em setembro/2026. Esse índice de construção não determina o reajuste de qualquer compra.','Fonte do índice: IBGE · Sinapi · 09/10/2026'),
('Compare o mesmo\nproduto e serviço.','Confira especificação, quantidade, preço unitário, itens incluídos, pagamento e validade da proposta.','Salve a lista para revisar o próximo orçamento.')]),
('DADOS E GESTÃO','versions',[
('Qual versão\ndo pedido vale?','A planilha da manhã ou a mensagem recebida à tarde?','Informação confiável precisa de um lugar definido.'),
('Nuvem não organiza\num dado sozinha.','36% das empresas pesquisadas pagavam por capacidade de processamento em nuvem em 2025. Isso não mede a qualidade dos registros.','Fonte: Cetic.br · TIC Empresas 2025'),
('Escolha uma\nfonte válida.','Defina onde fica o registro aceito e como uma alteração chega a quem precisa agir.','Comece por um fluxo · exemplo: endereço de entrega'),
('O campo significa\na mesma coisa para todos?','“Data de entrega” pode ser solicitação, estimativa ou confirmação. Separe os sentidos antes de integrar.','Modelo de organização · adapte ao seu processo'),
('Dê nome\nao responsável.','Quem valida? Quem atualiza? Quem resolve o conflito entre versões? Meça a busca e o retrabalho no próprio fluxo.','Salve e revise um campo com a sua equipe.')]),
('REPOSIÇÃO E MRO','parts',[
('Peça de baixo giro.\nProblema de alto impacto.','O item pode vender pouco e ainda ser crítico para o cliente.','Giro sozinho não define a reposição.'),
('O dado agregado\nnão é a sua peça.','O grupo veículos, motos, partes e peças caiu 1,0% em agosto/julho de 2026, com ajuste sazonal. Inclui veículos: não é autopeças isoladas.','Fonte: IBGE · PMC · 15/10/2026'),
('Cruze giro\ne criticidade.','Pergunte qual é a consequência de faltar. Compare isso à frequência de saída e ao prazo real de reposição.','Matriz de análise · não define níveis automáticos de estoque'),
('Mesmo giro.\nRiscos diferentes.','Uma peça chega no dia seguinte. Outra leva semanas e não tem substituto aprovado. A mesma regra pode ignorar essa diferença.','EXEMPLO HIPOTÉTICO · valide com a área técnica'),
('Revise o item,\nnão só a média.','Há alternativa aprovada? O prazo real é igual ao cadastrado? A compra atende demanda ou receio de faltar?','Salve para conversar com compras e manutenção.')]),
('EMBALAGEM E EXPEDIÇÃO','label',[
('A caixa está pronta.\nA etiqueta também?','Proteção e identificação precisam funcionar juntas até a entrega.','Um cuidado simples antes de expedir.'),
('Os dados precisam\ncontinuar legíveis.','Confira origem, destino e identificação do pedido. Não dependa da memória de quem preparou a remessa.','Referência: Correios · Guia Técnico de Endereçamento'),
('Evite duas\nhistórias na mesma caixa.','Uma etiqueta antiga pode entrar em conflito com a identificação válida. Confira antes do fechamento final.','Modelo de conferência · valide o padrão do transportador'),
('Uma função\nnão substitui a outra.','Etiqueta identifica. Embalagem protege. Documentação acompanha o enquadramento do embarque.','Referência postal não define aceitação de carga na Bomfim.'),
('Peça outra\npessoa para conferir.','Ela consegue reconhecer destino, pedido e volumes sem explicação verbal? Se não, revise a identificação.','Salve este teste para a próxima expedição.')]),
('DISPONIBILIDADE E VALIDADE','health',[
('Disponível\né mais que quantidade.','Em produtos com validade ou conservação específica, o saldo é só parte da decisão.','Revise a reposição por item e por lote.'),
('Uma categoria.\nProdutos diferentes.','O grupo farmacêuticos, médicos, ortopédicos e perfumaria avançou 0,7% em agosto/julho de 2026, com ajuste sazonal.','IBGE · PMC · não mede pedidos hospitalares específicos'),
('Enxergue o lote\nalém do total.','Confira saldo liberado, pedidos assumidos e validade. Quantidades bloqueadas precisam aparecer separadas.','EXEMPLO DE PROCESSO · siga a avaliação técnica aplicável'),
('Medicamentos exigem\navaliação própria.','A Anvisa tem orientações específicas de distribuição, armazenagem e transporte. Elas não se aplicam automaticamente a todo produto de saúde.','Referência: Anvisa · guia da RDC 430/2020, atualizado em 2022'),
('Valide antes\nde comprar e transportar.','Confirme requisitos do produto com a equipe responsável. O roteiro não confirma habilitação ou aceitação pela Bomfim.','Salve para a próxima revisão de abastecimento.')]),
('PROCESSOS E AUTOMAÇÃO','status',[
('“Recebido”\nsignifica o quê?','A portaria, a operação e o comercial entendem o mesmo evento?','Combine o significado antes de automatizar.'),
('Tecnologia precisa\nde eventos bem definidos.','14% das empresas pesquisadas usavam dispositivos inteligentes ou IoT em 2025. O dado não mede maturidade do estoque.','Fonte: Cetic.br · TIC Empresas 2025'),
('Chegou?\nFoi conferido?','A chegada física e a conclusão da conferência são eventos diferentes. Defina a evidência necessária para cada um.','Dicionário de status · modelo para adaptação'),
('Está disponível\nou reservado?','A disponibilidade depende das regras de liberação. A reserva vincula uma quantidade a um pedido identificado.','Modelo de processo · não é regra automática de sistema'),
('Teste o significado\ncom uma exceção.','Quem confirma o evento? O que muda na próxima etapa? Como corrigir um registro e manter seu histórico?','Salve e combine os status com a equipe.')])
]

def esc(t):return html.escape(str(t))
def rect(x,y,w,h,fill,rx=0,stroke=None):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="2"' if stroke else '')+'/>'
def text(t,x,y,size=32,color=INK,bold=False):return f'<text x="{x}" y="{y}" fill="{color}" font-family="{("Manrope" if bold else "DM Sans")}" font-size="{size}" font-weight="{800 if bold else 400}">{esc(t)}</text>'
def wrap(t,width,size,bold=False):
 font=ImageFont.truetype(str(FONTS/('Manrope-800.ttf' if bold else 'DM-Sans-400.ttf')),size)
 result=[]
 for para in t.split('\n'):
  line=''
  for word in para.split():
   test=(line+' '+word).strip()
   if font.getlength(test)>width and line:result.append(line);line=word
   else:line=test
  if line:result.append(line)
 return result

def block(t,x,y,width,size,color=INK,bold=False,leading=1.22):
 lines=wrap(t,width,size,bold)
 return ''.join(text(l,x,y+i*size*leading,size,color,bold) for i,l in enumerate(lines)),y+len(lines)*size*leading

def arrow(x,y,w=100,color=RED):return f'<path d="M{x} {y}h{w}m-22 -20 22 20-22 20" fill="none" stroke="{color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
def card(x,y,w,h,label,value,color=INK):return rect(x,y,w,h,'#FFFFFF',18,LINE)+text(label,x+24,y+43,25,MUTED)+text(value,x+24,y+110,48,color,True)
def diagram(kind,j):
 # All diagrams use a fixed safe area: x=64..1016, y=720..1100.
 x=64;y=735
 if kind=='stock':
  if j==2:return card(x,y,290,250,'DISPONÍVEL','40 un.')+card(x+330,y,290,250,'SAÍDA / SEMANA','10 un.')+card(x+660,y,290,250,'COBERTURA','4 sem.',RED)+text('Reposição: 6 semanas · atenção ao intervalo',x+28,y+305,31,INK,True)
  if j==3:return card(x,y,455,250,'CASO DIVULGADO','R$ 75 mi',RED)+card(x+495,y,455,250,'POLÍTICAS REVISTAS','≈ 300')+text('Resultado do caso CSN, não promessa de economia.',x+20,y+305,27,MUTED)
  a=rect(x,y,952,330,'#FFFFFF',20,LINE)
  for row in range(2):
   for col in range(6):
    xx=x+34+col*150;yy=y+35+row*130
    a+=rect(xx,yy,122,96,RED if (row,col)==(0,3) else '#E9EEF4',8)
    a+=text('?' if (row,col)==(0,3) else ('02' if row else '01'),xx+38,yy+62,34,'#FFFFFF' if (row,col)==(0,3) else DARK,True)
  return a
 if kind=='market':
  if j==1:return rect(x,y,952,320,'#FFFFFF',20,LINE)+text('+0,1%',x+45,y+160,126,RED,True)+text('VAREJO · BRASIL',x+47,y+220,28,DARK,True)+text('Agosto / julho de 2026 · ajuste sazonal',x+47,y+270,28,MUTED)
  zero=x+475
  a=rect(x,y,952,330,'#FFFFFF',20,LINE)+f'<path d="M{zero} {y+70}V{y+290}" stroke="{LINE}" stroke-width="3"/>'+text('Informática / escritório',x+32,y+48,27,DARK)+rect(zero,y+78,347,60,RED,4)+text('+6,3%',zero+355,y+123,32,RED,True)+text('Móveis / eletrodomésticos',x+32,y+190,27,DARK)+rect(zero-231,y+217,231,60,DARK,4)+text('−4,2%',zero+25,y+261,38,DARK,True)
  if j not in [0,2]:a=card(x,y,290,235,'MERCADO','Contexto')+card(x+330,y,290,235,'EMPRESA','Histórico')+card(x+660,y,290,235,'PRODUTO','Decisão',RED)
  return a
 if kind=='messages':
  if j==1:return card(x,y,952,300,'WHATSAPP OU TELEGRAM · TIC EMPRESAS 2025','79%',RED)
  a=rect(x,y,952,330,'#FFFFFF',20,LINE)+rect(x+30,y+25,580,78,'#E9EEF4',16)+text('Pedido 482 · versão confirmada',x+52,y+74,29,DARK,True)+rect(x+270,y+125,650,78,'#FDE8EC',16)+text('Destino + itens + quantidades',x+292,y+174,29,DARK)+rect(x+30,y+225,780,78,'#E9EEF4',16)+text('Pendência → responsável → retorno',x+52,y+274,29,DARK,True)
  return a
 if kind=='ai':
  if j==1:return card(x,y,952,300,'PEQUENAS PESQUISADAS · 10–49 PESSOAS','15%',RED)
  a=''
  for k,(label,v) in enumerate([('01 · TAREFA','Entrada'),('02 · PESSOA','Revisão'),('03 · MEDIDA','Resultado')]):
   a+=card(x+k*330,y,290,235,label,v,RED if k==1 else INK)
   if k<2:a+=arrow(x+293+k*330,y+117,32,DARK)
  return a+text('Tempo total = executar + revisar + corrigir',x+20,y+305,33,DARK,True)
 if kind=='price':
  if j==1:return card(x,y,952,300,'COMPRA ANTERIOR · EXEMPLO FICTÍCIO','100 × R$ 20',RED)+text('Total: R$ 2.000',x+28,y+238,46,DARK,True)
  if j==2:return card(x,y,952,300,'NOVA COMPRA · EXEMPLO FICTÍCIO','120 × R$ 21',RED)+text('Total: R$ 2.520',x+28,y+238,46,DARK,True)
  if j==3:return card(x,y,455,285,'VARIAÇÃO DO TOTAL','+26%',RED)+card(x+495,y,455,285,'PREÇO UNITÁRIO','+5%',DARK)
  return card(x,y,455,285,'COMPARE','Escopo')+card(x+495,y,455,285,'ABRA A CONTA','Quantidade',RED)
 if kind=='versions':
  if j==1:return card(x,y,952,300,'PROCESSAMENTO EM NUVEM · PESQUISADAS','36%',RED)
  a=rect(x,y,952,330,'#FFFFFF',20,LINE)
  for k,(label,value) in enumerate([('PEDIDO · 09H','Versão 01'),('PEDIDO · 15H','Versão 02')]):a+=card(x+30+k*460,y+30,430,240,label,value,RED if k else INK)
  return a+text('Qual alteração foi validada?',x+36,y+312,27,MUTED)
 if kind=='parts':
  if j==1:return card(x,y,952,300,'VEÍCULOS, MOTOS, PARTES E PEÇAS','−1,0%',RED)
  if j==3:return card(x,y,455,285,'PEÇA A · EXEMPLO','1 dia')+card(x+495,y,455,285,'PEÇA B · EXEMPLO','Semanas',RED)
  a=rect(x,y,952,340,'#FFFFFF',20,LINE)
  for k,(label,c) in enumerate([('Alto giro / alta criticidade',RED),('Baixo giro / alta criticidade',DARK),('Alto giro / menor criticidade',DARK),('Baixo giro / menor criticidade',DARK)]):
   xx=x+20+(k%2)*466;yy=y+20+(k//2)*155;a+=rect(xx,yy,446,140,'#FDE8EC' if k==0 else PALE,10);z,_=block(label,xx+22,yy+52,400,27,c,True);a+=z
  return a
 if kind=='label':
  a=rect(x,y,952,340,'#FFFFFF',20,LINE)+f'<path d="M{x+100} {y+70}l260-45 260 45v215l-260 35-260-35z" fill="#E9EEF4" stroke="{DARK}" stroke-width="3"/>'
  a+=rect(x+175,y+115,285,140,'#FFFFFF',8,DARK)+text('DESTINO / PEDIDO',x+194,y+150,22,DARK,True)
  for i in range(23):a+=rect(x+195+i*10,y+175,3+(i%3),43,DARK)
  a+=text('01 / 05',x+194,y+242,23,DARK,True)+arrow(x+675,y+150,150,RED)+text('Legível?',x+665,y+219,35,RED,True)
  return a
 if kind=='health':
  if j==1:return card(x,y,952,300,'GRUPO FARMACÊUTICOS / MÉDICOS / PERFUMARIA','+0,7%',RED)
  a=rect(x,y,952,340,'#FFFFFF',20,LINE)
  for k,(label,v) in enumerate([('LOTE A','Conferir validade'),('LOTE B','Conferir liberação')]):
   yy=y+26+k*150;a+=rect(x+24,yy,904,128,PALE,10)+text(label,x+48,yy+47,27,RED,True)+text(v,x+48,yy+94,34,DARK,True)
  return a
 if kind=='status':
  a=rect(x,y,952,340,'#FFFFFF',20,LINE)
  for k,v in enumerate(['Chegada','Conferência','Disponível','Reserva']):
   xx=x+35+k*230;a+=f'<circle cx="{xx+80}" cy="{y+105}" r="49" fill="{RED if k==2 else DARK}"/>'+text(str(k+1).zfill(2),xx+51,y+121,39,'#FFFFFF',True)+text(v,xx+4,y+207,27,DARK,True)
   if k<3:a+=arrow(xx+139,y+105,70,DARK)
  return a+text('Cada evento precisa de evidência e responsável.',x+35,y+292,29,MUTED)
 return ''

manifest=[]
for i,(series,kind,slides) in enumerate(SETS):
 item=DATA['items'][i];slug=item['slug'];directory=OUT/slug;directory.mkdir(exist_ok=True)
 art={'width':1080,'height':1350,'status':'Prévia para revisão','zip':'carrosseis/'+slug+'/'+slug+'.zip','slides':[]}
 for j,(title,body,note) in enumerate(slides):
  dark=j in (0,4);background=DARK if dark else PALE;color='#FFFFFF' if dark else INK
  s=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350"><title>{esc(title.replace(chr(10)," "))}</title><desc>{esc(body+" "+note)}</desc>'+rect(0,0,1080,1350,background)
  # Preserve official vector paths; only use white fill on dark applications.
  mark=LOGOINNER
  if dark:mark=re.sub(r'fill="[^"]+"','fill="#FFFFFF"',mark)
  s+=f'<svg x="64" y="55" width="238" height="55" viewBox="110 110 560 128">{mark}</svg>'
  s+=text('CONTEÚDOS BOMFIM',690,91,22,'#CAD3DF' if dark else MUTED,True)
  s+=rect(64,155,56,5,RED)+text(series,64,206,23,'#FF8299' if dark else RED,True)
  size=82 if j==0 else (76 if j==4 else 68)
  if max(len(l) for l in title.split('\n'))>31:size-=5
  t,endy=block(title,64,310,950,size,color,True,1.16);s+=t
  t,bodyend=block(body,64,endy+35,935,32,'#E0E6EF' if dark else MUTED,False,1.4);s+=t
  if bodyend>724:raise ValueError(f'Content overlaps diagram {slug} {j+1}: {bodyend}')
  # Light diagram area is an intentional contrast panel, never a photograph claiming real operations.
  s+=diagram(kind,j)
  if j==4:
   s+=rect(64,1120,164,5,RED)
  if kind=='market' and j==0: note='Fonte: IBGE · PMC · agosto/julho 2026 · ajuste sazonal'
  noteText,noteend=block(note,64,1170,925,25,'#D5DEEA' if dark else MUTED,False,1.28);s+=noteText
  if noteend>1234:raise ValueError(f'Note overflow {slug} {j+1}')
  s+=f'<path d="M64 1250H1016" stroke="{("#FFFFFF33" if dark else LINE)}" stroke-width="2"/>'
  s+=text('SALVE E COMPARTILHE' if j==4 else 'ARRASTE PARA CONTINUAR',64,1296,23,'#D5DEEA' if dark else MUTED,True)
  s+=text(f'{j+1:02d} / 05',902,1296,26,color,True)+'</svg>'
  file=f'{j+1:02d}';(directory/(file+'.svg')).write_text(s)
  art['slides'].append({'src':f'carrosseis/{slug}/{file}.png','editable':f'carrosseis/{slug}/{file}.svg','alt':title.replace('\n',' ')+'. '+body,'title':title.replace('\n',' ')})
 item['instagram']['artwork']=art
 item['instagram']['slides']=[title.replace('\n',' ')+'\n'+body+'\n'+note for title,body,note in slides]
 item['instagram']['altText']='Carrossel de cinco telas: '+' '.join(slide['alt'] for slide in art['slides'])
 manifest.append({'slug':slug,'title':item['title'],'slides':art['slides'],'zip':art['zip']})
DATA['artworkSummary']={'carousels':10,'slides':50,'width':1080,'height':1350,'allZip':'carrosseis/bomfim-10-carrosseis.zip','status':'Prévias para revisão; identidade visual baseada no site de testes.'}
(ROOT/'public/revisao-editorial/conteudos.json').write_text(json.dumps(DATA,ensure_ascii=False,indent=2)+'\n')
(ROOT/'docs/desdobramentos-editoriais-21-conteudos.json').write_text(json.dumps(DATA,ensure_ascii=False,indent=2)+'\n')
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('50 SVGs generated; manifest and 10 Instagram entries updated.')
