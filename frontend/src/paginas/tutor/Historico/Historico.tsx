import styles from './Historico.module.css'
import {
  Filter, Download, Heart, Star, Droplets,
  Syringe, CalendarCheck, MoreVertical,
  ChevronLeft, ChevronRight as ChevronR
} from 'lucide-react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'

const atividades = [
  { data: '15 Out, 2023', hora: '09:30 AM', pet: 'Bento', atividade: 'Doação de Sangue', icone: 'doacao', status: 'Concluído' },
  { data: '22 Out, 2023', hora: '02:15 PM', pet: 'Luna',  atividade: 'Vacinação Anual',  icone: 'vacina',  status: 'Agendado'  },
  { data: '05 Set, 2023', hora: '11:00 AM', pet: 'Bento', atividade: 'Check-up Geral',   icone: 'checkup', status: 'Concluído' },
  { data: '12 Ago, 2023', hora: '10:45 AM', pet: 'Luna',  atividade: 'Doação de Sangue', icone: 'doacao',  status: 'Concluído' },
]

const metas = [
  { label: 'Doações este ano', sub: 'Bento', valor: 3, total: 4, cor: '#C0392B' },
  { label: 'Vidas impactadas', sub: 'Luna',  valor: 12, total: 20, cor: '#2563EB' },
]

export default function Historico() {
  return (
    <div className={styles.pagina}>

      <Sidebar />

      {/* Conteúdo */}
      <main className={styles.main}>
        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Histórico & Atividades</h1>
            <p className={styles.subtitulo}>Gerencie a jornada de saúde e doações de seus heróis.</p>
          </div>
          <div className={styles.cabecalhoAcoes}>
            <button className={styles.btnFiltrar}><Filter size={16} /> Filtrar</button>
            <button className={styles.btnExportar}><Download size={16} /> Exportar PDF</button>
          </div>
        </div>

        {/* Bloco superior */}
        <div className={styles.blocoTopo}>
          {/* Card de estatísticas */}
          <div className={styles.cardStats}>
            <span className={styles.statsLabel}>ESTATÍSTICAS DE VIDA</span>
            <div className={styles.statsNumeros}>
              <div className={styles.statsNumerosEsquerda}>
                <div className={styles.statItem}>
                  <strong>24</strong>
                  <span>Vidas Salvas</span>
                </div>
                <div className={styles.statItem}>
                  <strong>08</strong>
                  <span>Doações Realizadas</span>
                </div>
                <div className={styles.statItem}>
                  <strong>02</strong>
                  <span>Pets Ativos</span>
                </div>
              </div>
              <div className={styles.statsCoracao}>
                <Heart size={64} color="#FADBD8" fill="#FADBD8" />
              </div>
            </div>
            <div className={styles.statsHeroi}>
              <Star size={16} color="#C0392B" fill="#C0392B" />
              <span>Classificação: <strong>Herói Nível Ouro</strong></span>
            </div>
          </div>

          {/* Card próxima doação */}
          <div className={styles.cardProximaDoacao}>
            <div className={styles.proximaDoacaoBadge}>
              <Droplets size={14} /> Próxima Doação
            </div>
            <div className={styles.proximaDoacaoIcone}>
              <Droplets size={28} color="#fff" />
            </div>
            <h3 className={styles.proximaDoacaoTitulo}>Bento está apto!</h3>
            <p className={styles.proximaDoacaoTexto}>
              Sua última doação foi há 90 dias. Ele já pode ajudar outro amigo hoje.
            </p>
            <button className={styles.btnAgendar}>Agendar para Bento</button>
          </div>
        </div>

        {/* Tabela de atividades */}
        <div className={styles.cardTabela}>
          <div className={styles.tabelaCabecalho}>
            <h2 className={styles.tabelaTitulo}>Atividades Recentes</h2>
            <span className={styles.tabelaInfo}>Mostrando 1-10 de 42 registros</span>
          </div>

          <div className={styles.tabelaHeader}>
            <span>DATA</span>
            <span>PET</span>
            <span>ATIVIDADE</span>
            <span>STATUS</span>
            <span>AÇÕES</span>
          </div>
          {atividades.map((a, i) => (
            <div key={i} className={styles.tabelaLinha}>
              <div>
                <span className={styles.data}>{a.data}</span>
                <span className={styles.hora}>{a.hora}</span>
              </div>
              <div className={styles.petCell}>
                <div className={styles.petAvatar}>{a.pet[0]}</div>
                {a.pet}
              </div>
              <div className={styles.atividadeCell}>
                {a.icone === 'doacao'  && <Droplets size={15} color="#C0392B" />}
                {a.icone === 'vacina'  && <Syringe size={15} color="#B45309" />}
                {a.icone === 'checkup' && <CalendarCheck size={15} color="#2563EB" />}
                {a.atividade}
              </div>
              <div>
                <span className={`${styles.status} ${a.status === 'Concluído' ? styles.statusConcluido : styles.statusAgendado}`}>
                  {a.status}
                </span>
              </div>
              <div>
                <button className={styles.btnAcoes}><MoreVertical size={17} /></button>
              </div>
            </div>
          ))}

          {/* Paginação */}
          <div className={styles.paginacao}>
            <button className={styles.btnPag}><ChevronLeft size={16} /> Anterior</button>
            <div className={styles.paginas}>
              <button className={`${styles.paginaBotao} ${styles.paginaAtiva}`}>1</button>
              <button className={styles.paginaBotao}>2</button>
              <button className={styles.paginaBotao}>3</button>
            </div>
            <button className={styles.btnPag}>Próximo <ChevronR size={16} /></button>
          </div>
        </div>

        {/* Bloco inferior */}
        <div className={styles.blocoInferior}>
          {/* Metas de saúde */}
          <div className={styles.cardMetas}>
            <h2 className={styles.metasTitulo}>Metas de Saúde</h2>
            <div className={styles.metasLista}>
              {metas.map((m, i) => (
                <div key={i} className={styles.metaItem}>
                  <div className={styles.metaHeader}>
                    <span className={styles.metaLabel}>{m.label}</span>
                    <span className={styles.metaValor}>{m.valor}/{m.total}</span>
                  </div>
                  <span className={styles.metaSub}>{m.sub}</span>
                  <div className={styles.barraFundo}>
                    <div
                      className={styles.barraPreenchimento}
                      style={{ width: `${(m.valor / m.total) * 100}%`, background: m.cor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight de saúde */}
          <div className={styles.cardInsight}>
            <span className={styles.insightLabel}>INSIGHT DE SAÚDE</span>
            <div className={styles.insightCorpo}>
              <p className={styles.insightTexto}>
                "Bento manteve níveis ideais de hemoglobina em todas as doações deste ano. Continue com a dieta recomendada!"
              </p>
              <div className={styles.insightIcone}>
                <Droplets size={52} color="#FADBD8" fill="#FADBD8" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
