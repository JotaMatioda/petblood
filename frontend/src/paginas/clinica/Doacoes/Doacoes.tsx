import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Doacoes.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import PerfilHeaderBtn from '../../../componentes/PerfilHeaderBtn/PerfilHeaderBtn.tsx'
import { Heart, Plus, Search, Trash2, PawPrint } from 'lucide-react'

export type Doacao = {
  id: string
  petNome: string
  tutorNome: string
  especie: 'CANINO' | 'FELINO'
  tipoSanguineo: string
  volume: string
  data: string
  veterinario: string
  observacoes?: string
}

function chaveDoacao() {
  try {
    const u = JSON.parse(localStorage.getItem('usuario') ?? '{}')
    return `petblood_doacoes_clinica_${u.id ?? 'guest'}`
  } catch { return 'petblood_doacoes_clinica_guest' }
}

function carregarDoacoes(): Doacao[] {
  try { return JSON.parse(localStorage.getItem(chaveDoacao()) ?? '[]') } catch { return [] }
}

function salvarDoacoes(lista: Doacao[]) {
  localStorage.setItem(chaveDoacao(), JSON.stringify(lista))
}

const TIPOS_CANINO = ['DEA 1.1+', 'DEA 1.1-', 'DEA 3', 'DEA 4', 'DEA 5', 'DEA 7']
const TIPOS_FELINO = ['Tipo A', 'Tipo B', 'Tipo AB']

function formatarData(iso: string) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00').toLocaleDateString('pt-BR')
}

export default function Doacoes() {
  const navigate = useNavigate()
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)

  // Formulário
  const [petNome, setPetNome] = useState('')
  const [tutorNome, setTutorNome] = useState('')
  const [especie, setEspecie] = useState<'CANINO' | 'FELINO'>('CANINO')
  const [tipoSanguineo, setTipoSanguineo] = useState('DEA 1.1+')
  const [volume, setVolume] = useState('')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [veterinario, setVeterinario] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => { setDoacoes(carregarDoacoes()) }, [])

  useEffect(() => {
    const tipos = especie === 'CANINO' ? TIPOS_CANINO : TIPOS_FELINO
    setTipoSanguineo(tipos[0])
  }, [especie])

  function registrar() {
    if (!petNome.trim()) { setErro('Informe o nome do pet.'); return }
    if (!volume.trim()) { setErro('Informe o volume coletado.'); return }
    setErro('')
    const nova: Doacao = {
      id: `#D-${Date.now()}`,
      petNome, tutorNome, especie, tipoSanguineo,
      volume: `${volume} ml`, data, veterinario, observacoes,
    }
    const lista = [nova, ...doacoes]
    salvarDoacoes(lista)
    setDoacoes(lista)
    setModal(false)
    setPetNome(''); setTutorNome(''); setVolume(''); setVeterinario(''); setObservacoes('')
  }

  function excluir(id: string) {
    if (!confirm('Remover este registro de doação?')) return
    const lista = doacoes.filter(d => d.id !== id)
    salvarDoacoes(lista)
    setDoacoes(lista)
  }

  const filtradas = doacoes.filter(d =>
    d.petNome.toLowerCase().includes(busca.toLowerCase()) ||
    d.tutorNome.toLowerCase().includes(busca.toLowerCase()) ||
    d.tipoSanguineo.toLowerCase().includes(busca.toLowerCase())
  )

  const totalVolume = doacoes.reduce((acc, d) => acc + (parseInt(d.volume) || 0), 0)

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <header className={styles.header}>
          <div className={styles.buscaWrapper}>
            <Search size={16} className={styles.buscaIcone} />
            <input
              className={styles.busca}
              placeholder="Buscar por pet, tutor ou tipo sanguíneo..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <PerfilHeaderBtn />
        </header>

        <main className={styles.main}>
          <div className={styles.tituloBarra}>
            <div>
              <h1 className={styles.titulo}>Doações Recebidas</h1>
              <p className={styles.subtitulo}>Histórico de doações de sangue realizadas na clínica.</p>
            </div>
            <button className={styles.btnNova} onClick={() => setModal(true)}>
              <Plus size={16} /> Registrar Doação
            </button>
          </div>

          {/* Cards de resumo */}
          <div className={styles.resumoGrid}>
            <div className={styles.resumoCard}>
              <Heart size={22} color="#C0392B" />
              <div>
                <strong>{doacoes.length}</strong>
                <span>Doações realizadas</span>
              </div>
            </div>
            <div className={styles.resumoCard}>
              <PawPrint size={22} color="#C0392B" />
              <div>
                <strong>{new Set(doacoes.map(d => d.petNome)).size}</strong>
                <span>Pets doadores</span>
              </div>
            </div>
            <div className={styles.resumoCard}>
              <Heart size={22} color="#C0392B" />
              <div>
                <strong>{totalVolume} ml</strong>
                <span>Volume total coletado</span>
              </div>
            </div>
          </div>

          {filtradas.length === 0 ? (
            <div className={styles.vazio}>
              <Heart size={48} color="#C0392B" strokeWidth={1.5} />
              <strong>{busca ? 'Nenhum resultado encontrado.' : 'Nenhuma doação registrada ainda.'}</strong>
              {!busca && (
                <p>Registre a primeira doação recebida na clínica.</p>
              )}
              {!busca && (
                <button className={styles.vazioBtn} onClick={() => setModal(true)}>
                  <Plus size={15} /> Registrar Doação
                </button>
              )}
            </div>
          ) : (
            <div className={styles.tabelaCard}>
              <div className={styles.tabelaCabecalho}>
                <h2 className={styles.tabelaTitulo}>
                  Histórico <span className={styles.tabelaCount}>({filtradas.length})</span>
                </h2>
              </div>
              <div className={styles.tabela}>
                <div className={styles.tabelaHeader}>
                  <span>DATA</span>
                  <span>PET</span>
                  <span>TUTOR</span>
                  <span>ESPÉCIE</span>
                  <span>TIPO SANG.</span>
                  <span>VOLUME</span>
                  <span>VETERINÁRIO</span>
                  <span></span>
                </div>
                {filtradas.map(d => (
                  <div key={d.id} className={styles.tabelaLinha}>
                    <span>{formatarData(d.data)}</span>
                    <span className={styles.petNome}><PawPrint size={13} /> {d.petNome}</span>
                    <span>{d.tutorNome || '—'}</span>
                    <span>{d.especie === 'CANINO' ? 'Canino' : 'Felino'}</span>
                    <span className={styles.tipo}>{d.tipoSanguineo}</span>
                    <span>{d.volume}</span>
                    <span>{d.veterinario || '—'}</span>
                    <button className={styles.btnExcluir} onClick={() => excluir(d.id)} title="Remover">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal registrar doação */}
      {modal && (
        <div className={styles.overlay} onClick={() => setModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitulo}><Heart size={18} color="#C0392B" /> Registrar Doação</h2>

            <div className={styles.grade2}>
              <div className={styles.campo}>
                <label>Nome do Pet *</label>
                <input value={petNome} onChange={e => setPetNome(e.target.value)} placeholder="Ex: Thor" />
              </div>
              <div className={styles.campo}>
                <label>Nome do Tutor</label>
                <input value={tutorNome} onChange={e => setTutorNome(e.target.value)} placeholder="Ex: João Silva" />
              </div>
            </div>

            <div className={styles.grade2}>
              <div className={styles.campo}>
                <label>Espécie</label>
                <select value={especie} onChange={e => setEspecie(e.target.value as 'CANINO' | 'FELINO')}>
                  <option value="CANINO">Canino</option>
                  <option value="FELINO">Felino</option>
                </select>
              </div>
              <div className={styles.campo}>
                <label>Tipo Sanguíneo</label>
                <select value={tipoSanguineo} onChange={e => setTipoSanguineo(e.target.value)}>
                  {(especie === 'CANINO' ? TIPOS_CANINO : TIPOS_FELINO).map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.grade2}>
              <div className={styles.campo}>
                <label>Volume Coletado (ml) *</label>
                <input type="number" value={volume} onChange={e => setVolume(e.target.value)} placeholder="Ex: 450" />
              </div>
              <div className={styles.campo}>
                <label>Data da Doação</label>
                <input type="date" value={data} onChange={e => setData(e.target.value)} />
              </div>
            </div>

            <div className={styles.campo}>
              <label>Veterinário Responsável</label>
              <input value={veterinario} onChange={e => setVeterinario(e.target.value)} placeholder="Ex: Dr. Ana Lima" />
            </div>

            <div className={styles.campo}>
              <label>Observações</label>
              <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Informações adicionais..." rows={2} />
            </div>

            {erro && <p className={styles.erro}>{erro}</p>}

            <div className={styles.modalRodape}>
              <button className={styles.btnCancelar} onClick={() => setModal(false)}>Cancelar</button>
              <button className={styles.btnSalvar} onClick={registrar}><Heart size={15} /> Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
