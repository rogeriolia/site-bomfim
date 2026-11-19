import { useState } from 'react'
import '../styles/brand-tests.css'

const versions = [
  { id: 'log', label: 'Bomfim log', image: '/assets/brand-tests/bomfim-log.png', description: 'Assinatura horizontal com extensão logística.' },
  { id: 'cargas', label: 'Bomfim Cargas', image: '/assets/brand-tests/bomfim-cargas.png', description: 'Nome principal com identificação do serviço abaixo.' },
]
function Mark({ version, white = false, width = 200 }) { return <img className={white ? 'brand-test-mark is-white' : 'brand-test-mark'} src={version.image} alt={version.label} style={{ width }}/ > }

export default function BrandTests() {
  const [selected, setSelected] = useState('log')
  const [size, setSize] = useState(220)
  const version = versions.find(item => item.id === selected)
  return <main className="brand-lab"><header><img src="/assets/bomfim-logo-compact.svg" alt="Bomfim"/><span>Estudo de assinaturas · visualização para avaliação</span></header>
    <section className="brand-lab__intro"><h1>Duas assinaturas. A mesma origem.</h1><p>Compare as versões da marca nos fundos e no cabeçalho do site.</p></section>
    <section aria-labelledby="brand-comparison"><h2 id="brand-comparison">Compare as versões</h2><div className="brand-lab__comparison">{versions.map(item => <article key={item.id}><div className="brand-lab__canvas"><Mark version={item} width={360}/></div><h3>{item.label}</h3><p>{item.description}</p><a href={item.image} download>Baixar proposta PNG</a></article>)}</div></section>
    <section className="brand-lab__applications"><div className="brand-lab__controls"><div><h2>Teste nas aplicações</h2><p>A escolha abaixo atualiza todos os exemplos.</p></div><fieldset><legend>Versão da marca</legend>{versions.map(item => <label key={item.id}><input type="radio" name="brand-version" value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)}/>{item.label}</label>)}</fieldset></div>
      <div className="brand-lab__samples"><article><h3>Fundo branco</h3><div className="brand-lab__sample"><Mark version={version}/></div></article><article><h3>Fundo azul-marinho</h3><div className="brand-lab__sample is-navy"><Mark version={version} white/></div></article><article><h3>Fundo vermelho</h3><div className="brand-lab__sample is-red"><Mark version={version} white/></div></article></div>
      <div className="brand-lab__site"><h3>Cabeçalho do site</h3><div className="brand-lab__navbar"><Mark version={version} white width={148}/><span>Estrutura</span><span>Soluções</span><span>Cobertura</span><span className="brand-lab__mock-button">Fazer uma cotação</span></div><div className="brand-lab__website-body"><p>Transporte e distribuição no Nordeste.</p><span>Exemplo visual para comparação da assinatura no site.</span></div></div>
      <div className="brand-lab__size"><h3>Legibilidade em diferentes tamanhos</h3><label htmlFor="brand-width">Largura: {size} px</label><input id="brand-width" type="range" min="80" max="360" step="10" value={size} onChange={event => setSize(Number(event.target.value))}/><div className="brand-lab__canvas"><Mark version={version} width={size}/></div></div>
    </section><footer>Propostas raster para avaliação. As versões brancas são simulações monocromáticas; a arte final e os arquivos de produção serão preparados após a escolha.</footer>
  </main>
}
