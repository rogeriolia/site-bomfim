import fs from 'node:fs'
const source = JSON.parse(fs.readFileSync(new URL('../public/data/bomfim-routes.json', import.meta.url), 'utf8'))
const origins = [...new Map(source.routes.map(route => [route.originIbge, [route.originIbge, route.origin]])).values()]
const rows = source.routes.map(route => [origins.findIndex(origin => origin[0] === route.originIbge), route.destinationIbge, route.distanceKm, route.leadTimeBusinessDays])
fs.writeFileSync(new URL('../src/data/route-times.json', import.meta.url), JSON.stringify({ origins, rows }))
console.log(`${rows.length} registros preservados para consulta de distância e prazo.`)
