import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './PerfilPet.module.css'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { listarPets, deletarPet, type Pet } from '../../../servicos/pets.ts'
import {
  ChevronLeft, PawPrint, Droplets, Scale, Calendar,
  Syringe, Pencil, Trash2, History as HistoryIcon, Heart
} from 'lucide-react'

const tipoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  DAL: 'Dal', DESCONHECIDO: 'Desconhecido',
  TIPO_A: 'Tipo A', TIPO_B: 'Tipo B', TIPO_AB: 'Tipo AB',
}

const statusConfig: Record<string, { label: string; cor: string }> = {
  DISPONIVEL:  { label: 'Disponível',  cor: '#16A34A' },
  EM_DESCANSO: { label: 'Em Descanso', cor: '#D97706' },
  BLOQUEADO:   { label: 'Bloqueado',   cor: '#6B7280' },
  PRIORITARIO: { label: 'Prioritário', cor: '#C0392B' },
}

const coresPorEspecie: Record<string, string> = { CAO: '#D4A574', GATO: '#7C9CBF' }

export default function PerfilPet() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarPets()
      .then(lista => setPet(lista.find(p => p.id === Number(id)) ?? null))
      .finally(() => setCarregando(false))
  }, [id])

  async function excluir() {
    if (!pet || !confirm(`Excluir ${pet.nome}? Esta ação não pode ser desfeita.`)) return
    await deletarPet(pet.id)
    navigate('/meus-pets')
  }

  if (carregando) return (
    <div className={styles.pagina}><Sidebar />
      <main className={styles.main}><div className={styles.centralizador}><PawPrint size={32} color="#C0392B" /></div></main>
    </div>
  )

  if (!pet) return (
    <div className={styles.pagina}><Sidebar />
      <main className={styles.main}><div className={styles.centralizador}><p>Pet não encontrado.</p></div></main>
    </div>
  )

  const st = statusConfig[pet.status] ?? { label: pet.status, cor: '#888' }
  const cor = coresPorEspecie[pet.especie] ?? '#888'
  const foto = localStorage.getItem(`petblood_pet_foto_${pet.id}`)

  const vacinas = [
    pet.vacinaV10    && 'V10 / V8 (Polivalente)',
    pet.vacinaRabica && 'Antirrábica',
    pet.vacinaGripe  && 'Gripe',
  ].filter(Boolean) as string[]

  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.main}>

        <div className={styles.cabecalho}>
          <button className={styles.btnVoltar} onClick={() => navigate('/meus-pets')}>
            <ChevronLeft size={18} /> Meus Pets
          </button>
          <div className={styles.acoes}>
            <button className={styles.btnAcao} onClick={() => navigate(`/pets/${pet.id}/historico`)}>
              <HistoryIcon size={15} /> Histórico
            </button>
            <button className={styles.btnAcao} onClick={() => navigate(`/pets/${pet.id}/editar`)}>
              <Pencil size={15} /> Editar
            </button>
            <button className={`${styles.btnAcao} ${styles.btnPerigo}`} onClick={excluir}>
              <Trash2 size={15} /> Excluir
            </button>
          </div>
        </div>

        <div className={styles.grid}>

          {/* Card avatar */}
          <div className={styles.cardAvatar}>
            {foto
              ? <img src={foto} alt={pet.nome} className={styles.avatarFoto} />
              : <div className={styles.avatar} style={{ background: cor }}><PawPrint size={48} color="rgba(255,255,255,0.5)" /></div>
            }
            <h1 className={styles.petNome}>{pet.nome}</h1>
            <p className={styles.petEspecie}>{pet.especie === 'CAO' ? 'Cão' : 'Gato'}{pet.raca ? ` • ${pet.raca}` : ''}</p>
            <span className={styles.statusBadge} style={{ background: st.cor + '20', color: st.cor, border: `1px solid ${st.cor}40` }}>
              <span className={styles.statusPonto} style={{ background: st.cor }} />
              {st.label}
            </span>
            {pet.tipoSanguineo && (
              <div className={styles.tipoBadge}>
                <Droplets size={14} /> {tipoLabel[pet.tipoSanguineo] ?? pet.tipoSanguineo}
              </div>
            )}
          </div>

          <div className={styles.coluna}>

            {/* Informações */}
            <div className={styles.card}>
              <h2 className={styles.cardTitulo}><PawPrint size={16} color="#C0392B" /> Informações Gerais</h2>
              <div className={styles.camposGrid}>
                <div className={styles.campo}>
                  <div className={styles.campoIcone}><Scale size={15} /></div>
                  <div><span>Peso</span><strong>{pet.peso != null ? `${pet.peso} kg` : '—'}</strong></div>
                </div>
                <div className={styles.campo}>
                  <div className={styles.campoIcone}><Calendar size={15} /></div>
                  <div><span>Idade</span><strong>{pet.idade != null ? `${pet.idade} anos` : '—'}</strong></div>
                </div>
                <div className={styles.campo}>
                  <div className={styles.campoIcone}><Droplets size={15} /></div>
                  <div><span>Tipo Sanguíneo</span><strong>{pet.tipoSanguineo ? (tipoLabel[pet.tipoSanguineo] ?? pet.tipoSanguineo) : '—'}</strong></div>
                </div>
                <div className={styles.campo}>
                  <div className={styles.campoIcone}><Heart size={15} /></div>
                  <div><span>Status</span><strong>{st.label}</strong></div>
                </div>
              </div>
            </div>

            {/* Vacinação */}
            <div className={styles.card}>
              <h2 className={styles.cardTitulo}><Syringe size={16} color="#C0392B" /> Vacinação</h2>
              {vacinas.length === 0 ? (
                <p className={styles.semDados}>Nenhuma vacina registrada.</p>
              ) : (
                <div className={styles.vacinaLista}>
                  {vacinas.map(v => (
                    <div key={v} className={styles.vacinaItem}>
                      <span className={styles.vacinaCheck}>✓</span> {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Estatísticas rápidas */}
            <div className={styles.card}>
              <h2 className={styles.cardTitulo}><Heart size={16} color="#C0392B" /> Histórico de Doações</h2>
              <div className={styles.doacaoStats}>
                <div className={styles.doacaoStat}>
                  <strong>0</strong><span>Doações realizadas</span>
                </div>
                <div className={styles.doacaoStat}>
                  <strong>—</strong><span>Última doação</span>
                </div>
                <div className={styles.doacaoStat}>
                  <strong>—</strong><span>Próxima disponível</span>
                </div>
              </div>
              <button className={styles.btnHistorico} onClick={() => navigate(`/pets/${pet.id}/historico`)}>
                <HistoryIcon size={14} /> Ver histórico completo
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
