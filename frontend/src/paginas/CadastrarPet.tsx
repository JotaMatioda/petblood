import styles from './CadastrarPet.module.css'
import logo from '../assets/LogoPetBlood.png'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, History, Bell,
  Settings, HelpCircle, LogOut, ArrowLeft,
  Info, Upload, ChevronDown, BriefcaseMedical
} from 'lucide-react'

const tiposSanguineos = ['DEA 1.1+', 'DEA 1.1-', 'DEA 3', 'DEA 4', 'DEA 5', 'DEA 7', 'Dal', 'Desconhecido']
const vacinas = ['V10 / V8 (Polivalente)', 'Antirrábica', 'Gripe']

export default function CadastrarPet() {
  const [tipoSanguineo, setTipoSanguineo] = useState('')
  const [vacinasSelecionadas, setVacinasSelecionadas] = useState<string[]>([])
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  function toggleVacina(vacina: string) {
    setVacinasSelecionadas(prev =>
      prev.includes(vacina) ? prev.filter(v => v !== vacina) : [...prev, vacina]
    )
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setFotoPreview(URL.createObjectURL(file))
  }

  return (
    <div className={styles.pagina}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="PetBlood" className={styles.logoImg} />
          <span className={styles.logoNome}>PetBlood</span>
        </Link>

        <div className={styles.usuario}>
          <div className={styles.usuarioAvatar}>JS</div>
          <div>
            <strong>João Silva</strong>
            <span>Tutor</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/meus-pets" className={`${styles.navItem} ${styles.navAtivo}`}>
            <PawPrint size={18} /> Meus pets
          </Link>
          <Link to="/historico" className={styles.navItem}>
            <History size={18} /> Histórico
          </Link>
          <Link to="/notificacoes" className={styles.navItem}>
            <Bell size={18} /> Notificações
          </Link>
          <Link to="/configuracoes" className={styles.navItem}>
            <Settings size={18} /> Configurações
          </Link>
        </nav>

        <div className={styles.sidebarRodape}>
          <Link to="/suporte" className={styles.navItem}>
            <HelpCircle size={18} /> Suporte
          </Link>
          <Link to="/" className={`${styles.navItem} ${styles.sair}`}>
            <LogOut size={18} /> Sair
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className={styles.main}>
        {/* Cabeçalho da página */}
        <div className={styles.paginaCabecalho}>
          <Link to="/meus-pets" className={styles.btnVoltar}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.titulo}>Cadastrar Novo Pet</h1>
            <p className={styles.subtitulo}>Adicione as informações básicas e clínicas do seu pet para começar.</p>
          </div>
        </div>

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
                  <input type="text" placeholder="Ex: Zé Carlos" />
                </div>
                <div className={styles.campo}>
                  <label>Espécie</label>
                  <div className={styles.selectWrapper}>
                    <select>
                      <option>Cão</option>
                      <option>Gato</option>
                    </select>
                    <ChevronDown size={16} className={styles.selectIcone} />
                  </div>
                </div>
                <div className={styles.campo}>
                  <label>Peso (kg)</label>
                  <input type="number" placeholder="0.0" step="0.1" min={0} />
                </div>
                <div className={`${styles.campo} ${styles.colSpan2}`}>
                  <label>Raça</label>
                  <input type="text" placeholder="Ex: Shih Tzu" />
                </div>
                <div className={styles.campo}>
                  <label>Idade (anos)</label>
                  <input type="number" placeholder="0" min={0} />
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
                      key={tipo}
                      type="button"
                      className={`${styles.tipoBotao} ${tipoSanguineo === tipo ? styles.tipoBotaoAtivo : ''}`}
                      onClick={() => setTipoSanguineo(tipo)}
                    >
                      {tipo}
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
              <button className={styles.btnCadastrar}>Cadastrar Pet</button>
              <button className={styles.btnCancelar}>Cancelar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
