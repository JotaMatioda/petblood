import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './HistoricoPet.module.css'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { listarPets, type Pet } from '../../../servicos/pets.ts'
import { ChevronLeft, Droplets, History as HistoryIcon, Calendar, FileX } from 'lucide-react'

export default function HistoricoPet() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pet, setPet] = useState<Pet | null>(null)

  useEffect(() => {
    listarPets().then(lista => setPet(lista.find(p => p.id === Number(id)) ?? null))
  }, [id])

  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.main}>

        <div className={styles.cabecalho}>
          <button className={styles.btnVoltar} onClick={() => navigate(`/pets/${id}`)}>
            <ChevronLeft size={18} /> {pet?.nome ?? 'Pet'}
          </button>
        </div>

        <div className={styles.tituloArea}>
          <div className={styles.tituloIcone}><HistoryIcon size={20} color="#C0392B" /></div>
          <div>
            <h1 className={styles.titulo}>Histórico de Doações</h1>
            <p className={styles.subtitulo}>{pet ? `Todas as doações de ${pet.nome}` : 'Carregando...'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total de doações', valor: '0', cor: 'vermelho' },
            { label: 'Vidas salvas',     valor: '0', cor: 'verde'    },
            { label: 'Última doação',    valor: '—', cor: 'azul'     },
            { label: 'Próxima apta',     valor: '—', cor: 'laranja'  },
          ].map(s => (
            <div key={s.label} className={`${styles.statCard} ${styles[s.cor]}`}>
              <strong>{s.valor}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div className={styles.card}>
          <div className={styles.cardCabecalho}>
            <h2 className={styles.cardTitulo}><Droplets size={16} color="#C0392B" /> Registros</h2>
          </div>

          <div className={styles.tabelaHeader}>
            <span>DATA</span>
            <span>CLÍNICA</span>
            <span>VOLUME</span>
            <span>TIPO SANGUÍNEO</span>
            <span>STATUS</span>
          </div>

          <div className={styles.vazioWrapper}>
            <div className={styles.vazioIcone}><FileX size={36} color="#C0392B" strokeWidth={1.5} /></div>
            <strong>Nenhuma doação registrada</strong>
            <p>Quando {pet?.nome ?? 'este pet'} realizar uma doação, ela aparecerá aqui.</p>
          </div>
        </div>

        {/* Timeline futura */}
        <div className={styles.card}>
          <h2 className={styles.cardTitulo}><Calendar size={16} color="#C0392B" /> Linha do Tempo</h2>
          <div className={styles.timelineVazio}>
            <p>Nenhum evento registrado ainda.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
