export const northeastStates = [
  { uf: 'AL', state: 'Alagoas', capital: 'Maceió', featured: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares', 'Penedo', 'São Miguel dos Campos', 'Marechal Deodoro', 'Coruripe', 'Delmiro Gouveia'] },
  { uf: 'BA', state: 'Bahia', capital: 'Salvador', featured: ['Salvador', 'Feira de Santana', 'Camaçari', 'Vitória da Conquista', 'Juazeiro', 'Lauro de Freitas', 'Itabuna', 'Ilhéus', 'Jequié', 'Teixeira de Freitas'] },
  { uf: 'CE', state: 'Ceará', capital: 'Fortaleza', featured: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá'] },
  { uf: 'MA', state: 'Maranhão', capital: 'São Luís', featured: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas'] },
  { uf: 'PB', state: 'Paraíba', capital: 'João Pessoa', featured: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa', 'Cabedelo', 'Cajazeiras', 'Guarabira', 'Sapé'] },
  { uf: 'PE', state: 'Pernambuco', capital: 'Recife', featured: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão'] },
  { uf: 'PI', state: 'Piauí', capital: 'Teresina', featured: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Campo Maior', 'Barras', 'União', 'Altos', 'Esperantina'] },
  { uf: 'RN', state: 'Rio Grande do Norte', capital: 'Natal', featured: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Ceará-Mirim', 'Macaíba', 'Caicó', 'Assú', 'Currais Novos', 'São José de Mipibu'] },
  { uf: 'SE', state: 'Sergipe', capital: 'Aracaju', featured: ['Aracaju', 'Nossa Senhora do Socorro', 'Itabaiana', 'Lagarto', 'Estância', 'São Cristóvão', 'Tobias Barreto', 'Simão Dias', 'Nossa Senhora da Glória', 'Barra dos Coqueiros'] },
]

// Ten relevant municipalities around each Bomfim unit, for discovery only.
// Their presence here does not confirm a direct route or commercial coverage.
export const unitCatchments = [
  { origin: 'Recife', hub: 'Jaboatão dos Guararapes', unit: 'Recife (Matriz)', uf: 'PE', cities: ['Jaboatão dos Guararapes', 'Recife', 'Olinda', 'Paulista', 'Camaragibe', 'Cabo de Santo Agostinho', 'Igarassu', 'Abreu e Lima', 'Vitória de Santo Antão', 'Caruaru'] },
  { origin: 'João Pessoa', hub: 'João Pessoa', unit: 'João Pessoa', uf: 'PB', cities: ['João Pessoa', 'Cabedelo', 'Bayeux', 'Santa Rita', 'Conde', 'Lucena', 'Mamanguape', 'Guarabira', 'Itabaiana', 'Campina Grande'] },
  { origin: 'Feira de Santana', hub: 'Feira de Santana', unit: 'Feira de Santana', uf: 'BA', cities: ['Feira de Santana', 'Conceição do Jacuípe', 'São Gonçalo dos Campos', 'Santo Estêvão', 'Coração de Maria', 'Amélia Rodrigues', 'Salvador', 'Alagoinhas', 'Serrinha', 'Cruz das Almas'] },
  { origin: 'Salvador', hub: 'Simões Filho', unit: 'Salvador', uf: 'BA', cities: ['Simões Filho', 'Salvador', 'Lauro de Freitas', 'Camaçari', 'Candeias', 'Dias d’Ávila', 'São Francisco do Conde', 'Mata de São João', 'Feira de Santana', 'Santo Amaro'] },
  { origin: 'Maceió', hub: 'Maceió', unit: 'Maceió', uf: 'AL', cities: ['Maceió', 'Rio Largo', 'Marechal Deodoro', 'Pilar', 'Satuba', 'Atalaia', 'São Miguel dos Campos', 'União dos Palmares', 'Arapiraca', 'Palmeira dos Índios'] },
  { origin: 'Natal', hub: 'Parnamirim', unit: 'Natal', uf: 'RN', cities: ['Parnamirim', 'Natal', 'Macaíba', 'São Gonçalo do Amarante', 'Extremoz', 'Ceará-Mirim', 'São José de Mipibu', 'Nísia Floresta', 'Goianinha', 'Mossoró'] },
  { origin: 'Fortaleza', hub: 'Eusébio', unit: 'Fortaleza', uf: 'CE', cities: ['Eusébio', 'Fortaleza', 'Aquiraz', 'Itaitinga', 'Maracanaú', 'Pacatuba', 'Caucaia', 'Horizonte', 'Pacajus', 'Sobral'] },
  { origin: 'Aracaju', hub: 'Aracaju', unit: 'Aracaju', uf: 'SE', cities: ['Aracaju', 'Nossa Senhora do Socorro', 'São Cristóvão', 'Barra dos Coqueiros', 'Itabaiana', 'Estância', 'Lagarto', 'Propriá', 'Tobias Barreto', 'Nossa Senhora das Dores'] },
]

export const destinationGroups = northeastStates
export const branchCities = unitCatchments.map(({ origin, uf }) => ({ city: origin, uf }))

// Referências de planejamento para o destaque do wizard. Não substituem a confirmação comercial.
export const catchmentFacts = {
  'Recife|Olinda': { distance: '≈ 15 km', leadTime: 'D+1' },
  'Recife|Paulista': { distance: '≈ 20 km', leadTime: 'D+1' },
  'Recife|Camaragibe': { distance: '≈ 18 km', leadTime: 'D+1' },
  'Recife|Cabo de Santo Agostinho': { distance: '≈ 35 km', leadTime: 'D+1' },
  'Recife|Igarassu': { distance: '≈ 30 km', leadTime: 'D+1' },
  'Recife|Abreu e Lima': { distance: '≈ 25 km', leadTime: 'D+1' },
  'Recife|Vitória de Santo Antão': { distance: '≈ 50 km', leadTime: 'D+1' },
  'Recife|Caruaru': { distance: '≈ 130 km', leadTime: 'D+1' },
}
