import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'

export default function HomeReturnNotice() {
  const location = useLocation()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(Boolean(location.state?.thankYouReturn))
  useEffect(() => {
    if (!visible) return undefined
    const timer = window.setTimeout(() => { setVisible(false); navigate('/', { replace: true, state: null }) }, 6000)
    return () => window.clearTimeout(timer)
  }, [visible, navigate])
  if (!visible) return null
  return <div className="home-return-notice"><p role="status"><Check size={20} aria-hidden="true" />Obrigado pela visita. Continue conhecendo a Bomfim.</p><button type="button" aria-label="Fechar mensagem" onClick={() => { setVisible(false); navigate('/', { replace: true, state: null }) }}><X size={18} /></button></div>
}
