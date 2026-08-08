import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../NovaSolicitacao/NovaSolicitacao.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { getUsuario } from '../../../servicos/auth.ts'
import { buscarSolicitacao, atualizarSolicitacao, type Solicitacao } from '../../../servicos/solicitacoes.ts'
import { PawPrint, FileText, AlertCircle, MapPin, Save, X, Shield, Zap, Users, Loader2 } from 'lucide-react'

const tipoOptions = [
  { label: 'DEA 1.1 Positivo', valor: 'DEA_1_1_POS' },
  { label: 'DEA 1.1 Negativo', valor: 'DEA_1_1_NEG' },
  { label: 'DEA 3',            valor: 'DEA_3'        },
  { label: 'DEA 4',            valor: 'DEA_4'        },
  { label: 'DEA 5',            valor: 'DEA_5'        },
  { label: 'DEA 7',            valor: 'DEA_7'        },
  { label: 'Tipo A',           valor: 'TIPO_A'       },
  { label: 'Tipo B',           valor: 'TIPO_B'       },
  { label: 'Tipo AB',          valor: 'TIPO_AB'      },
]

export default function EditarSolicitacao() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const usuario = getUsuario()

  const [sol, setSol] = useState<Solicitacao | null>(null)
  const [carregando, setCarregando] = useState(true)

  const [urgencia, setUrgencia] = useState<'NORMAL' | 'CRITICO'>('NORMAL')
  const [nomePaciente, setNomePaciente] = useState('')
  const [especie, setEspecie] = useState<'CAO' | 'GATO'>('CAO')
  const [raca, setRaca] = useState('')
  const [peso, setPeso] = useState('')
  const [tipoSanguineo, setTipoSanguineo] = useState('DEA_1_1_POS')
  const [volume, setVolume] = useState('')
  const [motivo, setMotivo] = useState('Cirurgia')
  const [medico, setMedico] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    buscarSolicitacao(Number(id)).then(s => {
      setSol(s)
      setUrgencia(s.urgencia)
      setNomePaciente(s.nomePaciente)
      setEspecie(s.especie)
      setRaca(s.raca ?? '')
      setPeso(s.peso?.replace(' kg', '') ?? '')
      setTipoSanguineo(s.tipoSanguineo)
      setVolume(s.volume)
      setMotivo(s.motivo ?? 'Cirurgia')
      setMedico(s.medicoResponsavel ?? '')
    }).catch(() => setSol(null)).finally(() => setCarregando(false))
  }, [id])

  async function salvar() {
    if (!nomePaciente.trim()) { setErro('Informe o nome do paciente.'); return }
    if (!volume.trim()) { setErro('Informe o volume necessário.'); return }
    setErro('')
    setSalvando(true)
    try {
      await atualizarSolicitacao(Number(id), {
        nomePaciente, especie,
        raca: raca || undefined,
        peso: peso ? `${peso} kg` : undefined,
        tipoSanguineo, volume, motivo, urgencia,
        medicoResponsavel: medico || undefined,
      })
      navigate('/clinica/solicitacoes')
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

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

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <main className={styles.main}>
          <nav className={styles.breadcrumb}>
            <span onClick={() => navigate('/clinica/solicitacoes')} className={styles.breadLink}>Solicitações</span>
            <span className={styles.breadSep}>›</span>
            <span className={styles.breadAtual}>Editar #{sol.id}</span>
          </nav>

          <div className={styles.tituloBloco}>
            <div>
              <h1 className={styles.titulo}>Editar Solicitação</h1>
              <p className={styles.subtitulo}>Atualize os dados da solicitação #{sol.id}.</p>
            </div>
          </div>

          <div className={styles.layout}>
            <div className={styles.colunaEsquerda}>

              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <div className={styles.cardIcone} style={{ background: '#FFF0F0' }}><PawPrint size={18} color="var(--vermelho)" /></div>
                  <h2>Informações do Paciente</h2>
                </div>

                <div className={styles.grade2}>
                  <div className={styles.campo}>
                    <label>Nome do Paciente</label>
                    <input placeholder="Ex: Thor, Mel..." value={nomePaciente} onChange={e => setNomePaciente(e.target.value)} />
                  </div>
                  <div className={styles.campo}>
                    <label>Espécie</label>
                    <select value={especie} onChange={e => setEspecie(e.target.value as 'CAO' | 'GATO')}>
                      <option value="CAO">Cão</option>
                      <option value="GATO">Gato</option>
                    </select>
                  </div>
                </div>

                <div className={styles.grade3}>
                  <div className={styles.campo}>
                    <label>Raça</label>
                    <input placeholder="Ex: Golden Retriever" value={raca} onChange={e => setRaca(e.target.value)} />
                  </div>
                  <div className={styles.campo}>
                    <label>Peso (kg)</label>
                    <input type="number" placeholder="0.0" value={peso} onChange={e => setPeso(e.target.value)} />
                  </div>
                  <div className={styles.campo}>
                    <label>Tipo Sanguíneo</label>
                    <select value={tipoSanguineo} onChange={e => setTipoSanguineo(e.target.value)}>
                      {tipoOptions.map(o => <option key={o.valor} value={o.valor}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <div className={styles.cardIcone} style={{ background: '#FFF0F0' }}><FileText size={18} color="var(--vermelho)" /></div>
                  <h2>Detalhes da Solicitação</h2>
                </div>

                <div className={styles.campo}>
                  <label>Nível de Urgência</label>
                  <div className={styles.urgenciaBtns}>
                    <button className={`${styles.urgenciaBtn} ${urgencia === 'NORMAL' ? styles.urgenciaBtnAtivo : ''}`} onClick={() => setUrgencia('NORMAL')} type="button">
                      <AlertCircle size={16} /> Normal (Programado)
                    </button>
                    <button className={`${styles.urgenciaBtn} ${styles.urgenciaBtnCritico} ${urgencia === 'CRITICO' ? styles.urgenciaBtnCriticoAtivo : ''}`} onClick={() => setUrgencia('CRITICO')} type="button">
                      <AlertCircle size={16} /> Crítico (Imediato)
                    </button>
                  </div>
                </div>

                <div className={styles.grade2}>
                  <div className={styles.campo}>
                    <label>Volume Necessário (ml)</label>
                    <input type="number" placeholder="Ex: 450" value={volume} onChange={e => setVolume(e.target.value)} />
                  </div>
                  <div className={styles.campo}>
                    <label>Motivo / Causa</label>
                    <select value={motivo} onChange={e => setMotivo(e.target.value)}>
                      <option>Cirurgia</option>
                      <option>Acidente</option>
                      <option>Anemia</option>
                      <option>Envenenamento</option>
                      <option>Doença crônica</option>
                      <option>Outro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.colunaDireita}>

              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <div className={styles.cardIcone} style={{ background: '#FFF0F0' }}><FileText size={18} color="var(--vermelho)" /></div>
                  <h2>Unidade Solicitante</h2>
                </div>

                <div className={styles.unidadeBloco}>
                  <span className={styles.unidadeLabel}>Hospital / Clínica</span>
                  <div className={styles.unidadeNome}>
                    <span className={styles.unidadePonto} />
                    {usuario?.nome ?? 'Clínica'}
                  </div>
                </div>

                <div className={styles.campo}>
                  <label>Médico Veterinário Responsável</label>
                  <input placeholder="Ex: Dr. João Silva (CRMV 12345)" value={medico} onChange={e => setMedico(e.target.value)} />
                </div>

                <div className={styles.localizacaoBloco}>
                  <MapPin size={15} color="var(--vermelho)" />
                  <div>
                    <strong>Localização da Unidade</strong>
                    <span>Endereço não cadastrado</span>
                  </div>
                </div>
              </div>

              {erro && <p className={styles.erro}>{erro}</p>}

              <button className={styles.btnPublicar} onClick={salvar} disabled={salvando}>
                {salvando ? <Loader2 size={18} className={styles.spinnerBtn} /> : <Save size={18} />}
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button className={styles.btnCancelar} onClick={() => navigate('/clinica/solicitacoes')}>
                <X size={16} /> Cancelar
              </button>

              <div className={styles.selos}>
                <div className={styles.selo}><Shield size={14} color="var(--texto-medio)" /><span>Segurança de Dados LGPD</span></div>
                <div className={styles.selo}><Zap size={14} color="var(--texto-medio)" /><span>Alerta em tempo real</span></div>
                <div className={styles.selo}><Users size={14} color="var(--texto-medio)" /><span>Rede Solidária Nacional</span></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
