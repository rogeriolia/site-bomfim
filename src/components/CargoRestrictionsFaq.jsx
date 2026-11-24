import { useState } from 'react'
import ServiceFaqChevron from './ServiceFaqChevron.jsx'
import { Dialog } from './UI.jsx'
import { cargoProfile } from '../data/cargoProfile.js'

export default function CargoRestrictionsFaq() {
  const [open, setOpen] = useState(false)
  return <>
    <details>
      <summary><ServiceFaqChevron />Quais mercadorias têm restrições de transporte?</summary>
      <div className="service-detail__restrictions-answer">
        <p>Algumas mercadorias não são transportadas. Outras exigem documentos ou condições específicas antes da contratação.</p>
        <ul>
          <li><strong>Itens restritos:</strong> a lista inclui animais, armas e munições, produtos perecíveis, inflamáveis e vidros, entre outros.</li>
          <li><strong>Bebidas:</strong> transporte apenas com DDR.</li>
          <li><strong>Peças automotivas:</strong> exigem carta de isenção. Lataria, faróis e para-brisas têm restrições.</li>
        </ul>
        <p>Informe o produto e a embalagem para confirmar o atendimento. <button type="button" className="service-detail__restrictions-link" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Consultar a lista completa de restrições</button>.</p>
      </div>
    </details>
    <Dialog open={open} onClose={() => setOpen(false)} titleId="cargo-restrictions-title">
      <h2 id="cargo-restrictions-title" className="heading pr-10 text-2xl">Restrições de transporte</h2>
      <p className="mt-4 text-sm leading-6 text-[var(--subtle)]">Confira os itens restritos e as condições específicas antes de contratar o serviço.</p>
      <div className="mt-5 space-y-3 text-sm leading-6"><p><strong>Bebidas:</strong> transporte apenas com DDR.</p><p><strong>Peças automotivas:</strong> exigem carta de isenção. Lataria, faróis e para-brisas têm restrições de transporte.</p></div>
      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6">{cargoProfile.restrictedItems.map(item => <li key={item}>{item}</li>)}</ul>
    </Dialog>
  </>
}
