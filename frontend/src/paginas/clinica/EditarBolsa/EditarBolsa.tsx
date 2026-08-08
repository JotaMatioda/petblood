import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from '../NovaEntradaBolsa/NovaEntradaBolsa.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { carregarBolsas, salvarBolsas } from '../Inventario/Inventario.tsx'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import {
  ChevronLeft, Droplets, Save, ChevronDown
} from 'lucide-react'

const TIPOS_CANINO = ['DEA 1.1+', 'DEA 1.1-', 'DEA 3', 'DEA 4', 'DEA 5', 'DEA 7']
const TIPOS_FELINO = ['Tipo A', 'Tipo B', 'Tipo AB']

export default function EditarBolsa() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const usuario = getUsuario()

  const bolsas = carregarBolsas()
  const bolsa = bolsas.find(b => b.id === decodeURIComponent(id ?? ''))

  const [especie, setEspecie] = useState<'CANINO' | 'FELINO'>(bolsa?.especie ?? 'CANINO')
  const [tipoSanguineo, setTipoSanguineo] = useState(bolsa?.tipoSanguineo ?? '')
  const [volume, setVolume] = useState(bolsa?.volume ?? '')
  const [dataColeta, setDataColeta] = useState(bolsa?.dataColeta ?? '')
  const [dataVencimento, setDataVencimento] = useState(bolsa?.dataVencimento ?? '')
  const [doador, setDoador] = useState(bolsa?.doador ?? '')
  const [racaDoador, setRacaDoador] = useState(bolsa?.raca ?? '')
  const [veterinario, setVeterinario] = useState(bolsa?.veterinario ?? '')
  const [observacoes, setObservacoes] = useState(bolsa?.observacoes ?? '')
  const [status, setStatus] = useState<'DISPONIVEL' | 'RESERVADO' | 'QUARENTENA'>(bolsa?.status ?? 'DISPONIVEL')
  const [salvando, setSalvando] = useState(false)

  const tipos = especie === 'CANINO' ? TIPOS_CANINO : TIPOS_FELINO

  function handleEspecie(e: 'CANINO' | 'FELINO') {
    setEspecie(e)
    setTipoSanguineo('')
  }

  function salvar() {
    if (!tipoSanguineo || !volume || !dataColeta || !dataVencimento || !bolsa) return
    setSalvando(true)
    const atualizadas = bolsas.map(b =>
      b.id === bolsa.id
        ? { ...b, especie, tipoSanguineo, volume, dataColeta, dataVencimento, status, doador: doador || undefined, raca: racaDoador || undefined, veterinario: veterinario || undefined, observacoes: observacoes || undefined }
        : b
    )
    salvarBolsas(atualizadas)
    setSalvando(false)
    navigate(`/clinica/bolsas/${encodeURIComponent(bolsa.id)}`)
  }

  const statusOpcoes = [
    { val: 'DISPONIVEL', label: 'Disponível', cor: styles.statusDisponivel },
    { val: 'RESERVADO',  label: 'Reservado',  cor: styles.statusReservado  },
    { val: 'QUARENTENA', label: 'Quarentena', cor: styles.statusQuarentena },
  ]

  if (!bolsa) {
    return (
      <div className={styles.pagina}>
        <SidebarClinica />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Bolsa não encontrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <header className={styles.header}>
          <button className={styles.btnVoltar} onClick={() => navigate(`/clinica/bolsas/${encodeURIComponent(bolsa.id)}`)}>
            <ChevronLeft size={18} /> Detalhes
          </button>
          <PerfilHeaderBtn />
        </header>

        <main className={styles.main}>
          <div className={styles.tituloBarra}>
            <div>
              <h1 className={styles.titulo}>Editar Bolsa <span style={{ color: 'var(--texto-medio)', fontWeight: 500, fontSize: '1rem' }}>{bolsa.id}</span></h1>
              <p className={styles.subtitulo}>Atualize as informações desta bolsa de sangue.</p>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.coluna}>

              <div className={styles.card}>
                <div className={styles.cardTituloArea}>
                  <Droplets size={18} color="#C0392B" />
                  <h2 className={styles.cardTitulo}>Informações da Bolsa</h2>
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Espécie <span className={styles.obrigatorio}>*</span></label>
                  <div className={styles.especieBtns}>
                    <button type="button" className={`${styles.especieBtn} ${especie === 'CANINO' ? styles.especieBtnAtivo : ''}`} onClick={() => handleEspecie('CANINO')}>
                      🐕 Canino
                    </button>
                    <button type="button" className={`${styles.especieBtn} ${especie === 'FELINO' ? styles.especieBtnAtivo : ''}`} onClick={() => handleEspecie('FELINO')}>
                      🐈 Felino
                    </button>
                  </div>
                </div>

                <div className={styles.linha2}>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Tipo Sanguíneo <span className={styles.obrigatorio}>*</span></label>
                    <div className={styles.selectWrapper}>
                      <select className={styles.select} value={tipoSanguineo} onChange={e => setTipoSanguineo(e.target.value)}>
                        <option value="">Selecione</option>
                        {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className={styles.selectIcone} />
                    </div>
                  </div>

                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Volume (ml) <span className={styles.obrigatorio}>*</span></label>
                    <input className={styles.input} type="number" placeholder="Ex: 450" value={volume} onChange={e => setVolume(e.target.value)} />
                  </div>
                </div>

                <div className={styles.linha2}>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Data de Coleta <span className={styles.obrigatorio}>*</span></label>
                    <input className={styles.input} type="date" value={dataColeta} onChange={e => setDataColeta(e.target.value)} />
                  </div>

                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Data de Vencimento <span className={styles.obrigatorio}>*</span></label>
                    <input className={styles.input} type="date" value={dataVencimento} onChange={e => setDataVencimento(e.target.value)} />
                  </div>
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Status</label>
                  <div className={styles.statusBtns}>
                    {statusOpcoes.map(s => (
                      <button key={s.val} type="button" className={`${styles.statusBtn} ${status === s.val ? s.cor : ''}`} onClick={() => setStatus(s.val as typeof status)}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTituloArea}>
                  <h2 className={styles.cardTitulo}>Dados do Doador</h2>
                </div>

                <div className={styles.linha2}>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Nome do Animal</label>
                    <input className={styles.input} placeholder="Ex: Thor" value={doador} onChange={e => setDoador(e.target.value)} />
                  </div>
                  <div className={styles.campoGrupo}>
                    <label className={styles.label}>Raça</label>
                    <input className={styles.input} placeholder="Ex: Golden Retriever" value={racaDoador} onChange={e => setRacaDoador(e.target.value)} />
                  </div>
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Médico Responsável pela Coleta</label>
                  <input className={styles.input} placeholder="Nome do veterinário" value={veterinario} onChange={e => setVeterinario(e.target.value)} />
                </div>

                <div className={styles.campoGrupo}>
                  <label className={styles.label}>Observações</label>
                  <textarea className={styles.textarea} placeholder="Informações adicionais..." rows={3} value={observacoes} onChange={e => setObservacoes(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Lateral */}
            <div className={styles.lateral}>
              <div className={styles.card}>
                <h2 className={styles.cardTitulo}>Resumo</h2>
                <div className={styles.resumoLista}>
                  {[
                    ['Espécie',      especie === 'CANINO' ? '🐕 Canino' : '🐈 Felino'],
                    ['Tipo Sanguíneo', tipoSanguineo || '—'],
                    ['Volume',       volume ? `${volume} ml` : '—'],
                    ['Coleta',       dataColeta ? new Date(dataColeta + 'T00:00').toLocaleDateString('pt-BR') : '—'],
                    ['Vencimento',   dataVencimento ? new Date(dataVencimento + 'T00:00').toLocaleDateString('pt-BR') : '—'],
                    ['Status',       statusOpcoes.find(s => s.val === status)?.label ?? '—'],
                  ].map(([label, valor]) => (
                    <div key={label} className={styles.resumoItem}>
                      <span>{label}</span>
                      <strong>{valor}</strong>
                    </div>
                  ))}
                </div>

                <button
                  className={styles.btnSalvar}
                  onClick={salvar}
                  disabled={!tipoSanguineo || !volume || !dataColeta || !dataVencimento || salvando}
                >
                  <Save size={16} />
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>

                <button className={styles.btnCancelar} onClick={() => navigate(`/clinica/bolsas/${encodeURIComponent(bolsa.id)}`)}>
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
