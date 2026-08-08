export type PetDoador = {
  petId: number | string
  nome: string
  especie: 'CAO' | 'GATO'
  raca: string
  peso: string
  tipoSanguineo: string
  tutorNome: string
  contato: string
  lat: number
  lng: number
}

export function carregarDoadores(): PetDoador[] {
  try { return JSON.parse(localStorage.getItem('petblood_doadores') ?? '[]') } catch { return [] }
}

export function salvarDoador(d: PetDoador) {
  const lista = carregarDoadores().filter(x => String(x.petId) !== String(d.petId))
  localStorage.setItem('petblood_doadores', JSON.stringify([...lista, d]))
}

export function removerDoador(petId: number | string) {
  const lista = carregarDoadores().filter(x => String(x.petId) !== String(petId))
  localStorage.setItem('petblood_doadores', JSON.stringify(lista))
}

// Haversine — retorna distância em km entre dois pontos lat/lng
export function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function geocodificarEndereco(endereco: string): Promise<[number, number] | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    )
    const d = await r.json()
    if (!d.length) return null
    return [parseFloat(d[0].lat), parseFloat(d[0].lon)]
  } catch { return null }
}
