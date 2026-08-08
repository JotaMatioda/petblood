import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, History, Bell,
  Settings, HelpCircle, LogOut
} from 'lucide-react'
import { logout, getUsuario } from '../../servicos/auth'
import logo from '../../assets/LogoPetBlood.png'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const usuario = getUsuario()

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  const perfilLabel: Record<string, string> = { TUTOR: 'Tutor', VETERINARIO: 'Veterinário', CLINICA: 'Clínica' }

  function handleLogout() {
    logout()
    navigate('/entrar')
  }

  function navClass(path: string) {
    return `${styles.navItem} ${pathname === path ? styles.navAtivo : ''}`
  }

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.logoLink}>
        <img src={logo} alt="PetBlood" className={styles.logoImg} />
        <span className={styles.logoNome}>PetBlood</span>
      </Link>

      <div className={styles.usuario}>
        <div className={styles.usuarioAvatar}>{iniciais}</div>
        <div>
          <strong>{usuario?.nome ?? 'Usuário'}</strong>
          <span>{perfilLabel[usuario?.perfil ?? ''] ?? ''}</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link to="/dashboard" className={navClass('/dashboard')}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {usuario?.perfil === 'TUTOR' && (
          <>
            <Link to="/meus-pets" className={navClass('/meus-pets')}>
              <PawPrint size={18} /> Meus pets
            </Link>
            <Link to="/historico" className={navClass('/historico')}>
              <History size={18} /> Histórico
            </Link>
          </>
        )}

        <Link to="/notificacoes" className={navClass('/notificacoes')}>
          <Bell size={18} /> Notificações
        </Link>
        <Link to="/configuracoes" className={navClass('/configuracoes')}>
          <Settings size={18} /> Configurações
        </Link>
      </nav>

      <div className={styles.sidebarRodape}>
        <Link to="/suporte" className={styles.navItem}>
          <HelpCircle size={18} /> Suporte
        </Link>
        <button onClick={handleLogout} className={`${styles.navItem} ${styles.sair}`}>
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  )
}
