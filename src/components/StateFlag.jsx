const flags = { AL: 'Bandeira de Alagoas.svg', BA: 'Bandeira da Bahia.svg', CE: 'Bandeira do Ceará.svg', MA: 'Bandeira do Maranhão.svg', PB: 'Bandeira da Paraíba.svg', PE: 'Bandeira de Pernambuco.svg', PI: 'Bandeira do Piauí.svg', RN: 'Bandeira do Rio Grande do Norte.svg', SE: 'Bandeira de Sergipe.svg' }

export default function StateFlag({ uf }) {
  return flags[uf] ? <img className="state-flag" src={`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(flags[uf])}`} alt={`Bandeira de ${uf}`} width="28" height="20" loading="lazy" onError={event => { event.currentTarget.hidden = true }} /> : null
}
