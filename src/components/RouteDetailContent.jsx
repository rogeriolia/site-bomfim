import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Boxes, CalendarDays, MapPin } from 'lucide-react'
import { unitCatchments } from '../data/destinationSuggestions.js'
import CityCode from './CityCode.jsx'
import CargoProfile from './CargoProfile.jsx'

export default function RouteDetailContent({ route }) {
  const originUnit = unitCatchments.find(unit => unit.origin === route.origin)
  const destinationUnit = unitCatchments.find(unit => unit.origin === route.destination)
  return <div className="route-detail-content">
    <div className="route-detail-points">{[{city:route.origin,uf:route.originUf,unit:originUnit,label:'Origem'},{city:route.destination,uf:route.destinationUf,unit:destinationUnit,label:'Destino'}].map(point => <div key={point.label}><span className="route-detail-points__label">{point.label}</span><div><CityCode city={point.city} uf={point.uf} size="lg" /><strong>{point.city} · {point.uf}</strong></div><p>{point.unit ? `Unidade: ${point.unit.unit}${point.unit.hub !== point.city ? ` · ${point.unit.hub}` : ''}` : 'Confirme o atendimento no endereço.'}</p></div>)}</div>
    <div className="route-detail-facts">{[['Distância estimada',route.distance],['Prazo estimado',route.leadTime]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <p className="route-detail-reference">Prazos são estimativas. Confirme as condições para o seu embarque.</p>
    <section className="route-detail-use"><h3>O que você precisa movimentar neste trecho?</h3><p>Informe a finalidade para avaliar a operação entre {route.origin} e {route.destination}.</p><div>{[{Icon:Building2,title:'Distribuição entre cidades',body:'Da origem aos pontos de recebimento dos seus clientes.'},{Icon:Boxes,title:'Transferência de estoques',body:'Movimentação entre filiais, lojas ou centros de distribuição.'},{Icon:CalendarDays,title:'Abastecimento recorrente',body:'Reposição com frequência, volumes e janelas alinhados.'}].map(({Icon,title,body}) => <div key={title}><Icon size={21} aria-hidden="true" /><h4>{title}</h4><p>{body}</p></div>)}</div></section>
    <section className="route-detail-checks"><h3>O que confirmar para esta rota</h3><ul><li><MapPin size={17} aria-hidden="true" /><span><strong>Os dois endereços.</strong> Informe os CEPs e os locais efetivos de retirada e recebimento em {route.origin} e {route.destination}.</span></li><li><CalendarDays size={17} aria-hidden="true" /><span><strong>Rotina e janelas.</strong> Indique os dias de embarque, frequência desejada, necessidade de agendamento e horários do destinatário.</span></li><li><Boxes size={17} aria-hidden="true" /><span><strong>Mercadoria e volumes.</strong> Descreva produtos, embalagem, quantidade, peso e dimensões. O perfil da carga pode restringir o transporte.</span></li></ul><Link to="/unidades">Ver unidades e contatos <ArrowRight size={15} aria-hidden="true" /></Link></section>
    <CargoProfile compact />
  </div>
}
