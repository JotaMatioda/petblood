import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NovaEntradaBolsa.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { adicionarBolsa } from '../Inventario/Inventario.tsx'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import {
  ChevronLeft, Droplets, Save, ChevronDown
} from 'lucide-react'

const TIPOS_CANINO = ['DEA 1.1+', 'DEA 1.1-', 'DEA 3', 'DEA 4', 'DEA 5', 'DEA 7']
const TIPOS_FELINO = ['Tipo A', 'Tipo B', 'Tipo AB']

export default function NovaEntradaBolsa() {
  const navigate = useNavigate()
  const usuario = getUsuario()

  const [especie, setEspecie] = useState<'CANINO' | 'FELINO'>('CANINO')
  const [tipoSanguineo, setTipoSanguineo] = useState('')
  const [volume, setVolume] = useState('')
  const [dataColeta, setDataColeta] = useState('')
  const [dataVencimento, setDataVencimento] = useState('')
  const [doador, setDoador] = useState('')
  const [racaDoador, setRacaDoador] = useState('')
  const [veterinario, setVeterinario] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [status, setStatus] = useState<'DISPONIVEL' | 'RESERVADO' | 'QUARENTENA'>('DISPONIVEL')
  const [salvando, setSalvando] = useState(false)

  const tipos = especie === 'CANINO' ? TIPOS_CANINO : TIPOS_FELINO

  function handleEspecie(e: 'CANINO' | 'FELINO') {
    setEspecie(e)
    setTipoSanguineo('')
  }

  function salvar() {
    if (!tipoSanguineo || !volume || !dataColeta || !dataVencimento) return
    setSalvando(true)
    adicionarBolsa({
      especie,
      tipoSanguineo,
      volume,
      dataColeta,
      dataVencimento,
      status,
      doador: doador || undefined,
      raca: racaDoador || undefined,
      veterinario: veterinario || undefined,
      observacoes: observacoes || undefined,
    })
    setSalvando(false)
    navigate('/clinica/inventario')
  }

  const statusOpcoes = [
    { val: 'DISPONIVEL', label: 'Disponível', cor: styles.statusDisponivel },
    { val: 'RESERVADO',  label: 'Reservado',  cor: styles.statusReservado  },
    { val: 'QUARENTENA', label: 'Quarentena', cor: styles.statusQuarentena },
  ]

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
          <div className={styles.tituloBarra}>
            <div>
              <h1 className={styles.titulo}>Nova Entrada de Bolsa</h1>
              <p className={styles.subtitulo}>Registre uma nova bolsa de sangue no estoque da clínica.</p>
            </div>
          </div>

          <div className={styles.grid}>

            {/* Coluna principal */}
            <div className={styles.coluna}>

              {/* Informações da bolsa */}
              <div className={styles.card}>
                <div className={styles.cardTituloArea}>
                  <Droplets size={18} color="#C0392B" />
                  <h2 className={styles.cardTitulo}>Informações da Bolsa</h2>
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Espécie <span className={styles.obrigatorio}>*</span></label>
                  <div className={styles.especieBtns}>
                    <button
                      type="button"
                      className={`${styles.especieBtn} ${especie === 'CANINO' ? styles.especieBtnAtivo : ''}`}
                      onClick={() => handleEspecie('CANINO')}
                    >
                      🐕 Canino
                    </button>
                    <button
                      type="button"
                      className={`${styles.especieBtn} ${especie === 'FELINO' ? styles.especieBtnAtivo : ''}`}
                      onClick={() => handleEspecie('FELINO')}
                    >
                      🐈 Felino
                    </button>
                  </div>
                </div>

                <div className={styles.linha2}>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Tipo Sanguíneo <span className={styles.obrigatorio}>*</span></label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={tipoSanguineo}
                        onChange={e => setTipoSanguineo(e.target.value)}
                      >
                        <option value="">Selecione</option>
                        {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className={styles.selectIcone} />
                    </div>
                  </div>

                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Volume (ml) <span className={styles.obrigatorio}>*</span></label>
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="Ex: 450"
                      value={volume}
                      onChange={e => setVolume(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.linha2}>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Data de Coleta <span className={styles.obrigatorio}>*</span></label>
                    <input
                      className={styles.input}
                      type="date"
                      value={dataColeta}
                      onChange={e => setDataColeta(e.target.value)}
                    />
                  </div>

                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Data de Vencimento <span className={styles.obrigatorio}>*</span></label>
                    <input
                      className={styles.input}
                      type="date"
                      value={dataVencimento}
                      onChange={e => setDataVencimento(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Status Inicial</label>
                  <div className={styles.statusBtns}>
                    {statusOpcoes.map(s => (
                      <button
                        key={s.val}
                        type="button"
                        className={`${styles.statusBtn} ${status === s.val ? s.cor : ''}`}
                        onClick={() => setStatus(s.val as typeof status)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dados do doador */}
              <div className={styles.card}>
                <div className={styles.cardTituloArea}>
                  <h2 className={styles.cardTitulo}>Dados do Doador</h2>
                </div>

                <div className={styles.linha2}>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Nome do Animal</label>
                    <input
                      className={styles.input}
                      placeholder="Ex: Thor"
                      value={doador}
                      onChange={e => setDoador(e.target.value)}
                    />
                  </div>

                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Raça</label>
                    <input
                      className={styles.input}
                      placeholder="Ex: Golden Retriever"
                      value={racaDoador}
                      onChange={e => setRacaDoador(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Médico Responsável pela Coleta</label>
                  <input
                    className={styles.input}
                    placeholder="Nome do veterinário"
                    value={veterinario}
                    onChange={e => setVeterinario(e.target.value)}
                  />
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Observações</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Informações adicionais sobre a bolsa ou o doador..."
                    rows={3}
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Coluna lateral — resumo */}
            <div className={styles.lateral}>
              <div className={styles.card}>
                <h2 className={styles.cardTitulo}>Resumo</h2>

                <div className={styles.resumoLista}>
                  <div className={styles.resumoItem}>
                    <span>Espécie</span>
                    <strong>{especie === 'CANINO' ? '🐕 Canino' : '🐈 Felino'}</strong>
                  </div>
                  <div className={styles.resumoItem}>
                    <span>Tipo Sanguíneo</span>
                    <strong>{tipoSanguineo || '—'}</strong>
                  </div>
                  <div className={styles.resumoItem}>
                    <span>Volume</span>
                    <strong>{volume ? `${volume} ml` : '—'}</strong>
                  </div>
                  <div className={styles.resumoItem}>
                    <span>Coleta</span>
                    <strong>{dataColeta ? new Date(dataColeta + 'T00:00').toLocaleDateString('pt-BR') : '—'}</strong>
                  </div>
                  <div className={styles.resumoItem}>
                    <span>Vencimento</span>
                    <strong>{dataVencimento ? new Date(dataVencimento + 'T00:00').toLocaleDateString('pt-BR') : '—'}</strong>
                  </div>
                  <div className={styles.resumoItem}>
                    <span>Status</span>
                    <strong>{statusOpcoes.find(s => s.val === status)?.label}</strong>
                  </div>
                  {doador && (
                    <div className={styles.resumoItem}>
                      <span>Doador</span>
                      <strong>{doador}</strong>
                    </div>
                  )}
                </div>

                <button
                  className={styles.btnSalvar}
                  onClick={salvar}
                  disabled={!tipoSanguineo || !volume || !dataColeta || !dataVencimento || salvando}
                >
                  <Save size={16} />
                  {salvando ? 'Salvando...' : 'Registrar Bolsa'}
                </button>

                <button className={styles.btnCancelar} onClick={() => navigate('/clinica/inventario')}>
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
