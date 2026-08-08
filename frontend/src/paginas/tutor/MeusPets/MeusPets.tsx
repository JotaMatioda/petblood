import styles from './MeusPets.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  PawPrint, Plus,
  Pencil, CalendarClock, ChevronRight,
  Droplets, Heart, Calendar, Eye,
  History as HistoryIcon, Loader2, Trash2
} from 'lucide-react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { listarPets, deletarPet, type Pet } from '../../../servicos/pets.ts'

const coresPorEspecie: Record<string, string> = {
  CAO: '#D4A574',
  GATO: '#7C9CBF',
}

const tipoSanguineoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+',
  DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3',
  DEA_4: 'DEA 4',
  DEA_5: 'DEA 5',
  DEA_7: 'DEA 7',
  DAL: 'Dal',
  DESCONHECIDO: 'Desc.',
  TIPO_A: 'Tipo A',
  TIPO_B: 'Tipo B',
  TIPO_AB: 'Tipo AB',
}

const statusConfig: Record<string, { label: string; classe: string }> = {
  DISPONIVEL:  { label: 'Disponível',  classe: 'statusDisponivel'  },
  EM_DESCANSO: { label: 'Em Descanso', classe: 'statusDescanso'    },
  BLOQUEADO:   { label: 'Bloqueado',   classe: 'statusDescanso'    },
  PRIORITARIO: { label: 'Prioritário', classe: 'statusPrioritario' },
}

export default function MeusPets() {
  const navigate = useNavigate()
  const [pets, setPets] = useState<Pet[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarPets()
      .then(setPets)
      .catch(() => setPets([]))
      .finally(() => setCarregando(false))
  }, [])

  async function excluir(pet: Pet) {
    if (!confirm(`Deseja excluir ${pet.nome}? Esta ação não pode ser desfeita.`)) return
    await deletarPet(pet.id)
    setPets(prev => prev.filter(p => p.id !== pet.id))
  }

  const totalDisponivel = pets.filter(p => p.status === 'DISPONIVEL').length

  return (
    <div className={styles.pagina}>

      <Sidebar />

      <main className={styles.main}>

        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Meus Pets</h1>
            <p className={styles.subtitulo}>Gerencie seus heróis doadores e acompanhe suas vidas.</p>
          </div>
          <Link to="/cadastrar-pet" className={styles.btnNovo}>
            <Plus size={18} /> Cadastrar Novo Pet
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.vermelho}`}><PawPrint size={20} color="#C0392B" /></div>
            <div>
              <span className={styles.statLabel}>TOTAL DE PETS</span>
              <strong className={styles.statValor}>{String(pets.length).padStart(2, '0')}</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.verde}`}><Heart size={20} color="#16A34A" /></div>
            <div>
              <span className={styles.statLabel}>DOAÇÕES TOTAIS</span>
              <strong className={styles.statValor}>00</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.laranja}`}><Droplets size={20} color="#EA580C" /></div>
            <div>
              <span className={styles.statLabel}>DISPONÍVEIS</span>
              <strong className={styles.statValor}>{String(totalDisponivel).padStart(2, '0')}</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.azul}`}><Calendar size={20} color="#2563EB" /></div>
            <div>
              <span className={styles.statLabel}>AGENDADOS</span>
              <strong className={styles.statValor}>00</strong>
            </div>
          </div>
        </div>

        {/* Grid de pets */}
        {carregando ? (
          <div className={styles.carregando}>
            <Loader2 size={32} color="#C0392B" className={styles.spinner} />
            <p>Carregando seus pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className={styles.vazio}>
            <div className={styles.vazioIcone}><PawPrint size={40} color="#C0392B" /></div>
            <strong className={styles.vazioTitulo}>Nenhum pet cadastrado ainda</strong>
            <p className={styles.vazioTexto}>Cadastre seu primeiro pet para que ele possa ser um doador e salvar vidas.</p>
            <Link to="/cadastrar-pet" className={styles.btnNovo} style={{ display: 'inline-flex', marginTop: 8 }}>
              <Plus size={16} /> Cadastrar meu primeiro pet
            </Link>
          </div>
        ) : (
          <div className={styles.petsGrid}>
            {pets.map(pet => {
              const cfg = statusConfig[pet.status] ?? { label: pet.status, classe: 'statusDescanso' }
              const cor = coresPorEspecie[pet.especie] ?? '#888'
              return (
                <div key={pet.id} className={styles.petCard}>
                  {/* Status badge */}
                  <div className={styles.petTopo}>
                    <span className={`${styles.statusBadge} ${styles[cfg.classe]}`}>
                      <span className={styles.statusPonto} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Foto + tipo sanguíneo */}
                  <div className={styles.petFotoWrapper}>
                    {(() => {
                      const foto = localStorage.getItem(`petblood_pet_foto_${pet.id}`)
                      return foto
                        ? <img src={foto} alt={pet.nome} className={styles.petFotoImg} />
                        : <div className={styles.petFoto} style={{ background: cor }}><PawPrint size={36} color="rgba(255,255,255,0.5)" /></div>
                    })()}
                    <span className={styles.tipoBadge}>
                      {pet.tipoSanguineo ? (tipoSanguineoLabel[pet.tipoSanguineo] ?? pet.tipoSanguineo) : '—'}
                    </span>
                  </div>

                  {/* Info */}
                  <h3 className={styles.petNome}>{pet.nome}</h3>
                  <p className={styles.petRaca}>
                    {pet.especie === 'CAO' ? 'Cão' : 'Gato'}
                    {pet.raca ? ` • ${pet.raca}` : ''}
                  </p>

                  {/* Detalhes */}
                  <div className={styles.petDetalhes}>
                    <div className={styles.petDetalheItem}>
                      <span className={styles.petDetalheLabel}>IDADE</span>
                      <span className={styles.petDetalheValor}>{pet.idade != null ? `${pet.idade} anos` : '—'}</span>
                    </div>
                    <div className={styles.petDetalheItem}>
                      <span className={styles.petDetalheLabel}>PESO</span>
                      <span className={styles.petDetalheValor}>{pet.peso != null ? `${pet.peso} kg` : '—'}</span>
                    </div>
                  </div>

                  {/* Botão principal */}
                  {pet.status === 'PRIORITARIO' ? (
                    <button className={styles.btnAgendar} onClick={() => navigate(`/pets/${pet.id}/agendar`)}>
                      <CalendarClock size={16} /> Agendar Doação
                    </button>
                  ) : (
                    <button className={styles.btnVerPerfil} onClick={() => navigate(`/pets/${pet.id}`)}>
                      <Eye size={16} /> Ver Perfil
                    </button>
                  )}

                  {/* Botões secundários */}
                  <div className={styles.petAcoes}>
                    <button className={styles.btnSecundario} onClick={() => navigate(`/pets/${pet.id}/editar`)}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button className={styles.btnSecundario} onClick={() => navigate(`/pets/${pet.id}/historico`)}>
                      <HistoryIcon size={12} /> Histórico
                    </button>
                    <button className={`${styles.btnSecundario} ${styles.btnExcluir}`} onClick={() => excluir(pet)}>
                      <Trash2 size={12} /> Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Próximos Compromissos */}
        <div className={styles.cardCompromissos}>
          <div className={styles.compromissosCabecalho}>
            <div className={styles.compromissosTitle}>
              <CalendarClock size={20} color="#C0392B" />
              <h2>Próximos Compromissos</h2>
            </div>
            <a href="#" className={styles.verCalendario}>Ver Calendário <ChevronRight size={14} /></a>
          </div>

          <div className={styles.compromissoVazio}>
            <p>Nenhum compromisso agendado.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
