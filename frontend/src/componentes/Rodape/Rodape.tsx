import styles from './Rodape.module.css'
import logo from '../../assets/LogoPetBlood.png'

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className={styles.container}>
        <div className={styles.esquerda}>
          <div className={styles.marca}>
            <img src={logo} alt="PetBlood" className={styles.logoImagem} />
            <span className={styles.logoTexto}>PetBlood</span>
          </div>
          <span className={styles.copyright}>© 2026 PetBlood</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>100% gratuito</span>
          <span className={styles.tag}>Cães e gatos</span>
          <span className={styles.tag}>PT-BR</span>
        </div>
      </div>
    </footer>
  )
}
