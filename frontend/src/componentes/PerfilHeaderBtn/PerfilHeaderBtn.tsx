import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { getUsuario } from '../../servicos/auth'
import styles from './PerfilHeaderBtn.module.css'

export default function PerfilHeaderBtn() {
  const navigate = useNavigate()
  const usuario = getUsuario()
  const foto = localStorage.getItem('petblood_foto_perfil_clinica')

  return (
    <div className={styles.wrapper}>
      <span className={styles.nome}>{usuario?.nome ?? 'Clínica'}</span>
      <button
        className={styles.btn}
        onClick={() => navigate('/clinica/configuracoes')}
        title="Perfil da clínica"
      >
        {foto
          ? <img src={foto} alt="Perfil" className={styles.foto} />
          : <User size={18} />
        }
      </button>
    </div>
  )
}
