import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './DetalhesSolicitacao.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { buscarSolicitacao, type Solicitacao } from '../../../servicos/solicitacoes.ts'
import {
  ArrowLeft, ClipboardList, Building2, Clock, Hash,
  Droplets, PawPrint, Package, Scale, Stethoscope, AlertCircle, Loader2
} from 'lucide-react'

const tipoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  TIPO_A: 'Tipo A', TIPO_B: 'Tipo B', TIPO_AB: 'Tipo AB',
}

const especieLabel: Record<string, string> = { CAO: 'Cão', GATO: 'Gato' }

export default function DetalhesSolicitacao() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [sol, setSol] = useState<Solicitacao | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarSolicitacao(Number(id))
      .then(setSol)
      .catch(() => setSol(null))
      .finally(() => setCarregando(false))
  }, [id])

  if (carregando) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarClinica />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} color="#C0392B" style={{ animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    )
  }

  if (!sol) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarClinica />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <p style={{ color: 'var(--texto-medio)' }}>Solicitação não encontrada.</p>
          <button onClick={() => navigate('/clinica/solicitacoes')} style={{ color: 'var(--vermelho)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>← Voltar</button>
        </div>
      </div>
    )
  }

  const statusClasse = sol.status === 'PENDENTE' ? styles.pendente : sol.status === 'CONCLUIDA' ? styles.concluida : styles.cancelada
  const statusLabel  = sol.status === 'PENDENTE' ? 'Pendente' : sol.status === 'CONCLUIDA' ? 'Concluída' : 'Cancelada'
  const data = new Date(sol.criadoEm)

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <main className={styles.main}>
          <nav className={styles.breadcrumb}>
            <span onClick={() => navigate('/clinica/solicitacoes')} className={styles.breadLink}>Solicitações</span>
            <span className={styles.breadSep}>›</span>
            <span className={styles.breadAtual}>Detalhes #{sol.id}</span>
          </nav>

          <div className={styles.tituloBloco}>
            <button className={styles.btnVoltar} onClick={() => navigate('/clinica/solicitacoes')}>
              <ArrowLeft size={16} /> Voltar
            </button>
            <div>
              <h1 className={styles.titulo}>Detalhes da Solicitação</h1>
              <p className={styles.subtitulo}>Informações completas sobre a solicitação #{sol.id}</p>
            </div>
            <span className={`${styles.statusBadge} ${statusClasse}`}>
              <span className={styles.statusPonto} />{statusLabel}
            </span>
          </div>

          <div className={styles.layout}>
            <div className={styles.colunaEsquerda}>
              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <div className={styles.cardIcone}><ClipboardList size={18} color="var(--vermelho)" /></div>
                  <h2>Informações da Solicitação</h2>
                </div>

                <div className={styles.grade2}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><Hash size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>ID da Solicitação</span><strong className={styles.infoValor}>#{sol.id}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><PawPrint size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Nome do Paciente</span><strong className={styles.infoValor}>{sol.nomePaciente}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><PawPrint size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Espécie</span><strong className={styles.infoValor}>{especieLabel[sol.especie] ?? sol.especie}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><PawPrint size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Raça</span><strong className={styles.infoValor}>{sol.raca || '—'}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><Scale size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Peso</span><strong className={styles.infoValor}>{sol.peso || '—'}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><Droplets size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Tipo Sanguíneo</span><strong className={styles.infoValor}>{tipoLabel[sol.tipoSanguineo] ?? sol.tipoSanguineo}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><Package size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Volume Necessário</span><strong className={styles.infoValor}>{sol.volume}ml</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><Stethoscope size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Motivo / Causa</span><strong className={styles.infoValor}>{sol.motivo || '—'}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><AlertCircle size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Nível de Urgência</span><strong className={styles.infoValor}>{sol.urgencia === 'CRITICO' ? 'Crítico (Imediato)' : 'Normal (Programado)'}</strong></div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcone}><Clock size={15} color="var(--texto-medio)" /></div>
                    <div><span className={styles.infoLabel}>Data e Hora</span><strong className={styles.infoValor}>{data.toLocaleDateString('pt-BR')} às {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.colunaDireita}>
              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <div className={styles.cardIcone}><Building2 size={18} color="var(--vermelho)" /></div>
                  <h2>Unidade Solicitante</h2>
                </div>

                <div className={styles.infoItem}>
                  <div><span className={styles.infoLabel}>Hospital / Clínica</span><strong className={styles.infoValor}>{sol.clinicaNome}</strong></div>
                </div>

                {sol.medicoResponsavel && (
                  <div className={styles.infoItem}>
                    <div><span className={styles.infoLabel}>Médico Responsável</span><strong className={styles.infoValor}>{sol.medicoResponsavel}</strong></div>
                  </div>
                )}

                <div className={styles.infoItem}>
                  <div>
                    <span className={styles.infoLabel}>Status atual</span>
                    <span className={`${styles.statusBadge} ${statusClasse}`} style={{ display: 'inline-flex', marginTop: 4 }}>
                      <span className={styles.statusPonto} />{statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.acoesCard}>
                <h3 className={styles.acoesTitle}>Ações</h3>
                <button className={styles.btnVoltar2} onClick={() => navigate('/clinica/solicitacoes')}>
                  <ArrowLeft size={15} /> Voltar ao Histórico
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
