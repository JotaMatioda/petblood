import styles from './EditarPet.module.css'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Info, BriefcaseMedical, Save, ChevronDown } from 'lucide-react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { listarPets, atualizarPet, type Pet } from '../../../servicos/pets.ts'

const tiposSanguineos = [
  { label: 'DEA 1.1+', valor: 'DEA_1_1_POS' },
  { label: 'DEA 1.1-', valor: 'DEA_1_1_NEG' },
  { label: 'DEA 3',    valor: 'DEA_3'        },
  { label: 'DEA 4',    valor: 'DEA_4'        },
  { label: 'DEA 5',    valor: 'DEA_5'        },
  { label: 'DEA 7',    valor: 'DEA_7'        },
  { label: 'Dal',      valor: 'DAL'          },
  { label: 'Desconhecido', valor: 'DESCONHECIDO' },
]
const vacinas = ['V10 / V8 (Polivalente)', 'Antirrábica', 'Gripe']

export default function EditarPet() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [pet, setPet] = useState<Pet | null>(null)
  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState<'CAO' | 'GATO'>('CAO')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [tipoSanguineo, setTipoSanguineo] = useState('')
  const [vacinasSelecionadas, setVacinasSelecionadas] = useState<string[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    listarPets().then(lista => {
      const p = lista.find(x => x.id === Number(id))
      if (!p) { setCarregando(false); return }
      setPet(p)
      setNome(p.nome)
      setEspecie(p.especie)
      setRaca(p.raca ?? '')
      setIdade(p.idade != null ? String(p.idade) : '')
      setPeso(p.peso != null ? String(p.peso) : '')
      setTipoSanguineo(p.tipoSanguineo ?? '')
      const v: string[] = []
      if (p.vacinaV10)    v.push('V10 / V8 (Polivalente)')
      if (p.vacinaRabica) v.push('Antirrábica')
      if (p.vacinaGripe)  v.push('Gripe')
      setVacinasSelecionadas(v)
      setCarregando(false)
    })
  }, [id])

  function toggleVacina(v: string) {
    setVacinasSelecionadas(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('O nome é obrigatório.'); return }
    setSalvando(true)
    try {
      await atualizarPet(Number(id), {
        nome, especie,
        raca: raca || undefined,
        idade: idade ? Number(idade) : undefined,
        peso:  peso  ? Number(peso)  : undefined,
        tipoSanguineo: tipoSanguineo || undefined,
        vacinaV10:    vacinasSelecionadas.includes('V10 / V8 (Polivalente)'),
        vacinaRabica: vacinasSelecionadas.includes('Antirrábica'),
        vacinaGripe:  vacinasSelecionadas.includes('Gripe'),
      })
      navigate(`/pets/${id}`)
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <div className={styles.pagina}><Sidebar /><main className={styles.main}><p>Carregando...</p></main></div>
  if (!pet)       return <div className={styles.pagina}><Sidebar /><main className={styles.main}><p>Pet não encontrado.</p></main></div>

  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.main}>

        <div className={styles.cabecalho}>
          <button className={styles.btnVoltar} onClick={() => navigate(`/pets/${id}`)}>
            <ChevronLeft size={18} /> {pet.nome}
          </button>
        </div>

        <div className={styles.tituloArea}>
          <h1 className={styles.titulo}>Editar Pet</h1>
          <p className={styles.subtitulo}>Atualize as informações de <strong>{pet.nome}</strong>.</p>
        </div>

        <form onSubmit={salvar}>
          <div className={styles.conteudo}>
            <div className={styles.colunaEsquerda}>

              <div className={styles.card}>
                <div className={styles.cardTitulo}><Info size={18} color="#C0392B" /><span>Informações Básicas</span></div>
                <div className={styles.gridQuadruplo}>
                  <div className={`${styles.campo} ${styles.colSpan2}`}>
                    <label>Nome do Pet</label>
                    <input value={nome} onChange={e => setNome(e.target.value)} required />
                  </div>
                  <div className={styles.campo}>
                    <label>Espécie</label>
                    <div className={styles.selectWrapper}>
                      <select value={especie} onChange={e => setEspecie(e.target.value as 'CAO' | 'GATO')}>
                        <option value="CAO">Cão</option>
                        <option value="GATO">Gato</option>
                      </select>
                      <ChevronDown size={16} className={styles.selectIcone} />
                    </div>
                  </div>
                  <div className={styles.campo}>
                    <label>Peso (kg)</label>
                    <input type="number" step="0.1" min={0} value={peso} onChange={e => setPeso(e.target.value)} placeholder="0.0" />
                  </div>
                  <div className={`${styles.campo} ${styles.colSpan2}`}>
                    <label>Raça</label>
                    <input value={raca} onChange={e => setRaca(e.target.value)} placeholder="Ex: Shih Tzu" />
                  </div>
                  <div className={styles.campo}>
                    <label>Idade (anos)</label>
                    <input type="number" min={0} value={idade} onChange={e => setIdade(e.target.value)} placeholder="0" />
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitulo}><BriefcaseMedical size={18} color="#C0392B" /><span>Dados de Saúde</span></div>
                <div className={styles.campo}>
                  <label>Tipo Sanguíneo</label>
                  <div className={styles.tiposGrid}>
                    {tiposSanguineos.map(t => (
                      <button key={t.valor} type="button"
                        className={`${styles.tipoBotao} ${tipoSanguineo === t.valor ? styles.tipoBotaoAtivo : ''}`}
                        onClick={() => setTipoSanguineo(t.valor)}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.campo}>
                  <label>Status de Vacinação</label>
                  <div className={styles.vacinasLista}>
                    {vacinas.map(v => (
                      <label key={v} className={styles.checkboxLabel}>
                        <input type="checkbox" checked={vacinasSelecionadas.includes(v)} onChange={() => toggleVacina(v)} />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className={styles.colunaDireita}>
              <div className={`${styles.card} ${styles.cardSalvar}`}>
                <strong>Salvar alterações?</strong>
                <p>As informações atualizadas serão salvas imediatamente.</p>
                {erro && <p className={styles.erro}>{erro}</p>}
                <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                  <Save size={16} /> {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button type="button" className={styles.btnCancelar} onClick={() => navigate(`/pets/${id}`)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
