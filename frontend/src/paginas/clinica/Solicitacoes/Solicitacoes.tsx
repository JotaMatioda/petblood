import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Solicitacoes.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { listarSolicitacoes, deletarSolicitacao, type Solicitacao } from '../../../servicos/solicitacoes.ts'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import {
  Search, Filter, Download, Plus,
  ClipboardList, CheckCircle2, Clock, XCircle,
  ChevronLeft, ChevronRight, MoreVertical, FileX, Eye, Pencil, Trash2, Loader2
} from 'lucide-react'

const tipoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  TIPO_A: 'Tipo A', TIPO_B: 'Tipo B', TIPO_AB: 'Tipo AB',
}

const especieLabel: Record<string, string> = { CAO: 'Cão', GATO: 'Gato' }

function statusInfo(status: string) {
  if (status === 'PENDENTE')  return { classe: 'pendente',  label: 'Pendente'  }
  if (status === 'CONCLUIDA') return { classe: 'concluida', label: 'Concluída' }
  return { classe: 'cancelada', label: 'Cancelada' }
}

function MenuAcoes({ onDetalhes, onEditar, onExcluir }: {
  onDetalhes: () => void
  onEditar: () => void
  onExcluir: () => void
}) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function fechar(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', fechar)
    return () => document.removeEventListener('mousedown', fechar)
  }, [])

  function acao(fn: () => void) { setAberto(false); fn() }

  return (
    <div className={styles.menuWrapper} ref={ref}>
      <button className={styles.btnMenu} onClick={() => setAberto(v => !v)}>
        <MoreVertical size={16} />
      </button>
      {aberto && (
        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={() => acao(onDetalhes)}><Eye size={14} /> Detalhes</button>
          <button className={styles.dropdownItem} onClick={() => acao(onEditar)}><Pencil size={14} /> Editar</button>
          <div className={styles.dropdownDivisor} />
          <button className={`${styles.dropdownItem} ${styles.dropdownItemPerigo}`} onClick={() => acao(onExcluir)}><Trash2 size={14} /> Excluir</button>
        </div>
      )}
    </div>
  )
}

export default function Solicitacoes() {
  const navigate = useNavigate()
  const [lista, setLista] = useState<Solicitacao[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarSolicitacoes()
      .then(setLista)
      .catch(() => setLista([]))
      .finally(() => setCarregando(false))
  }, [])

  async function excluir(id: number) {
    if (!confirm(`Deseja excluir a solicitação #${id}?`)) return
    await deletarSolicitacao(id)
    setLista(prev => prev.filter(s => s.id !== id))
  }

  const total      = lista.length
  const pendentes  = lista.filter(s => s.status === 'PENDENTE').length
  const concluidas = lista.filter(s => s.status === 'CONCLUIDA').length
  const canceladas = lista.filter(s => s.status === 'CANCELADA').length

  const stats = [
    { icone: <ClipboardList size={20} color="#7C3AED" />, cor: 'roxo',    label: 'Total',      valor: String(total)      },
    { icone: <Clock         size={20} color="#D97706"  />, cor: 'laranja', label: 'Pendentes',  valor: String(pendentes)  },
    { icone: <CheckCircle2  size={20} color="#16A34A"  />, cor: 'verde',   label: 'Concluídas', valor: String(concluidas) },
    { icone: <XCircle       size={20} color="#C0392B"  />, cor: 'vermelho',label: 'Canceladas', valor: String(canceladas) },
  ]

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <header className={styles.header}>
          <div className={styles.buscaWrapper}>
            <Search size={16} className={styles.buscaIcone} />
            <input className={styles.busca} placeholder="Pesquisar solicitações..." />
          </div>
          <PerfilHeaderBtn />
        </header>

        <main className={styles.main}>
          <div className={styles.tituloBarra}>
            <div>
              <h1 className={styles.titulo}>Histórico de Solicitações</h1>
              <p className={styles.subtitulo}>Todas as solicitações de sangue realizadas pela sua clínica.</p>
            </div>
            <div className={styles.tituloAcoes}>
              <button className={styles.btnAcao}><Filter size={15} /> Filtrar</button>
              <button className={styles.btnAcao}><Download size={15} /> Exportar</button>
              <button className={styles.btnNova} onClick={() => navigate('/clinica/nova-solicitacao')}>
                <Plus size={16} /> Nova Solicitação
              </button>
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div className={`${styles.statIcone} ${styles[s.cor]}`}>{s.icone}</div>
                <div>
                  <span className={styles.statLabel}>{s.label}</span>
                  <strong className={styles.statValor}>{carregando ? '—' : s.valor}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.tabelaCard}>
            <div className={styles.tabelaCabecalho}>
              <h2 className={styles.tabelaTitulo}>Solicitações Realizadas</h2>
            </div>

            {carregando ? (
              <div className={styles.vazio}>
                <Loader2 size={32} color="#C0392B" className={styles.spinner} />
                <p className={styles.vazioTexto}>Carregando...</p>
              </div>
            ) : lista.length === 0 ? (
              <div className={styles.vazio}>
                <div className={styles.vazioIcone}><FileX size={32} color="#C0392B" /></div>
                <strong className={styles.vazioTitulo}>Nenhuma solicitação ainda</strong>
                <p className={styles.vazioTexto}>Quando você realizar uma solicitação de sangue, ela aparecerá aqui.</p>
                <button className={styles.vazioBtn} onClick={() => navigate('/clinica/nova-solicitacao')}>
                  <Plus size={15} /> Nova Solicitação
                </button>
              </div>
            ) : (
              <>
                <div className={styles.tabelaHeader}>
                  <span>ID</span>
                  <span>TIPO SANGUÍNEO</span>
                  <span>ESPÉCIE</span>
                  <span>QUANTIDADE</span>
                  <span>DATA</span>
                  <span>STATUS</span>
                  <span></span>
                </div>

                {lista.map(s => {
                  const st = statusInfo(s.status)
                  const data = new Date(s.criadoEm)
                  return (
                    <div key={s.id} className={styles.tabelaLinha}>
                      <span className={styles.itemId}>#{s.id}</span>
                      <span className={styles.itemTipo}>{tipoLabel[s.tipoSanguineo] ?? s.tipoSanguineo}</span>
                      <span className={styles.itemEspecie}>{especieLabel[s.especie] ?? s.especie}</span>
                      <span className={styles.itemQtd}>{s.volume}ml</span>
                      <div className={styles.itemData}>
                        <span>{data.toLocaleDateString('pt-BR')}</span>
                        <span className={styles.itemHora}>{data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[st.classe]}`}>
                        <span className={styles.statusPonto} />{st.label}
                      </span>
                      <MenuAcoes
                        onDetalhes={() => navigate(`/clinica/solicitacoes/${s.id}`)}
                        onEditar={() => navigate(`/clinica/solicitacoes/${s.id}/editar`)}
                        onExcluir={() => excluir(s.id)}
                      />
                    </div>
                  )
                })}

                <div className={styles.paginacao}>
                  <span>Mostrando 1-{lista.length} de {lista.length} solicitações</span>
                  <div className={styles.paginacaoBtns}>
                    <button className={styles.paginaBtn}><ChevronLeft size={14} /></button>
                    <button className={`${styles.paginaBtn} ${styles.paginaBtnAtivo}`}>1</button>
                    <button className={styles.paginaBtn}><ChevronRight size={14} /></button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
