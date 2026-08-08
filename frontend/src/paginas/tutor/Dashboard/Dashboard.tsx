import styles from './Dashboard.module.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  PawPrint, Bell,
  Plus, Heart, CheckCircle2, ChevronRight, Sparkles, Loader2
} from 'lucide-react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { getUsuario } from '../../../servicos/auth.ts'
import { listarPets, type Pet } from '../../../servicos/pets.ts'

const tipoSanguineoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  DAL: 'Dal', DESCONHECIDO: 'Desc.',
  TIPO_A: 'Tipo A', TIPO_B: 'Tipo B', TIPO_AB: 'Tipo AB',
}

export default function Dashboard() {
  const usuario = getUsuario()
  const primeiroNome = usuario?.nome?.split(' ')[0] ?? 'Usuário'

  if (usuario?.perfil === 'CLINICA') return <Navigate to="/clinica/inventario" replace />

  const [pets, setPets] = useState<Pet[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarPets()
      .then(setPets)
      .catch(() => setPets([]))
      .finally(() => setCarregando(false))
  }, [])

  const totalPets = pets.length
  const totalDisponiveis = pets.filter(p => p.status === 'DISPONIVEL').length

  return (
    <div className={styles.pagina}>

      <Sidebar />

      <main className={styles.main}>

        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Olá, {primeiroNome} <Sparkles size={28} color="#C0392B" /></h1>
            <p className={styles.subtitulo}>Bem-vindo de volta ao painel do doador.</p>
          </div>
          <Link to="/cadastrar-pet" className={styles.btnNovoPet}>
            <Plus size={18} /> Novo pet
          </Link>
        </div>

        {/* Cards de estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcone} ${styles.statIconeRoxo}`}>
              <PawPrint size={20} color="#7C3AED" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total</span>
              <strong className={styles.statValor}>{carregando ? '—' : totalPets}</strong>
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
              <strong className={styles.statValor}>{carregando ? '—' : totalDisponiveis}</strong>
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
              <Link to="/meus-pets" className={styles.verTodos}>
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>

            {carregando ? (
              <div className={styles.vazio}>
                <Loader2 size={28} color="#C0392B" className={styles.spinner} />
                <p className={styles.vazioTexto}>Carregando...</p>
              </div>
            ) : pets.length === 0 ? (
              <div className={styles.vazio}>
                <div className={styles.vazioIcone}>
                  <PawPrint size={32} color="#C0392B" />
                </div>
                <strong className={styles.vazioTitulo}>Nenhum pet cadastrado ainda</strong>
                <p className={styles.vazioTexto}>Cadastre seu primeiro pet para que ele possa ser um doador e salvar vidas.</p>
                <Link to="/cadastrar-pet" className={styles.btnNovoPetVazio}>
                  <Plus size={16} /> Cadastrar meu primeiro pet
                </Link>
              </div>
            ) : (
              <div className={styles.petsGrid}>
                {pets.slice(0, 4).map(pet => {
                  const foto = localStorage.getItem(`petblood_pet_foto_${pet.id}`)
                  return (
                    <div key={pet.id} className={styles.petCard}>
                      <div className={styles.petFoto} style={{ background: pet.especie === 'CAO' ? '#D4A574' : '#7C9CBF' }}>
                        {foto
                          ? <img src={foto} alt={pet.nome} className={styles.petFotoImg} />
                          : <PawPrint size={40} color="rgba(255,255,255,0.4)" />
                        }
                      </div>
                      <div className={styles.petInfo}>
                        <div className={styles.petHeader}>
                          <div>
                            <h3 className={styles.petNome}>{pet.nome}</h3>
                            <p className={styles.petRaca}>
                              {pet.especie === 'CAO' ? 'Cão' : 'Gato'}
                              {pet.raca ? ` • ${pet.raca}` : ''}
                            </p>
                          </div>
                          {pet.tipoSanguineo && (
                            <span className={styles.petTipo}>
                              {tipoSanguineoLabel[pet.tipoSanguineo] ?? pet.tipoSanguineo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Atividade Recente */}
          <section className={styles.secao}>
            <div className={styles.secaoCabecalho}>
              <h2 className={styles.secaoTitulo}>Atividade Recente</h2>
            </div>

            <div className={styles.vazio}>
              <div className={`${styles.vazioIcone} ${styles.vazioIconeAzul}`}>
                <Bell size={28} color="#2563EB" />
              </div>
              <strong className={styles.vazioTitulo}>Nenhuma atividade ainda</strong>
              <p className={styles.vazioTexto}>Quando houver alertas de doação ou atualizações, eles aparecerão aqui.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
