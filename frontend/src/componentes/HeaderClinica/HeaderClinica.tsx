import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { getUsuario } from '../../servicos/auth'
import styles from './HeaderClinica.module.css'

export default function HeaderClinica() {
  const navigate = useNavigate()
  const usuario = getUsuario()
  const nomeClinica = usuario?.nome ?? 'Clínica'

  return (
    <header className={styles.header}>
      <div className={styles.spacer} />
      <div className={styles.acoes}>
        <span className={styles.nomeClinica}>{nomeClinica}</span>
        <button className={styles.btnPerfil} onClick={() => navigate('/clinica/configuracoes')} title="Perfil da clínica">
          <User size={18} />
        </button>
      </div>
    </header>
  )
}
