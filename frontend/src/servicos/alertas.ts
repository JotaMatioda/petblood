export type Alerta = {
  id: string
  tipoSanguineo: string
  especie: 'CAO' | 'GATO'
  urgencia: 'NORMAL' | 'CRITICO'
  clinicaNome: string
  clinicaLat: number | null
  clinicaLng: number | null
  raioKm: number
  nomePaciente: string
  criadoEm: string
}

const CHAVE = 'petblood_alertas'

export function carregarAlertas(): Alerta[] {
  try { return JSON.parse(localStorage.getItem(CHAVE) ?? '[]') } catch { return [] }
}

export function salvarAlerta(a: Alerta) {
  const lista = carregarAlertas()
  localStorage.setItem(CHAVE, JSON.stringify([a, ...lista]))
}
