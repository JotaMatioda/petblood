import styles from './Cabecalho.module.css'
import logo from '../../assets/LogoPetBlood.png'
import { Link, useNavigate } from 'react-router-dom'
import { getUsuario, isAutenticado, logout } from '../../servicos/auth'
import { useState, useRef, useEffect } from 'react'
import { LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'

export default function Cabecalho() {
  const autenticado = isAutenticado()
  const usuario = getUsuario()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  function handleLogout() {
    logout()
    setMenuAberto(false)
    navigate('/')
  }

  useEffect(() => {
    function fechar(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener('mousedown', fechar)
    return () => document.removeEventListener('mousedown', fechar)
  }, [])

  return (
    <header className={styles.cabecalho}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="PetBlood" className={styles.logoImagem} />
          <span>PetBlood</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.linkAtivo}>Início</Link>
          <Link to={autenticado ? '/dashboard' : '/entrar'}>Tutor</Link>
          <a href="/veterinario">Veterinário</a>
          <Link to={autenticado ? '/clinica/inventario' : '/entrar?redirect=/clinica/inventario'}>Clínica</Link>
        </nav>

        <div className={styles.acoes}>
          {autenticado ? (
            <div className={styles.perfilWrapper} ref={menuRef}>
              <button
                className={styles.perfilBtn}
                onClick={() => setMenuAberto(v => !v)}
              >
                <div className={styles.avatar}>{iniciais}</div>
                <span className={styles.perfilNome}>{usuario?.nome?.split(' ')[0]}</span>
                <ChevronDown size={16} className={menuAberto ? styles.chevronAberto : ''} />
              </button>

              {menuAberto && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.avatarGrande}>{iniciais}</div>
                    <div>
                      <strong>{usuario?.nome}</strong>
                      <span>{usuario?.email}</span>
                    </div>
                  </div>
                  <div className={styles.dropdownDivisor} />
                  <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setMenuAberto(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button className={`${styles.dropdownItem} ${styles.dropdownSair}`} onClick={handleLogout}>
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/entrar" className={styles.btnEntrar}>Entrar</Link>
              <Link to="/cadastro" className={styles.btnCadastrar}>Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
