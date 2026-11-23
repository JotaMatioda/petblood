import styles from './Dashboard.module.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  PawPrint, Bell,
  Plus, Heart, CheckCircle2, ChevronRight, Sparkles, Loader2,
  AlertTriangle, AlertCircle
} from 'lucide-react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { getUsuario } from '../../../servicos/auth.ts'
import { listarPets, type Pet } from '../../../servicos/pets.ts'
import { carregarAlertas, type Alerta } from '../../../servicos/alertas.ts'
import { carregarDoadores } from '../../../servicos/doadores.ts'

const tipoSanguineoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  DAL: 'Dal', DESCONHECIDO: 'Desc.',
  TIPO_A: 'Tipo A', TIPO_B: 'Tipo B', TIPO_AB: 'Tipo AB',
}

function tempoRelativo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `${min} min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)} dias atrás`
}

export default function Dashboard() {
  const usuario = getUsuario()
  const primeiroNome = usuario?.nome?.split(' ')[0] ?? 'Usuário'

  if (usuario?.perfil === 'CLINICA') return <Navigate to="/clinica/inventario" replace />

  const [pets, setPets] = useState<Pet[]>([])
  const [carregando, setCarregando] = useState(true)
  const [alertasMatch, setAlertasMatch] = useState<(Alerta & { petNome: string })[]>([])

  useEffect(() => {
    listarPets()
      .then(lista => {
        setPets(lista)
        // Calcula alertas que batem com pets doadores deste tutor
        const doadores = carregarDoadores()
        const alertas = carregarAlertas()
        const matches: (Alerta & { petNome: string })[] = []
        for (const alerta of alertas) {
          for (const d of doadores) {
            if (d.especie === alerta.especie && d.tipoSanguineo === alerta.tipoSanguineo) {
              if (!matches.find(m => m.id === alerta.id && m.petNome === d.nome)) {
                matches.push({ ...alerta, petNome: d.nome })
              }
            }
          }
        }
        setAlertasMatch(matches)
      })
      .catch(() => setPets([]))
      .finally(() => setCarregando(false))
  }, [])

  const totalPets = pets.length
  const totalDisponiveis = pets.filter(p => p.status === 'DISPONIVEL').length
  const totalDoadores = carregarDoadores().length

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
              <span className={styles.statLabel}>Doadores</span>
              <strong className={styles.statValor}>{carregando ? '—' : totalDoadores}</strong>
              <span className={styles.statDesc}>Pets aptos a doar</span>
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
              <strong className={styles.statValor}>{carregando ? '—' : alertasMatch.length}</strong>
              <span className={styles.statDesc}>Compatíveis agora</span>
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

          {/* Alertas compatíveis */}
          <section className={styles.secao}>
            <div className={styles.secaoCabecalho}>
              <h2 className={styles.secaoTitulo}>Alertas de Emergência</h2>
              <Link to="/notificacoes" className={styles.verTodos}>
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>

            {alertasMatch.length === 0 ? (
              <div className={styles.vazio}>
                <div className={`${styles.vazioIcone} ${styles.vazioIconeAzul}`}>
                  <Bell size={28} color="#2563EB" />
                </div>
                <strong className={styles.vazioTitulo}>Nenhum alerta no momento</strong>
                <p className={styles.vazioTexto}>Quando uma clínica precisar de um doador compatível com seus pets, aparecerá aqui.</p>
              </div>
            ) : (
              <div className={styles.alertasLista}>
                {alertasMatch.slice(0, 3).map(a => (
                  <div key={`${a.id}_${a.petNome}`} className={`${styles.alertaItem} ${a.urgencia === 'CRITICO' ? styles.alertaUrgente : styles.alertaNormal}`}>
                    <div className={styles.alertaIcone}>
                      {a.urgencia === 'CRITICO' ? <AlertTriangle size={16} /> : <AlertCircle size={16} />}
                    </div>
                    <div className={styles.alertaConteudo}>
                      <strong>{a.clinicaNome}</strong> precisa de {tipoSanguineoLabel[a.tipoSanguineo] ?? a.tipoSanguineo} — seu pet <strong>{a.petNome}</strong> é compatível!
                      <span className={styles.alertaTempo}>{tempoRelativo(a.criadoEm)}</span>
                    </div>
                    <Link to="/notificacoes" className={styles.alertaBtn}>Ver</Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
