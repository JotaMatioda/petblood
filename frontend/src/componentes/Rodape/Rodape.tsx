import styles from './Rodape.module.css'

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className={styles.container}>
        <div className={styles.esquerda}>
          <span className={styles.logo}>🐾 PetBlood</span>
          <span>© 2026 PetBlood</span>
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
