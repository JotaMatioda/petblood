import styles from './Historico.module.css'
import { useEffect, useState } from 'react'
import {
  Heart, Droplets, PawPrint, Loader2, Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { listarPets, type Pet } from '../../../servicos/pets.ts'
import { carregarDoadores } from '../../../servicos/doadores.ts'
import { carregarAlertas, type Alerta } from '../../../servicos/alertas.ts'

const tipoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  DAL: 'Dal', DESCONHECIDO: 'Desconhecido',
  TIPO_A: 'Tipo A', TIPO_B: 'Tipo B', TIPO_AB: 'Tipo AB',
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Historico() {
  const [pets, setPets] = useState<Pet[]>([])
  const [carregando, setCarregando] = useState(true)
  const [alertasMatch, setAlertasMatch] = useState<(Alerta & { petNome: string })[]>([])

  useEffect(() => {
    listarPets()
      .then(lista => {
        setPets(lista)
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

  const doadores = carregarDoadores()
  const totalDoadores = doadores.length

  return (
    <div className={styles.pagina}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Histórico & Atividades</h1>
            <p className={styles.subtitulo}>Acompanhe a jornada de saúde e doações dos seus pets.</p>
          </div>
        </div>

        {carregando ? (
          <div className={styles.vazioCenter}>
            <Loader2 size={32} color="#C0392B" className={styles.spinner} />
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className={styles.blocoTopo}>
              <div className={styles.cardStats}>
                <span className={styles.statsLabel}>RESUMO DOS PETS</span>
                <div className={styles.statsNumeros}>
                  <div className={styles.statsNumerosEsquerda}>
                    <div className={styles.statItem}>
                      <strong>{pets.length}</strong>
                      <span>Pets cadastrados</span>
                    </div>
                    <div className={styles.statItem}>
                      <strong>{totalDoadores}</strong>
                      <span>Aptos a doar</span>
                    </div>
                    <div className={styles.statItem}>
                      <strong>{alertasMatch.length}</strong>
                      <span>Alertas compatíveis</span>
                    </div>
                  </div>
                  <div className={styles.statsCoracao}>
                    <Heart size={64} color="#FADBD8" fill="#FADBD8" />
                  </div>
                </div>
              </div>

              {totalDoadores > 0 ? (
                <div className={styles.cardProximaDoacao}>
                  <div className={styles.proximaDoacaoBadge}>
                    <Droplets size={14} /> Pets Doadores
                  </div>
                  <div className={styles.proximaDoacaoIcone}>
                    <Droplets size={28} color="#fff" />
                  </div>
                  <h3 className={styles.proximaDoacaoTitulo}>{totalDoadores} pet{totalDoadores > 1 ? 's' : ''} apto{totalDoadores > 1 ? 's' : ''}!</h3>
                  <p className={styles.proximaDoacaoTexto}>
                    Seus pets estão cadastrados como doadores e podem ser encontrados em emergências.
                  </p>
                  <Link to="/meus-pets" className={styles.btnAgendar}>Ver meus pets</Link>
                </div>
              ) : (
                <div className={styles.cardProximaDoacao}>
                  <div className={styles.proximaDoacaoBadge}>
                    <Heart size={14} /> Seja um doador
                  </div>
                  <div className={styles.proximaDoacaoIcone}>
                    <Heart size={28} color="#fff" />
                  </div>
                  <h3 className={styles.proximaDoacaoTitulo}>Nenhum doador ainda</h3>
                  <p className={styles.proximaDoacaoTexto}>
                    Cadastre um pet e marque-o como disponível para doação para ajudar clínicas em emergências.
                  </p>
                  <Link to="/cadastrar-pet" className={styles.btnAgendar}>Cadastrar pet</Link>
                </div>
              )}
            </div>

            {/* Pets cadastrados */}
            {pets.length > 0 && (
              <div className={styles.cardTabela}>
                <div className={styles.tabelaCabecalho}>
                  <h2 className={styles.tabelaTitulo}>Meus Pets</h2>
                  <span className={styles.tabelaInfo}>{pets.length} pet{pets.length > 1 ? 's' : ''} cadastrado{pets.length > 1 ? 's' : ''}</span>
                </div>

                <div className={styles.tabelaHeader}>
                  <span>PET</span>
                  <span>ESPÉCIE / RAÇA</span>
                  <span>TIPO SANGUÍNEO</span>
                  <span>DOADOR</span>
                  <span></span>
                </div>

                {pets.map(pet => {
                  const doador = doadores.find(d => String(d.petId) === String(pet.id))
                  const foto = localStorage.getItem(`petblood_pet_foto_${pet.id}`)
                  return (
                    <div key={pet.id} className={styles.tabelaLinha}>
                      <div className={styles.petCell}>
                        <div className={styles.petAvatar} style={{ background: pet.especie === 'CAO' ? '#D4A574' : '#7C9CBF' }}>
                          {foto
                            ? <img src={foto} alt={pet.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            : <PawPrint size={14} color="rgba(255,255,255,0.8)" />
                          }
                        </div>
                        {pet.nome}
                      </div>
                      <div>
                        {pet.especie === 'CAO' ? 'Cão' : 'Gato'}
                        {pet.raca ? ` • ${pet.raca}` : ''}
                      </div>
                      <div>
                        {pet.tipoSanguineo
                          ? <span className={styles.tipoBadge}>{tipoLabel[pet.tipoSanguineo] ?? pet.tipoSanguineo}</span>
                          : <span className={styles.semInfo}>—</span>
                        }
                      </div>
                      <div>
                        {doador
                          ? <span className={`${styles.status} ${styles.statusConcluido}`}>Ativo</span>
                          : <span className={`${styles.status} ${styles.statusAgendado}`}>Não cadastrado</span>
                        }
                      </div>
                      <div>
                        <Link to={`/pets/${pet.id}`} className={styles.btnAcoes}>Ver</Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Alertas recebidos */}
            {alertasMatch.length > 0 && (
              <div className={styles.cardTabela}>
                <div className={styles.tabelaCabecalho}>
                  <h2 className={styles.tabelaTitulo}>Alertas Compatíveis</h2>
                  <span className={styles.tabelaInfo}>{alertasMatch.length} alerta{alertasMatch.length > 1 ? 's' : ''}</span>
                </div>

                <div className={styles.tabelaHeader}>
                  <span>DATA</span>
                  <span>CLÍNICA</span>
                  <span>SEU PET</span>
                  <span>TIPO SANGUÍNEO</span>
                  <span>URGÊNCIA</span>
                </div>

                {alertasMatch.map((a, i) => (
                  <div key={i} className={styles.tabelaLinha}>
                    <div>
                      <span className={styles.data}>{formatarData(a.criadoEm)}</span>
                    </div>
                    <div>{a.clinicaNome}</div>
                    <div className={styles.petCell}>
                      <div className={styles.petAvatar}>{a.petNome[0]}</div>
                      {a.petNome}
                    </div>
                    <div>
                      <span className={styles.tipoBadge}>{tipoLabel[a.tipoSanguineo] ?? a.tipoSanguineo}</span>
                    </div>
                    <div>
                      <span className={`${styles.status} ${a.urgencia === 'CRITICO' ? styles.statusUrgente : styles.statusAgendado}`}>
                        {a.urgencia === 'CRITICO' ? 'Crítico' : 'Normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado vazio geral */}
            {pets.length === 0 && (
              <div className={styles.vazioCenter}>
                <PawPrint size={48} color="#C0392B" strokeWidth={1.5} />
                <strong>Nenhum pet cadastrado</strong>
                <p>Cadastre seu primeiro pet para acompanhar o histórico de doações.</p>
                <Link to="/cadastrar-pet" className={styles.btnCadastrar}>
                  <Plus size={15} /> Cadastrar pet
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
