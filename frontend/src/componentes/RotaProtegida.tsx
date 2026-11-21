import { Navigate } from 'react-router-dom'
import { isAutenticado, getUsuario } from '../servicos/auth'
import type { ReactNode } from 'react'

export default function RotaProtegida({ children }: { children: ReactNode }) {
  if (!isAutenticado()) {
    return <Navigate to="/entrar" replace />
  }
  return <>{children}</>
}

export function RotaClinica({ children }: { children: ReactNode }) {
  if (!isAutenticado()) return <Navigate to="/entrar" replace />
  const usuario = getUsuario()
  if (usuario?.perfil !== 'CLINICA' && usuario?.perfil !== 'VETERINARIO') {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

export function RotaTutor({ children }: { children: ReactNode }) {
  if (!isAutenticado()) return <Navigate to="/entrar" replace />
  const usuario = getUsuario()
  if (usuario?.perfil !== 'TUTOR') {
    return <Navigate to="/clinica/inventario" replace />
  }
  return <>{children}</>
}
