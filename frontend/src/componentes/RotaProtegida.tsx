import { Navigate } from 'react-router-dom'
import { isAutenticado } from '../servicos/auth'
import type { ReactNode } from 'react'

export default function RotaProtegida({ children }: { children: ReactNode }) {
  if (!isAutenticado()) {
    return <Navigate to="/entrar" replace />
  }
  return <>{children}</>
}
