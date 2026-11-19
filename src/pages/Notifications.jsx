import { ArrowRight, CloudRain, MapPinned, Warehouse } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../components/UI.jsx'
import { notifications } from '../data/notifications.js'

const illustrations = {
  weather: { Icon: CloudRain, className: 'notifications-page__illustration--weather' },
  unit: { Icon: Warehouse, className: 'notifications-page__illustration--unit' },
  route: { Icon: MapPinned, className: 'notifications-page__illustration--route' },
}

function NotificationCard({ notice }) {
  const { Icon, className } = illustrations[notice.type]
  return <article className="notifications-page__card">
    <div className={`notifications-page__illustration ${className}`} aria-hidden="true"><Icon size={34} strokeWidth={1.7} /><span /></div>
    <div className="notifications-page__card-content">
      <div className="notifications-page__meta"><span>{notice.label}</span><span className="notifications-page__status">{notice.status}</span></div>
      <h2 className="heading">{notice.title}</h2>
      <p>{notice.body}</p>
      <p className="notifications-page__impact">{notice.impact}</p>
    </div>
  </article>
}

export default function NotificationsPage() {
  return <main className="notifications-page">
    <section className="notifications-page__intro">
      <div className="container-site">
        <p className="eyebrow">Central de avisos</p>
        <h1 className="heading">Informações que podem afetar sua entrega.</h1>
        <p>Consulte avisos sobre clima, unidades e rotas em um só lugar.</p>
      </div>
    </section>
    <section className="container-site notifications-page__list" aria-labelledby="notifications-heading">
      <div className="notifications-page__list-heading">
        <div><p className="eyebrow">Operação e entregas</p><h2 id="notifications-heading" className="heading">Avisos e modelos de comunicação</h2></div>
        <span>{notifications.length} avisos demonstrativos</span>
      </div>
      <div className="grid gap-4">{notifications.map(notice => <NotificationCard key={notice.id} notice={notice} />)}</div>
      <div className="notifications-page__note"><strong>Informação demonstrativa.</strong> Esta página ainda não recebe atualizações em tempo real. Ocorrências, unidades, rotas e períodos precisam ser confirmados pela operação antes da publicação.</div>
      <div className="notifications-page__actions"><Button href="/contato">Falar com a equipe <ArrowRight size={17} aria-hidden="true" /></Button><Link to="/unidades">Consultar unidades</Link></div>
    </section>
  </main>
}
