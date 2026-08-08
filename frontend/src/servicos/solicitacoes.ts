import api from './api'

export interface Solicitacao {
  id: number
  nomePaciente: string
  especie: 'CAO' | 'GATO'
  raca?: string
  peso?: string
  tipoSanguineo: string
  volume: string
  motivo?: string
  urgencia: 'NORMAL' | 'CRITICO'
  medicoResponsavel?: string
  status: 'PENDENTE' | 'CONCLUIDA' | 'CANCELADA'
  criadoEm: string
  clinicaNome: string
}

export interface SolicitacaoRequest {
  nomePaciente: string
  especie: 'CAO' | 'GATO'
  raca?: string
  peso?: string
  tipoSanguineo: string
  volume: string
  motivo?: string
  urgencia: 'NORMAL' | 'CRITICO'
  medicoResponsavel?: string
}

export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  const { data } = await api.get('/solicitacoes')
  return data
}

export async function criarSolicitacao(req: SolicitacaoRequest): Promise<Solicitacao> {
  const { data } = await api.post('/solicitacoes', req)
  return data
}

export async function buscarSolicitacao(id: number): Promise<Solicitacao> {
  const { data } = await api.get(`/solicitacoes/${id}`)
  return data
}

export async function atualizarSolicitacao(id: number, req: SolicitacaoRequest): Promise<Solicitacao> {
  const { data } = await api.put(`/solicitacoes/${id}`, req)
  return data
}

export async function deletarSolicitacao(id: number): Promise<void> {
  await api.delete(`/solicitacoes/${id}`)
}
