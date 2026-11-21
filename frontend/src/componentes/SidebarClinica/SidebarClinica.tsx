import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutGrid, Heart, ClipboardList, Settings, LogOut, SearchCheck } from 'lucide-react'
import { logout } from '../../servicos/auth'
import logo from '../../assets/LogoPetBlood.png'
import styles from './SidebarClinica.module.css'

export default function SidebarClinica() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  function handleLogout() {
    logout()
    navigate('/entrar')
  }

  function navClass(path: string) {
    return `${styles.navItem} ${pathname === path ? styles.navAtivo : ''}`
  }

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.logoArea}>
        <img src={logo} alt="PetBlood" className={styles.logoImg} />
        <span className={styles.logoNome}>PetBlood</span>
      </Link>

      <nav className={styles.nav}>
        <Link to="/clinica/busca" className={navClass('/clinica/busca')}>
          <SearchCheck size={18} /> Busca de Emergência
        </Link>
        <Link to="/clinica/inventario" className={navClass('/clinica/inventario')}>
          <LayoutGrid size={18} /> Inventário
        </Link>
        <Link to="/clinica/doacoes" className={navClass('/clinica/doacoes')}>
          <Heart size={18} /> Doações
        </Link>
        <Link to="/clinica/solicitacoes" className={navClass('/clinica/solicitacoes')}>
          <ClipboardList size={18} /> Solicitações
        </Link>
        <Link to="/clinica/configuracoes" className={navClass('/clinica/configuracoes')}>
          <Settings size={18} /> Configurações
        </Link>
      </nav>

      <button onClick={handleLogout} className={styles.btnSair}>
        <LogOut size={16} /> Sair
      </button>

      <Link to="/clinica/agendar" className={styles.btnAgendar}>
        <span className={styles.btnAgendarIcone}>+</span>
        Agendar Doação
      </Link>
    </aside>
  )
}
