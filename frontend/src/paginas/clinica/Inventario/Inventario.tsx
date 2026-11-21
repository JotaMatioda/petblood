import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Inventario.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import {
  Plus, Filter, Download, MoreVertical,
  Search, PackageOpen, Droplets,
  Eye, Pencil, Trash2
} from 'lucide-react'

export type Bolsa = {
  id: string
  especie: 'CANINO' | 'FELINO'
  tipoSanguineo: string
  volume: string
  dataColeta: string
  dataVencimento: string
  status: 'DISPONIVEL' | 'RESERVADO' | 'QUARENTENA'
  doador?: string
  raca?: string
  veterinario?: string
  observacoes?: string
}

const STATUS_INFO: Record<string, { label: string; classe: string }> = {
  DISPONIVEL:  { label: 'Disponível',  classe: 'disponivel'  },
  RESERVADO:   { label: 'Reservado',   classe: 'reservado'   },
  QUARENTENA:  { label: 'Quarentena', classe: 'quarentena'  },
}

function formatarData(iso: string) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00').toLocaleDateString('pt-BR')
}

function gerarId(lista: Bolsa[]) {
  const num = String(lista.length + 1).padStart(3, '0')
  return `#PB-${new Date().getFullYear()}-${num}`
}

export function carregarBolsas(): Bolsa[] {
  try { return JSON.parse(localStorage.getItem('petblood_bolsas') ?? '[]') } catch { return [] }
}

export function salvarBolsas(lista: Bolsa[]) {
  localStorage.setItem('petblood_bolsas', JSON.stringify(lista))
}

export function adicionarBolsa(bolsa: Omit<Bolsa, 'id'>) {
  const lista = carregarBolsas()
  const nova: Bolsa = { ...bolsa, id: gerarId(lista) }
  salvarBolsas([nova, ...lista])
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

export default function Inventario() {
  const navigate = useNavigate()
  const [bolsas, setBolsas] = useState<Bolsa[]>([])

  useEffect(() => {
    setBolsas(carregarBolsas())
  }, [])

  function excluir(id: string) {
    if (!confirm(`Remover bolsa ${id}?`)) return
    const nova = bolsas.filter(b => b.id !== id)
    salvarBolsas(nova)
    setBolsas(nova)
  }

  // Resumo por tipo
  const porTipo: Record<string, number> = {}
  bolsas.forEach(b => {
    porTipo[b.tipoSanguineo] = (porTipo[b.tipoSanguineo] ?? 0) + 1
  })
  const tiposResumo = Object.entries(porTipo)

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <header className={styles.header}>
          <div className={styles.buscaWrapper}>
            <Search size={16} className={styles.buscaIcone} />
            <input className={styles.busca} placeholder="Buscar bolsas, doadores..." />
          </div>
          <PerfilHeaderBtn />
        </header>

        <main className={styles.main}>
          <div className={styles.tituloBarra}>
            <div>
              <h1 className={styles.titulo}>Inventário de Sangue</h1>
              <p className={styles.subtitulo}>Visão geral em tempo real do estoque de bolsas.</p>
            </div>
            <button className={styles.btnNova} onClick={() => navigate('/clinica/nova-bolsa')}>
              <Plus size={16} /> Nova Entrada de Bolsa
            </button>
          </div>

          {bolsas.length === 0 ? (
            <div className={styles.vazioWrapper}>
              <div className={styles.vazioIcone}><PackageOpen size={48} color="#C0392B" strokeWidth={1.5} /></div>
              <strong className={styles.vazioTitulo}>Estoque vazio</strong>
              <p className={styles.vazioTexto}>Nenhuma bolsa de sangue cadastrada ainda.<br />Adicione a primeira entrada para começar a gerenciar o estoque.</p>
              <button className={styles.vazioBtn} onClick={() => navigate('/clinica/nova-bolsa')}>
                <Plus size={15} /> Nova Entrada de Bolsa
              </button>
            </div>
          ) : (
            <>
              {/* Cards resumo por tipo */}
              <div className={styles.tiposGrid}>
                {tiposResumo.map(([tipo, qtd]) => (
                  <div key={tipo} className={styles.tipoCard}>
                    <div className={styles.tipoTopo}>
                      <Droplets size={16} color="#C0392B" />
                      <span className={styles.tipoLabel}>{tipo}</span>
                    </div>
                    <span className={styles.tipoQtd}>{String(qtd).padStart(2, '0')}</span>
                    <span className={styles.tipoSub}>bolsa{qtd !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>

              {/* Tabela */}
              <div className={styles.tabelaCard}>
                <div className={styles.tabelaCabecalho}>
                  <h2 className={styles.tabelaTitulo}>Bolsas em Estoque <span className={styles.tabelaCount}>({bolsas.length})</span></h2>
                  <div className={styles.tabelaAcoes}>
                    <button className={styles.btnAcao}><Filter size={15} /> Filtrar</button>
                    <button className={styles.btnAcao}><Download size={15} /> Exportar</button>
                  </div>
                </div>

                <div className={styles.tabela}>
                  <div className={styles.tabelaHeader}>
                    <span>ID</span>
                    <span>TIPO SANGUÍNEO</span>
                    <span>ESPÉCIE</span>
                    <span>DATA DE COLETA</span>
                    <span>VENCIMENTO</span>
                    <span>STATUS</span>
                    <span>AÇÕES</span>
                  </div>

                  {bolsas.map(b => {
                    const st = STATUS_INFO[b.status]
                    return (
                      <div key={b.id} className={styles.tabelaLinha}>
                        <span className={styles.bolsaId}>{b.id}</span>
                        <span className={styles.bolsaTipo}>{b.tipoSanguineo}</span>
                        <span>{b.especie === 'CANINO' ? 'Canino' : 'Felino'}{b.raca ? ` (${b.raca})` : ''}</span>
                        <span>{formatarData(b.dataColeta)}</span>
                        <span>{formatarData(b.dataVencimento)}</span>
                        <span>
                          <span className={`${styles.statusBadge} ${styles[st.classe]}`}>{st.label}</span>
                        </span>
                        <MenuAcoes
                          onDetalhes={() => navigate(`/clinica/bolsas/${encodeURIComponent(b.id)}`)}
                          onEditar={() => navigate(`/clinica/bolsas/${encodeURIComponent(b.id)}/editar`)}
                          onExcluir={() => excluir(b.id)}
                        />
                      </div>
                    )
                  })}
                </div>

                <div className={styles.paginacao}>
                  <span>Exibindo {bolsas.length} bolsa{bolsas.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
