import api from './api'

export interface UsuarioLogado {
  id: number
  nome: string
  email: string
  perfil: 'TUTOR' | 'VETERINARIO' | 'CLINICA'
}

export async function login(email: string, senha: string): Promise<UsuarioLogado> {
  const { data } = await api.post('/auth/login', { email, senha })
  localStorage.setItem('token', data.token)
  localStorage.setItem('usuario', JSON.stringify({
    id: data.id, nome: data.nome, email: data.email, perfil: data.perfil
  }))
  return data
}

export async function cadastrar(payload: {
  nome: string
  email: string
  senha: string
  perfil: string
  cpfCnpj?: string
  telefone?: string
  crmv?: string
}): Promise<UsuarioLogado> {
  const { data } = await api.post('/auth/cadastro', payload)
  localStorage.setItem('token', data.token)
  localStorage.setItem('usuario', JSON.stringify({
    id: data.id, nome: data.nome, email: data.email, perfil: data.perfil
  }))
  return data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function getUsuario(): UsuarioLogado | null {
  const raw = localStorage.getItem('usuario')
  return raw ? JSON.parse(raw) : null
}

export function isAutenticado(): boolean {
  return !!localStorage.getItem('token')
}
