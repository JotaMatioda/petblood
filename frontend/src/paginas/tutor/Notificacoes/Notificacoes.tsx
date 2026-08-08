import styles from './Notificacoes.module.css'
import { Link } from 'react-router-dom'
import { Bell, ArrowRight, AlertTriangle, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { carregarAlertas, type Alerta } from '../../../servicos/alertas.ts'
import { carregarDoadores, distanciaKm } from '../../../servicos/doadores.ts'

type NotifAlerta = Alerta & { petNome: string }

const tipoLabel: Record<string, string> = {
  DEA_1_1_POS: 'DEA 1.1+', DEA_1_1_NEG: 'DEA 1.1-',
  DEA_3: 'DEA 3', DEA_4: 'DEA 4', DEA_5: 'DEA 5', DEA_7: 'DEA 7',
  DAL: 'Dal', DESCONHECIDO: 'Desconhecido',
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

export default function Notificacoes() {
  const [notifs, setNotifs] = useState<NotifAlerta[]>([])

  useEffect(() => {
    const alertas = carregarAlertas()
    const doadores = carregarDoadores()

    const matches: NotifAlerta[] = []

    for (const alerta of alertas) {
      // Filtra doadores compatíveis: mesma espécie e tipo sanguíneo
      const compativeis = doadores.filter(d =>
        d.especie === alerta.especie &&
        d.tipoSanguineo === alerta.tipoSanguineo
      )

      for (const doador of compativeis) {
        // Verifica distância se a clínica tem coordenadas
        if (alerta.clinicaLat !== null && alerta.clinicaLng !== null) {
          const dist = distanciaKm(doador.lat, doador.lng, alerta.clinicaLat, alerta.clinicaLng)
          if (dist > alerta.raioKm) continue
        }

        // Evita duplicata do mesmo alerta+pet
        if (!matches.find(m => m.id === alerta.id && m.petNome === doador.nome)) {
          matches.push({ ...alerta, petNome: doador.nome })
        }
      }
    }

    setNotifs(matches)
  }, [])

  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Notificações</h1>
            <p className={styles.subtitulo}>Mantenha-se atualizado sobre seus pets e necessidades urgentes.</p>
          </div>
        </div>

        <div className={styles.lista}>
          {notifs.length === 0 ? (
            <div className={styles.cardEmDia}>
              <div className={styles.cardEmDiaIcone}>
                <Bell size={26} color="#C0392B" />
              </div>
              <strong className={styles.cardEmDiaTitulo}>Nenhuma notificação</strong>
              <p className={styles.cardEmDiaTexto}>
                Você está em dia! Quando houver alertas de doação<br />
                ou atualizações importantes, eles aparecerão aqui.
              </p>
              <Link to="/configuracoes" className={styles.cardEmDiaLink}>
                Ajustar preferências de alerta <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className={styles.grupoItens}>
              {notifs.map(n => (
                <div key={`${n.id}_${n.petNome}`} className={`${styles.item} ${styles.itemNaoLido}`}>
                  <div className={`${styles.icone} ${n.urgencia === 'CRITICO' ? styles.iconeUrgente : styles.iconeInfo}`}>
                    {n.urgencia === 'CRITICO'
                      ? <AlertTriangle size={18} />
                      : <AlertCircle size={18} />
                    }
                  </div>

                  <div className={styles.itemConteudo}>
                    <div className={styles.itemTopo}>
                      <strong className={styles.itemTitulo}>
                        {n.urgencia === 'CRITICO' ? '🚨 Urgência Crítica' : '📢 Solicitação de Doação'}
                      </strong>
                      <div className={styles.itemDireita}>
                        <span className={styles.itemTempo}>{tempoRelativo(n.criadoEm)}</span>
                        <span className={styles.ponto} />
                      </div>
                    </div>
                    <p className={styles.itemDescricao}>
                      <strong>{n.clinicaNome}</strong> precisa urgentemente de sangue{' '}
                      <strong>{tipoLabel[n.tipoSanguineo] ?? n.tipoSanguineo}</strong> para{' '}
                      {n.especie === 'CAO' ? 'cão' : 'gato'} ({n.nomePaciente}).{' '}
                      Seu pet <strong>{n.petNome}</strong> é um doador compatível e está dentro do raio!
                    </p>
                    <div className={styles.itemAcoes}>
                      <Link to="/meus-pets" className={styles.btnDestaque}>
                        Ver {n.petNome}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
