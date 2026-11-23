export type Alerta = {
  id: string
  tipoSanguineo: string
  especie: 'CAO' | 'GATO'
  urgencia: 'NORMAL' | 'CRITICO'
  clinicaNome: string
  clinicaContato?: string
  clinicaLat: number | null
  clinicaLng: number | null
  raioKm: number
  nomePaciente: string
  criadoEm: string
}

const CHAVE_ALERTAS = 'petblood_alertas'

export function carregarAlertas(): Alerta[] {
  try { return JSON.parse(localStorage.getItem(CHAVE_ALERTAS) ?? '[]') } catch { return [] }
}

export function salvarAlerta(a: Alerta) {
  const lista = carregarAlertas()
  localStorage.setItem(CHAVE_ALERTAS, JSON.stringify([a, ...lista]))
}
