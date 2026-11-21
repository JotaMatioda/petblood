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

function chaveAlertas() {
  try {
    const u = JSON.parse(localStorage.getItem('usuario') ?? '{}')
    return `petblood_alertas_${u.id ?? 'guest'}`
  } catch { return 'petblood_alertas_guest' }
}

export function carregarAlertas(): Alerta[] {
  try { return JSON.parse(localStorage.getItem(chaveAlertas()) ?? '[]') } catch { return [] }
}

export function salvarAlerta(a: Alerta) {
  const lista = carregarAlertas()
  localStorage.setItem(chaveAlertas(), JSON.stringify([a, ...lista]))
}
