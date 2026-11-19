const knownCodes = {
  'Recife': 'REC', 'João Pessoa': 'JPA', 'Feira de Santana': 'FSA', 'Salvador': 'SSA',
  'Maceió': 'MCZ', 'Natal': 'NAT', 'Fortaleza': 'FOR', 'Aracaju': 'AJU',
  'São Luís': 'SLZ', 'Teresina': 'THE', 'Campina Grande': 'CPV', 'Mossoró': 'MVF',
}

export function cityCode(city = '') {
  if (knownCodes[city]) return knownCodes[city]
  const words = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().match(/[A-Z0-9]+/g) || []
  return (words.length > 1 ? words.map(word => word[0]).join('') : words[0] || 'NE').slice(0, 3).padEnd(3, 'X')
}

export default function CityCode({ city, uf, size = 'md' }) {
  return <span className={`city-code city-code--${size}`} aria-label={`${city}, ${uf}`}><strong>{cityCode(city)}</strong><small>{uf}</small></span>
}
