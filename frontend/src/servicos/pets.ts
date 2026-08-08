import api from './api'

export interface Pet {
  id: number
  nome: string
  especie: 'CAO' | 'GATO'
  raca?: string
  idade?: number
  peso?: number
  tipoSanguineo?: string
  status: 'DISPONIVEL' | 'EM_DESCANSO' | 'BLOQUEADO' | 'PRIORITARIO'
  vacinaV10?: boolean
  vacinaRabica?: boolean
  vacinaGripe?: boolean
  fotoUrl?: string
  criadoEm?: string
}

export interface PetRequest {
  nome: string
  especie: 'CAO' | 'GATO'
  raca?: string
  idade?: number
  peso?: number
  tipoSanguineo?: string
  vacinaV10?: boolean
  vacinaRabica?: boolean
  vacinaGripe?: boolean
}

export async function listarPets(): Promise<Pet[]> {
  const { data } = await api.get('/pets')
  return data
}

export async function cadastrarPet(pet: PetRequest): Promise<Pet> {
  const { data } = await api.post('/pets', pet)
  return data
}

export async function atualizarPet(id: number, pet: PetRequest): Promise<Pet> {
  const { data } = await api.put(`/pets/${id}`, pet)
  return data
}

export async function deletarPet(id: number): Promise<void> {
  await api.delete(`/pets/${id}`)
}
