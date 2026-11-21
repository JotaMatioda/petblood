import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NovaSolicitacao.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { getUsuario } from '../../../servicos/auth.ts'
import { criarSolicitacao } from '../../../servicos/solicitacoes.ts'
import { salvarAlerta } from '../../../servicos/alertas.ts'
import { geocodificarEndereco } from '../../../servicos/doadores.ts'
import {
  PawPrint, FileText, AlertCircle, MapPin, Send, X,
  Shield, Zap, Users, Loader2
} from 'lucide-react'

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

export default function NovaSolicitacao() {
  const navigate = useNavigate()
  const usuario = getUsuario()

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

  async function publicar() {
    if (!nomePaciente.trim()) { setErro('Informe o nome do paciente.'); return }
    if (!volume.trim()) { setErro('Informe o volume necessário.'); return }
    setErro('')
    setSalvando(true)
    try {
      await criarSolicitacao({
        nomePaciente,
        especie,
        raca: raca || undefined,
        peso: peso ? `${peso} kg` : undefined,
        tipoSanguineo,
        volume,
        motivo,
        urgencia,
        medicoResponsavel: medico || undefined,
      })

      // Geocodifica endereço da clínica e salva alerta para tutores
      const enderecoClinica = localStorage.getItem('petblood_clinica_endereco') ?? ''
      const coords = enderecoClinica ? await geocodificarEndereco(enderecoClinica) : null
      salvarAlerta({
        id: `alerta_${Date.now()}`,
        tipoSanguineo,
        especie,
        urgencia,
        clinicaNome: usuario?.nome ?? 'Clínica',
        clinicaContato: localStorage.getItem('petblood_clinica_whatsapp') ?? undefined,
        clinicaLat: coords ? coords[0] : null,
        clinicaLng: coords ? coords[1] : null,
        raioKm: 10,
        nomePaciente,
        criadoEm: new Date().toISOString(),
      })

      navigate('/clinica/solicitacoes')
    } catch {
      setErro('Erro ao publicar solicitação. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <main className={styles.main}>
          <nav className={styles.breadcrumb}>
            <span onClick={() => navigate('/clinica/solicitacoes')} className={styles.breadLink}>Solicitações</span>
            <span className={styles.breadSep}>›</span>
            <span className={styles.breadAtual}>Nova Urgência</span>
          </nav>

          <div className={styles.tituloBloco}>
            <div>
              <h1 className={styles.titulo}>Nova Solicitação de Urgência</h1>
              <p className={styles.subtitulo}>Preencha os dados do paciente receptor para alertar doadores compatíveis.</p>
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
                    <span>{localStorage.getItem('petblood_clinica_endereco') || 'Endereço não cadastrado'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.resumoCard}>
                <span className={styles.resumoLabel}>RESUMO DA NOTIFICAÇÃO</span>
                <div className={styles.resumoCorpo}>
                  <div className={styles.resumoIconeBloco}><FileText size={20} color="var(--vermelho)" /></div>
                  <div>
                    <strong className={styles.resumoTitulo}>Solicitação de Sangue</strong>
                    <span className={`${styles.resumoBadge} ${urgencia === 'CRITICO' ? styles.resumoBadgeCritico : styles.resumoBadgeNormal}`}>
                      {urgencia === 'CRITICO' ? '● Urgência Crítica' : '● Programada'}
                    </span>
                  </div>
                </div>
                <p className={styles.resumoTexto}>Ao publicar, todos os doadores compatíveis num raio de 10km receberão um alerta imediato em seus dispositivos.</p>
              </div>

              {erro && <p className={styles.erro}>{erro}</p>}

              <button className={styles.btnPublicar} onClick={publicar} disabled={salvando}>
                {salvando ? <Loader2 size={18} className={styles.spinnerBtn} /> : <Send size={18} />}
                {salvando ? 'Publicando...' : 'Publicar Solicitação'}
              </button>
              <button className={styles.btnCancelar} onClick={() => navigate('/clinica/solicitacoes')}>
                <X size={16} /> Cancelar Operação
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
