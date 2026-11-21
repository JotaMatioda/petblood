import { useParams, useNavigate } from 'react-router-dom'
import styles from './DetalhesBolsa.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { carregarBolsas, type Bolsa } from '../Inventario/Inventario.tsx'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import {
  ChevronLeft, Droplets, Calendar, User, FileText,
  Pencil, Trash2, Clock, FlaskConical
} from 'lucide-react'

const STATUS_INFO: Record<string, { label: string; classe: string }> = {
  DISPONIVEL: { label: 'Disponível', classe: 'disponivel' },
  RESERVADO:  { label: 'Reservado',  classe: 'reservado'  },
  QUARENTENA: { label: 'Quarentena', classe: 'quarentena' },
}

function formatarData(iso: string) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

function calcularValidade(dataVenc: string): { texto: string; critico: boolean } {
  if (!dataVenc) return { texto: '—', critico: false }
  const hoje = new Date()
  const venc = new Date(dataVenc + 'T00:00')
  const dias = Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  if (dias < 0) return { texto: `Vencida há ${Math.abs(dias)} dia${Math.abs(dias) !== 1 ? 's' : ''}`, critico: true }
  if (dias === 0) return { texto: 'Vence hoje', critico: true }
  if (dias <= 7) return { texto: `Vence em ${dias} dia${dias !== 1 ? 's' : ''}`, critico: true }
  return { texto: `${dias} dias restantes`, critico: false }
}

function Campo({ icone, label, valor, destaque }: {
  icone: React.ReactNode
  label: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div className={styles.campo}>
      <div className={styles.campoIcone}>{icone}</div>
      <div className={styles.campoConteudo}>
        <span className={styles.campoLabel}>{label}</span>
        <strong className={`${styles.campoValor} ${destaque ? styles.campoDestaque : ''}`}>{valor || '—'}</strong>
      </div>
    </div>
  )
}

export default function DetalhesBolsa() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const bolsa: Bolsa | undefined = carregarBolsas().find(
    b => b.id === decodeURIComponent(id ?? '')
  )

  function excluir() {
    if (!bolsa || !confirm(`Remover bolsa ${bolsa.id}?`)) return
    const lista = carregarBolsas().filter(b => b.id !== bolsa.id)
    localStorage.setItem('petblood_bolsas', JSON.stringify(lista))
    navigate('/clinica/inventario')
  }

  if (!bolsa) {
    return (
      <div className={styles.pagina}>
        <SidebarClinica />
        <div className={styles.conteudoWrapper}>
          <div className={styles.naoEncontrado}>
            <strong>Bolsa não encontrada.</strong>
            <button onClick={() => navigate('/clinica/inventario')}>Voltar ao inventário</button>
          </div>
        </div>
      </div>
    )
  }

  const st = STATUS_INFO[bolsa.status]
  const validade = calcularValidade(bolsa.dataVencimento)

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <header className={styles.header}>
          <button className={styles.btnVoltar} onClick={() => navigate('/clinica/inventario')}>
            <ChevronLeft size={18} /> Inventário
          </button>
          <PerfilHeaderBtn />
        </header>

        <main className={styles.main}>
          {/* Título */}
          <div className={styles.tituloBarra}>
            <div>
              <div className={styles.tituloLinha}>
                <h1 className={styles.titulo}>{bolsa.id}</h1>
                <span className={`${styles.statusBadge} ${styles[st.classe]}`}>{st.label}</span>
                {validade.critico && (
                  <span className={styles.alertaVenc}>⚠ {validade.texto}</span>
                )}
              </div>
              <p className={styles.subtitulo}>
                {bolsa.especie === 'CANINO' ? '🐕 Canino' : '🐈 Felino'} · {bolsa.tipoSanguineo}
              </p>
            </div>
            <div className={styles.tituloAcoes}>
              <button
                className={styles.btnEditar}
                onClick={() => navigate(`/clinica/bolsas/${encodeURIComponent(bolsa.id)}/editar`)}
              >
                <Pencil size={15} /> Editar
              </button>
              <button className={styles.btnExcluir} onClick={excluir}>
                <Trash2 size={15} /> Excluir
              </button>
            </div>
          </div>

          <div className={styles.grid}>

            {/* Card principal */}
            <div className={styles.coluna}>
              <div className={styles.card}>
                <h2 className={styles.cardTitulo}>
                  <Droplets size={16} color="#C0392B" /> Informações da Bolsa
                </h2>

                <div className={styles.camposGrid}>
                  <Campo
                    icone={<FlaskConical size={16} />}
                    label="Tipo Sanguíneo"
                    valor={bolsa.tipoSanguineo}
                    destaque
                  />
                  <Campo
                    icone={<Droplets size={16} />}
                    label="Volume"
                    valor={`${bolsa.volume} ml`}
                  />
                  <Campo
                    icone={<span style={{ fontSize: '1rem' }}>{bolsa.especie === 'CANINO' ? '🐕' : '🐈'}</span>}
                    label="Espécie"
                    valor={bolsa.especie === 'CANINO' ? 'Canino' : 'Felino'}
                  />
                  <Campo
                    icone={<Calendar size={16} />}
                    label="Data de Coleta"
                    valor={formatarData(bolsa.dataColeta)}
                  />
                  <Campo
                    icone={<Clock size={16} />}
                    label="Data de Vencimento"
                    valor={formatarData(bolsa.dataVencimento)}
                    destaque={validade.critico}
                  />
                  <Campo
                    icone={<span style={{ fontSize: '0.9rem' }}>📦</span>}
                    label="Status"
                    valor={st.label}
                  />
                </div>
              </div>

              {(bolsa.doador || bolsa.raca || bolsa.veterinario) && (
                <div className={styles.card}>
                  <h2 className={styles.cardTitulo}>
                    <User size={16} color="#C0392B" /> Dados do Doador
                  </h2>

                  <div className={styles.camposGrid}>
                    {bolsa.doador && (
                      <Campo icone={<User size={16} />} label="Nome do Animal" valor={bolsa.doador} />
                    )}
                    {bolsa.raca && (
                      <Campo icone={<span>🐾</span>} label="Raça" valor={bolsa.raca} />
                    )}
                    {bolsa.veterinario && (
                      <Campo icone={<User size={16} />} label="Médico Responsável" valor={bolsa.veterinario} />
                    )}
                  </div>
                </div>
              )}

              {bolsa.observacoes && (
                <div className={styles.card}>
                  <h2 className={styles.cardTitulo}>
                    <FileText size={16} color="#C0392B" /> Observações
                  </h2>
                  <p className={styles.observacoes}>{bolsa.observacoes}</p>
                </div>
              )}
            </div>

            {/* Lateral */}
            <div className={styles.lateral}>
              <div className={styles.card}>
                <h2 className={styles.cardTitulo}>Validade</h2>
                <div className={`${styles.validadeBox} ${validade.critico ? styles.validadeCritico : styles.validadeOk}`}>
                  <span className={styles.validadeTexto}>{validade.texto}</span>
                  <span className={styles.validadeData}>{formatarData(bolsa.dataVencimento)}</span>
                </div>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitulo}>Resumo</h2>
                <div className={styles.resumoLista}>
                  {[
                    ['ID',            bolsa.id],
                    ['Tipo',          bolsa.tipoSanguineo],
                    ['Volume',        `${bolsa.volume} ml`],
                    ['Espécie',       bolsa.especie === 'CANINO' ? 'Canino' : 'Felino'],
                    ['Status',        st.label],
                    ['Coleta',        formatarData(bolsa.dataColeta)],
                    ['Vencimento',    formatarData(bolsa.dataVencimento)],
                  ].map(([label, valor]) => (
                    <div key={label} className={styles.resumoItem}>
                      <span>{label}</span>
                      <strong>{valor}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
