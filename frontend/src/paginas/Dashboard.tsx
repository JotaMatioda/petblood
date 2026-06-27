import styles from './Dashboard.module.css'
import logo from '../assets/LogoPetBlood.png'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, History, Bell,
  Settings, HelpCircle, LogOut, Plus,
  Heart, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react'

const pets: never[] = []
const atividades: never[] = []

export default function Dashboard() {
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
            <strong>João Sil...</strong>
            <span>Tutor</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link to="/dashboard" className={`${styles.navItem} ${styles.navAtivo}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/meus-pets" className={styles.navItem}>
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

        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Olá, João <Sparkles size={28} color="#C0392B" /></h1>
            <p className={styles.subtitulo}>Bem-vindo de volta ao painel do doador.</p>
          </div>
          <a href="/cadastrar-pet" className={styles.btnNovoPet}>
            <Plus size={18} /> Novo pet
          </a>
        </div>

        {/* Cards de estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.statIconeRoxo}`}>
              <PawPrint size={20} color="#7C3AED" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total</span>
              <strong className={styles.statValor}>0</strong>
              <span className={styles.statDesc}>Pets cadastrados</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.statIconeAzul}`}>
              <Heart size={20} color="#2563EB" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Geral</span>
              <strong className={styles.statValor}>0</strong>
              <span className={styles.statDesc}>Doações realizadas</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.statIconeVerde}`}>
              <CheckCircle2 size={20} color="#16A34A" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Disponíveis</span>
              <strong className={styles.statValor}>0</strong>
              <span className={styles.statDesc}>Disponíveis agora</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.statIconeVermelho}`}>
              <Bell size={20} color="#C0392B" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Alertas</span>
              <strong className={styles.statValor}>0</strong>
              <span className={styles.statDesc}>Alertas recebidos</span>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className={styles.grid}>

          {/* Meus Pets */}
          <section className={styles.secao}>
            <div className={styles.secaoCabecalho}>
              <h2 className={styles.secaoTitulo}>Meus Pets</h2>
              <a href="/meus-pets" className={styles.verTodos}>
                Ver todos <ChevronRight size={14} />
              </a>
            </div>

            {pets.length === 0 ? (
              <div className={styles.vazio}>
                <div className={styles.vazioIcone}>
                  <PawPrint size={32} color="#C0392B" />
                </div>
                <strong className={styles.vazioTitulo}>Nenhum pet cadastrado ainda</strong>
                <p className={styles.vazioTexto}>Cadastre seu primeiro pet para que ele possa ser um doador e salvar vidas.</p>
                <a href="/cadastrar-pet" className={styles.btnNovoPetVazio}>
                  <Plus size={16} /> Cadastrar meu primeiro pet
                </a>
              </div>
            ) : (
              <div className={styles.petsGrid}>
                {pets.map((pet: any) => (
                  <div key={pet.id} className={styles.petCard}>
                    <div className={styles.petFoto} style={{ background: pet.cor }}>
                      <PawPrint size={40} color="rgba(255,255,255,0.4)" />
                    </div>
                    <div className={styles.petInfo}>
                      <div className={styles.petHeader}>
                        <div>
                          <h3 className={styles.petNome}>{pet.nome}</h3>
                          <p className={styles.petRaca}>{pet.raca} • {pet.idade} anos</p>
                        </div>
                        <span className={styles.petTipo}>{pet.tipo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Atividade Recente */}
          <section className={styles.secao}>
            <div className={styles.secaoCabecalho}>
              <h2 className={styles.secaoTitulo}>Atividade Recente</h2>
            </div>

            {atividades.length === 0 ? (
              <div className={styles.vazio}>
                <div className={`${styles.vazioIcone} ${styles.vazioIconeAzul}`}>
                  <Bell size={28} color="#2563EB" />
                </div>
                <strong className={styles.vazioTitulo}>Nenhuma atividade ainda</strong>
                <p className={styles.vazioTexto}>Quando houver alertas de doação ou atualizações, eles aparecerão aqui.</p>
              </div>
            ) : (
              <div className={styles.atividadeLista}>
                {atividades.map((a: any) => (
                  <div key={a.id} className={styles.atividadeItem}>
                    <p>{a.descricao}</p>
                  </div>
                ))}
                <a href="/historico" className={styles.verHistorico}>
                  Ver todo o histórico de alertas
                </a>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
