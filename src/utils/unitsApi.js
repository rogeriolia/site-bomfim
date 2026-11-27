let cachedUnits = null

export function clearUnitsCache() {
  cachedUnits = null
}

export async function fetchUnits({ signal } = {}) {
  if (cachedUnits) {
    return cachedUnits
  }

  const response = await fetch('/api/unidades.php', {
    signal,
    headers: { Accept: 'application/json' },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Não foi possível carregar as unidades.')
  }
  if (!Array.isArray(data.units)) {
    throw new Error('Resposta inválida ao carregar unidades.')
  }
  cachedUnits = data.units
  return cachedUnits
}