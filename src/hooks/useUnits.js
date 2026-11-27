import { useEffect, useState } from 'react'
import { fetchUnits } from '../utils/unitsApi.js'

export default function useUnits() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    fetchUnits()
      .then(list => {
        if (active) {
          setUnits(list)
        }
      })
      .catch(err => {
        if (!active) {
          return
        }
        setUnits([])
        setError(err.message || 'Não foi possível carregar as unidades.')
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return { units, loading, error }
}