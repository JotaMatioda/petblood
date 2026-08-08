import styles from './CadastrarPet.module.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Info, Upload, ChevronDown, BriefcaseMedical, Heart, MapPin } from 'lucide-react'
import { cadastrarPet } from '../../../servicos/pets.ts'
import { salvarDoador, geocodificarEndereco } from '../../../servicos/doadores.ts'
import { getUsuario } from '../../../servicos/auth.ts'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'

const tiposSanguineos: { label: string; valor: string }[] = [
  { label: 'DEA 1.1+',    valor: 'DEA_1_1_POS'   },
  { label: 'DEA 1.1-',    valor: 'DEA_1_1_NEG'   },
  { label: 'DEA 3',       valor: 'DEA_3'          },
  { label: 'DEA 4',       valor: 'DEA_4'          },
  { label: 'DEA 5',       valor: 'DEA_5'          },
  { label: 'DEA 7',       valor: 'DEA_7'          },
  { label: 'Dal',         valor: 'DAL'            },
  { label: 'Desconhecido',valor: 'DESCONHECIDO'   },
]
const vacinas = ['V10 / V8 (Polivalente)', 'Antirrábica', 'Gripe']

export default function CadastrarPet() {
  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState<'CAO' | 'GATO'>('CAO')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [tipoSanguineo, setTipoSanguineo] = useState('')
  const [vacinasSelecionadas, setVacinasSelecionadas] = useState<string[]>([])
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoBase64, setFotoBase64] = useState<string | null>(null)
  const [disponivelDoacao, setDisponivelDoacao] = useState(false)
  const [endereco, setEndereco] = useState('')
  const [contato, setContato] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  function toggleVacina(vacina: string) {
    setVacinasSelecionadas(prev =>
      prev.includes(vacina) ? prev.filter(v => v !== vacina) : [...prev, vacina]
    )
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const base64 = ev.target?.result as string
      setFotoPreview(base64)
      setFotoBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('O nome do pet é obrigatório.'); return }
    setErro('')
    setCarregando(true)
    try {
      const pet = await cadastrarPet({
        nome,
        especie,
        raca: raca || undefined,
        idade: idade ? Number(idade) : undefined,
        peso: peso ? Number(peso) : undefined,
        tipoSanguineo: tipoSanguineo || undefined,
        vacinaV10: vacinasSelecionadas.includes('V10 / V8 (Polivalente)'),
        vacinaRabica: vacinasSelecionadas.includes('Antirrábica'),
        vacinaGripe: vacinasSelecionadas.includes('Gripe'),
      })

      if (fotoBase64) {
        localStorage.setItem(`petblood_pet_foto_${pet.id}`, fotoBase64)
      }

      if (disponivelDoacao && endereco.trim()) {
        const coords = await geocodificarEndereco(endereco)
        if (coords) {
          const usuario = getUsuario()
          salvarDoador({
            petId: pet.id,
            nome,
            especie,
            raca: raca || 'Não informada',
            peso: peso ? `${peso}kg` : '—',
            tipoSanguineo: tipoSanguineo || 'DESCONHECIDO',
            tutorNome: usuario?.nome ?? 'Tutor',
            contato: contato || '—',
            lat: coords[0],
            lng: coords[1],
          })
        }
      }

      navigate('/meus-pets')
    } catch {
      setErro('Erro ao cadastrar pet. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.pagina}>

      <Sidebar />

      {/* Conteúdo */}
      <main className={styles.main}>
        <div className={styles.paginaCabecalho}>
          <Link to="/meus-pets" className={styles.btnVoltar}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.titulo}>Cadastrar Novo Pet</h1>
            <p className={styles.subtitulo}>Adicione as informações básicas e clínicas do seu pet para começar.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.conteudo}>
            {/* Coluna principal */}
            <div className={styles.colunaEsquerda}>

              {/* Informações Básicas */}
              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <Info size={18} color="#C0392B" />
                  <span>Informações Básicas</span>
                </div>

                <div className={styles.gridQuadruplo}>
                  <div className={`${styles.campo} ${styles.colSpan2}`}>
                    <label>Nome do Pet</label>
                    <input
                      type="text"
                      placeholder="Ex: Zé Carlos"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.campo}>
                    <label>Espécie</label>
                    <div className={styles.selectWrapper}>
                      <select value={especie} onChange={(e) => setEspecie(e.target.value as 'CAO' | 'GATO')}>
                        <option value="CAO">Cão</option>
                        <option value="GATO">Gato</option>
                      </select>
                      <ChevronDown size={16} className={styles.selectIcone} />
                    </div>
                  </div>
                  <div className={styles.campo}>
                    <label>Peso (kg)</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      step="0.1"
                      min={0}
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                    />
                  </div>
                  <div className={`${styles.campo} ${styles.colSpan2}`}>
                    <label>Raça</label>
                    <input
                      type="text"
                      placeholder="Ex: Shih Tzu"
                      value={raca}
                      onChange={(e) => setRaca(e.target.value)}
                    />
                  </div>
                  <div className={styles.campo}>
                    <label>Idade (anos)</label>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      value={idade}
                      onChange={(e) => setIdade(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dados de Saúde */}
              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <BriefcaseMedical size={18} color="#C0392B" />
                  <span>Dados de Saúde</span>
                </div>

                <div className={styles.campo}>
                  <label>Tipo Sanguíneo</label>
                  <div className={styles.tiposGrid}>
                    {tiposSanguineos.map(tipo => (
                      <button
                        key={tipo.valor}
                        type="button"
                        className={`${styles.tipoBotao} ${tipoSanguineo === tipo.valor ? styles.tipoBotaoAtivo : ''}`}
                        onClick={() => setTipoSanguineo(tipo.valor)}
                      >
                        {tipo.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.campo}>
                  <label>Status de Vacinação</label>
                  <div className={styles.vacinasLista}>
                    {vacinas.map(vacina => (
                      <label key={vacina} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={vacinasSelecionadas.includes(vacina)}
                          onChange={() => toggleVacina(vacina)}
                        />
                        {vacina}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disponível para doação */}
              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <Heart size={18} color="#C0392B" />
                  <span>Disponibilidade para Doação</span>
                </div>

                <div className={styles.doacaoToggleRow}>
                  <div>
                    <strong className={styles.doacaoLabel}>Disponível para doação de sangue</strong>
                    <p className={styles.doacaoDesc}>Ao ativar, este pet poderá ser encontrado por clínicas em busca de emergência.</p>
                  </div>
                  <button
                    type="button"
                    className={`${styles.toggle} ${disponivelDoacao ? styles.toggleAtivo : ''}`}
                    onClick={() => setDisponivelDoacao(v => !v)}
                  >
                    <span className={styles.toggleThumb} />
                  </button>
                </div>

                {disponivelDoacao && (
                  <div className={styles.doacaoCampos}>
                    <div className={styles.campo}>
                      <label><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />Endereço (para cálculo de distância)</label>
                      <input
                        type="text"
                        placeholder="Ex: Rua das Flores, 123, Pato Branco - PR"
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                      />
                    </div>
                    <div className={styles.campo}>
                      <label>Contato do tutor</label>
                      <input
                        type="text"
                        placeholder="Ex: (46) 99999-0000"
                        value={contato}
                        onChange={e => setContato(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna direita */}
            <div className={styles.colunaDireita}>

              {/* Upload de foto */}
              <div className={styles.card}>
                <div className={styles.cardTitulo}>
                  <Upload size={18} color="#C0392B" />
                  <span>Foto do Pet</span>
                </div>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/png,image/jpg,image/jpeg" onChange={handleFoto} hidden />
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className={styles.fotoPreview} />
                  ) : (
                    <>
                      <div className={styles.uploadIcone}><Upload size={28} color="#C0392B" /></div>
                      <span className={styles.uploadTexto}>Clique para enviar</span>
                      <span className={styles.uploadInfo}>PNG ou JPG até 5MB</span>
                    </>
                  )}
                </label>
              </div>

              {/* Card salvar */}
              <div className={`${styles.card} ${styles.cardSalvar}`}>
                <strong>Pronto para salvar?</strong>
                <p>Ao cadastrar o pet, ele ficará visível em seu dashboard e pronto para futuras doações.</p>
                {erro && <p className={styles.erro}>{erro}</p>}
                <button type="submit" className={styles.btnCadastrar} disabled={carregando}>
                  {carregando ? 'Cadastrando...' : 'Cadastrar Pet'}
                </button>
                <Link to="/meus-pets" className={styles.btnCancelar}>Cancelar</Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
