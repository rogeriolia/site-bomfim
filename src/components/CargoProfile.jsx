import { cargoProfile } from '../data/cargoProfile.js'

export default function CargoProfile({ compact = false }) {
  return <section className={`cargo-profile ${compact ? 'cargo-profile--compact' : ''}`} aria-label="Restrições de transporte">
    <div className="cargo-profile__intro"><div><h2>Confira as restrições da sua carga.</h2><p>Algumas mercadorias não são transportadas. Outras exigem condições específicas.</p></div></div>
    <details>
      <summary>Ver itens e condições</summary>
      <div className="cargo-profile__conditions"><p><strong>Bebidas:</strong> transporte apenas com DDR.</p><p><strong>Peças automotivas:</strong> exigem carta de isenção. Lataria, faróis e para-brisas têm restrições de transporte.</p></div>
      <ul>{cargoProfile.restrictedItems.map(item => <li key={item}>{item}</li>)}</ul>
    </details>
  </section>
}
