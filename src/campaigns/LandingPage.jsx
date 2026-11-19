import { Navigate } from 'react-router-dom'

export default function LandingPage({ variant = 'descoberta' }) {
  const pathByVariant = { descoberta: '/lp/cotacao', consideracao: '/lp/embarques-frequentes', decisao: '/lp/falar-comercial', retorno: '/lp/falar-comercial' }
  return <Navigate to={pathByVariant[variant] || '/lp/cotacao'} replace />
}
