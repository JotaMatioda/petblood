import styles from './Notificacoes.module.css'
import logo from '../assets/LogoPetBlood.png'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, History, Bell,
  Settings, HelpCircle, LogOut, AlertTriangle,
  CheckCircle2, Syringe, Info, FileText,
  SlidersHorizontal, ArrowRight
} from 'lucide-react'

type Notificacao = {
  id: number
  tipo: 'urgente' | 'sucesso' | 'lembrete' | 'info' | 'relatorio'
  titulo: string
  descricao: string
  tempo: string
  lida: boolean
  acoes?: { label: string; destaque?: boolean }[]
}

const grupos: { label: string; itens: Notificacao[] }[] = [
  {
    label: 'Hoje',
    itens: [
      {
        id: 1,
        tipo: 'urgente',
        titulo: 'ALERTA URGENTE: Tipo A- Requisitado',
        descricao: 'Veterinário Central está precisando urgentemente de sangue Tipo A-. O seu pet "Bento" é um doador compatível.',
        tempo: '15 min atrás',
        lida: false,
        acoes: [
          { label: 'Agendar', destaque: true },
          { label: 'Ver Detalhes' },
        ],
      },
      {
        id: 2,
        tipo: 'sucesso',
        titulo: 'Doação Confirmada: Mel',
        descricao: 'A doação da Mel realizada ontem foi processada com sucesso. Obrigado por salvar vidas!',
        tempo: '2 horas atrás',
        lida: false,
      },
    ],
  },
  {
    label: 'Ontem',
    itens: [
      {
        id: 3,
        tipo: 'lembrete',
        titulo: 'Lembrete de Vacinação',
        descricao: 'A vacina de reforço do Thor está agendada para a próxima segunda-feira, às 09:00.',
        tempo: 'Ontem, 14:30',
        lida: true,
      },
      {
        id: 4,
        tipo: 'info',
        titulo: 'Novo Centro de Doação',
        descricao: 'Temos uma nova unidade parceira no bairro Jardins. Confira o endereço em "Configurações".',
        tempo: 'Ontem, 10:15',
        lida: true,
      },
    ],
  },
  {
    label: 'Anteriores',
    itens: [
      {
        id: 5,
        tipo: 'relatorio',
        titulo: 'Relatório de Saúde disponível',
        descricao: 'O relatório de sangue de triagem do Bento está disponível para visualização no painel.',
        tempo: '3 dias atrás',
        lida: true,
      },
    ],
  },
]

const icones = {
  urgente: <AlertTriangle size={18} />,
  sucesso: <CheckCircle2 size={18} />,
  lembrete: <Syringe size={18} />,
  info: <Info size={18} />,
  relatorio: <FileText size={18} />,
}

const cores = {
  urgente: styles.iconeUrgente,
  sucesso: styles.iconeSucesso,
  lembrete: styles.iconeLembrete,
  info: styles.iconeInfo,
  relatorio: styles.iconeRelatorio,
}

export default function Notificacoes() {
  const totalNaoLidas = grupos.flatMap(g => g.itens).filter(n => !n.lida).length

  return (
    <div className={styles.pagina}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="PetBlood" className={styles.logoImg} />
          <span className={styles.logoNome}>PetBlood</span>
        </Link>

        <div className={styles.usuario}>
          <div className={styles.usuarioAvatar}>JS</div>
          <div>
            <strong>João Sil...</strong>
            <span>Tutor</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/meus-pets" className={styles.navItem}>
            <PawPrint size={18} /> Meus pets
          </Link>
          <Link to="/historico" className={styles.navItem}>
            <History size={18} /> Histórico
          </Link>
          <Link to="/notificacoes" className={`${styles.navItem} ${styles.navAtivo}`}>
            <Bell size={18} /> Notificações
            {totalNaoLidas > 0 && <span className={styles.badge}>{totalNaoLidas}</span>}
          </Link>
          <Link to="/configuracoes" className={styles.navItem}>
            <Settings size={18} /> Configurações
          </Link>
        </nav>

        <div className={styles.sidebarRodape}>
          <Link to="/suporte" className={styles.navItem}>
            <HelpCircle size={18} /> Suporte
          </Link>
          <Link to="/" className={`${styles.navItem} ${styles.sair}`}>
            <LogOut size={18} /> Sair
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className={styles.main}>
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Notificações</h1>
            <p className={styles.subtitulo}>Mantenha-se atualizado sobre seus pets e necessidades urgentes.</p>
          </div>
          <div className={styles.cabecalhoAcoes}>
            <button className={styles.btnMarcar}>Marcar todas como lidas</button>
            <button className={styles.btnFiltro}><SlidersHorizontal size={18} /></button>
          </div>
        </div>

        <div className={styles.lista}>
          {grupos.map(grupo => (
            <div key={grupo.label}>
              <span className={styles.grupoLabel}>{grupo.label}</span>

              <div className={styles.grupoItens}>
                {grupo.itens.map(n => (
                  <div key={n.id} className={`${styles.item} ${!n.lida ? styles.itemNaoLido : ''}`}>
                    <div className={`${styles.icone} ${cores[n.tipo]}`}>
                      {icones[n.tipo]}
                    </div>

                    <div className={styles.itemConteudo}>
                      <div className={styles.itemTopo}>
                        <strong className={styles.itemTitulo}>{n.titulo}</strong>
                        <div className={styles.itemDireita}>
                          <span className={styles.itemTempo}>{n.tempo}</span>
                          {!n.lida && <span className={styles.ponto} />}
                        </div>
                      </div>
                      <p className={styles.itemDescricao}>{n.descricao}</p>
                      {n.acoes && (
                        <div className={styles.itemAcoes}>
                          {n.acoes.map(a => (
                            <button
                              key={a.label}
                              className={a.destaque ? styles.btnDestaque : styles.btnSecundario}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Card inferior */}
          <div className={styles.cardEmDia}>
            <div className={styles.cardEmDiaIcone}>
              <Bell size={26} color="#C0392B" />
            </div>
            <strong className={styles.cardEmDiaTitulo}>Suas notificações em dia</strong>
            <p className={styles.cardEmDiaTexto}>
              Você está ciente de todos os eventos importantes.<br />
              Deseja silenciar notificações temporariamente?
            </p>
            <Link to="/configuracoes" className={styles.cardEmDiaLink}>
              Ajustar preferências de alerta <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
