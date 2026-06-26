import styles from './Cabecalho.module.css'
import logo from '../../assets/LogoPetBlood.png'

export default function Cabecalho() {
  return (
    <header className={styles.cabecalho}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <img src={logo} alt="PetBlood" className={styles.logoImagem} />
          <span>PetBlood</span>
        </a>
        <nav className={styles.nav}>
          <a href="/" className={styles.linkAtivo}>Landing</a>
          <a href="/tutor">Tutor</a>
          <a href="/veterinario">Vet</a>
          <a href="/clinica">Clinic</a>
        </nav>
        <div className={styles.acoes}>
          <a href="/entrar" className={styles.btnEntrar}>Entrar</a>
          <a href="/cadastro" className={styles.btnCadastrar}>Cadastrar</a>
        </div>
      </div>
    </header>
  )
}
