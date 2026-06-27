import styles from './MeusPets.module.css'
import logo from '../assets/LogoPetBlood.png'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, History, Bell,
  Settings, HelpCircle, LogOut, Plus,
  Pencil, CalendarClock, ChevronRight,
  Droplets, Heart, Calendar, Eye
} from 'lucide-react'

const pets = [
  {
    id: 1,
    nome: 'Bento',
    especie: 'Cão',
    raca: 'Golden Retriever',
    tipo: 'DEA 1.1+',
    status: 'disponivel',
    statusLabel: 'Disponível',
    ultima: '12 Jan 2024',
    peso: '32 kg',
    cor: '#D4A574',
  },
  {
    id: 2,
    nome: 'Luna',
    especie: 'Gato',
    raca: 'SRD',
    tipo: 'TIPO A',
    status: 'descanso',
    statusLabel: 'Em Descanso',
    ultima: '05 Mar 2024',
    peso: '4.5 kg',
    cor: '#4A4A4A',
  },
  {
    id: 3,
    nome: 'Thor',
    especie: 'Cão',
    raca: 'Pitbull',
    tipo: 'DEA 1.1-',
    status: 'prioritario',
    statusLabel: 'Prioritário',
    ultima: 'Nenhuma',
    peso: '28 kg',
    cor: '#8B6F47',
  },
]

const compromissos = [
  { mes: 'ABR', dia: '18', titulo: 'Doação Agendada – Bento', sub: 'Clínica PetLife • 14:30' },
  { mes: 'MAI', dia: '02', titulo: 'Retorno de Luna à disponibilidade', sub: 'Automático do sistema' },
]

export default function MeusPets() {
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
          <Link to="/dashboard" className={styles.navItem}><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/meus-pets" className={`${styles.navItem} ${styles.navAtivo}`}><PawPrint size={18} /> Meus pets</Link>
          <Link to="/historico" className={styles.navItem}><History size={18} /> Histórico</Link>
          <Link to="/notificacoes" className={styles.navItem}><Bell size={18} /> Notificações</Link>
          <Link to="/configuracoes" className={styles.navItem}><Settings size={18} /> Configurações</Link>
        </nav>

        <div className={styles.sidebarRodape}>
          <Link to="/suporte" className={styles.navItem}><HelpCircle size={18} /> Suporte</Link>
          <Link to="/" className={`${styles.navItem} ${styles.sair}`}><LogOut size={18} /> Sair</Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className={styles.main}>

        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Meus Pets</h1>
            <p className={styles.subtitulo}>Gerencie seus heróis doadores e acompanhe suas vidas.</p>
          </div>
          <Link to="/cadastrar-pet" className={styles.btnNovo}>
            <Plus size={18} /> Cadastrar Novo Pet
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.vermelho}`}><PawPrint size={20} color="#C0392B" /></div>
            <div>
              <span className={styles.statLabel}>TOTAL DE PETS</span>
              <strong className={styles.statValor}>03</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.verde}`}><Heart size={20} color="#16A34A" /></div>
            <div>
              <span className={styles.statLabel}>DOAÇÕES TOTAIS</span>
              <strong className={styles.statValor}>12</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.laranja}`}><Droplets size={20} color="#EA580C" /></div>
            <div>
              <span className={styles.statLabel}>TIPO O-</span>
              <strong className={styles.statValor}>01</strong>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.azul}`}><Calendar size={20} color="#2563EB" /></div>
            <div>
              <span className={styles.statLabel}>AGENDADOS</span>
              <strong className={styles.statValor}>01</strong>
            </div>
          </div>
        </div>

        {/* Grid de pets */}
        <div className={styles.petsGrid}>
          {pets.map(pet => (
            <div key={pet.id} className={styles.petCard}>
              {/* Status badge */}
              <div className={styles.petTopo}>
                <span className={`${styles.statusBadge} ${
                  pet.status === 'disponivel' ? styles.statusDisponivel :
                  pet.status === 'descanso'   ? styles.statusDescanso :
                  styles.statusPrioritario
                }`}>
                  <span className={styles.statusPonto} />
                  {pet.statusLabel}
                </span>
              </div>

              {/* Foto + tipo sanguíneo */}
              <div className={styles.petFotoWrapper}>
                <div className={styles.petFoto} style={{ background: pet.cor }}>
                  <PawPrint size={36} color="rgba(255,255,255,0.5)" />
                </div>
                <span className={styles.tipoBadge}>{pet.tipo}</span>
              </div>

              {/* Info */}
              <h3 className={styles.petNome}>{pet.nome}</h3>
              <p className={styles.petRaca}>{pet.especie} • {pet.raca}</p>

              {/* Detalhes */}
              <div className={styles.petDetalhes}>
                <div className={styles.petDetalheItem}>
                  <span className={styles.petDetalheLabel}>ÚLTIMA</span>
                  <span className={styles.petDetalheValor}>{pet.ultima}</span>
                </div>
                <div className={styles.petDetalheItem}>
                  <span className={styles.petDetalheLabel}>PESO</span>
                  <span className={styles.petDetalheValor}>{pet.peso}</span>
                </div>
              </div>

              {/* Botão principal */}
              {pet.status === 'prioritario' ? (
                <button className={styles.btnAgendar}>
                  <CalendarClock size={16} /> Agendar Doação
                </button>
              ) : (
                <button className={styles.btnVerPerfil}>
                  <Eye size={16} /> Ver Perfil
                </button>
              )}

              {/* Botões secundários */}
              <div className={styles.petAcoes}>
                <button className={styles.btnSecundario}><Pencil size={14} /> Editar</button>
                <button className={styles.btnSecundario}><History size={14} /> Histórico</button>
              </div>
            </div>
          ))}
        </div>

        {/* Próximos Compromissos */}
        <div className={styles.cardCompromissos}>
          <div className={styles.compromissosCabecalho}>
            <div className={styles.compromissosTitle}>
              <CalendarClock size={20} color="#C0392B" />
              <h2>Próximos Compromissos</h2>
            </div>
            <a href="#" className={styles.verCalendario}>Ver Calendário <ChevronRight size={14} /></a>
          </div>

          <div className={styles.compromissosList}>
            {compromissos.map((c, i) => (
              <div key={i} className={styles.compromissoItem}>
                <div className={styles.compromissoData}>
                  <span className={styles.compromissoMes}>{c.mes}</span>
                  <span className={styles.compromissoDia}>{c.dia}</span>
                </div>
                <div className={styles.compromissoInfo}>
                  <strong>{c.titulo}</strong>
                  <span>{c.sub}</span>
                </div>
                <ChevronRight size={18} color="#ccc" />
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
