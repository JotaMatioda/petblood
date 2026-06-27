import styles from './Configuracoes.module.css'
import logo from '../assets/LogoPetBlood.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, PawPrint, History, Bell,
  Settings, HelpCircle, LogOut, User,
  MapPin, SlidersHorizontal, Lock, Camera
} from 'lucide-react'

const abas = [
  { id: 'perfil', label: 'Perfil', icone: <User size={17} /> },
  { id: 'endereco', label: 'Endereço', icone: <MapPin size={17} /> },
  { id: 'preferencias', label: 'Preferências', icone: <SlidersHorizontal size={17} /> },
  { id: 'seguranca', label: 'Segurança', icone: <Lock size={17} /> },
]

export default function Configuracoes() {
  const [abaAtiva, setAbaAtiva] = useState('perfil')

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
          <Link to="/notificacoes" className={styles.navItem}>
            <Bell size={18} /> Notificações
          </Link>
          <Link to="/configuracoes" className={`${styles.navItem} ${styles.navAtivo}`}>
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
          <h1 className={styles.titulo}>Configurações</h1>
          <p className={styles.subtitulo}>Gerencie suas informações de perfil, segurança e preferências de doação.</p>
        </div>

        <div className={styles.conteudo}>
          {/* Menu lateral */}
          <nav className={styles.menuLateral}>
            {abas.map(aba => (
              <button
                key={aba.id}
                className={`${styles.menuItem} ${abaAtiva === aba.id ? styles.menuItemAtivo : ''}`}
                onClick={() => setAbaAtiva(aba.id)}
              >
                {aba.icone} {aba.label}
              </button>
            ))}
          </nav>

          {/* Painel */}
          <div className={styles.painel}>
            {abaAtiva === 'perfil' && <PainelPerfil />}
            {abaAtiva === 'endereco' && <PainelEndereco />}
            {abaAtiva === 'preferencias' && <PainelPreferencias />}
            {abaAtiva === 'seguranca' && <PainelSeguranca />}
          </div>
        </div>
      </main>
    </div>
  )
}

function PainelPerfil() {
  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalho}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarGrande}>JS</div>
          <button className={styles.avatarEditar}><Camera size={14} /></button>
        </div>
        <div>
          <h2 className={styles.painelTitulo}>Informações Pessoais</h2>
          <p className={styles.painelSubtitulo}>Atualize seus dados de contato básicos.</p>
        </div>
      </div>

      <div className={styles.gridDuplo}>
        <div className={styles.campo}>
          <label>Nome Completo</label>
          <input type="text" defaultValue="João Silva" />
        </div>
        <div className={styles.campo}>
          <label>E-mail</label>
          <input type="email" defaultValue="joao@petblood.com" />
        </div>
        <div className={styles.campo}>
          <label>Telefone</label>
          <input type="tel" defaultValue="+55 (11) 98765-4321" />
        </div>
        <div className={styles.campo}>
          <label>Profissão</label>
          <input type="text" defaultValue="Tutor de Pets" />
        </div>
      </div>

      <div className={styles.rodapePainel}>
        <button className={styles.btnSalvar}>Salvar Alterações</button>
      </div>
    </div>
  )
}

function PainelEndereco() {
  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalhoSimples}>
        <h2 className={styles.painelTitulo}>Endereço</h2>
        <p className={styles.painelSubtitulo}>Seu endereço é usado para encontrar doadores e clínicas próximas.</p>
      </div>

      <div className={styles.gridDuplo}>
        <div className={styles.campo}>
          <label>CEP</label>
          <input type="text" placeholder="00000-000" />
        </div>
        <div className={styles.campo}>
          <label>Estado</label>
          <input type="text" placeholder="Ex: São Paulo" />
        </div>
        <div className={`${styles.campo} ${styles.colSpan2}`}>
          <label>Cidade</label>
          <input type="text" placeholder="Ex: São Paulo" />
        </div>
        <div className={`${styles.campo} ${styles.colSpan2}`}>
          <label>Bairro</label>
          <input type="text" placeholder="Ex: Vila Madalena" />
        </div>
        <div className={`${styles.campo} ${styles.colSpan2}`}>
          <label>Rua</label>
          <input type="text" placeholder="Ex: Rua das Flores" />
        </div>
        <div className={styles.campo}>
          <label>Número</label>
          <input type="text" placeholder="Ex: 123" />
        </div>
        <div className={styles.campo}>
          <label>Complemento</label>
          <input type="text" placeholder="Ex: Apto 42" />
        </div>
      </div>

      <div className={styles.rodapePainel}>
        <button className={styles.btnSalvar}>Salvar Alterações</button>
      </div>
    </div>
  )
}

function PainelPreferencias() {
  const [alertas, setAlertas] = useState(true)
  const [whatsapp, setWhatsapp] = useState(true)
  const [email, setEmail] = useState(false)
  const [raio, setRaio] = useState('10')

  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalhoSimples}>
        <h2 className={styles.painelTitulo}>Preferências de Doação</h2>
        <p className={styles.painelSubtitulo}>Controle como e quando você quer ser notificado sobre pedidos de doação.</p>
      </div>

      <div className={styles.preferenciasLista}>
        <div className={styles.preferenciaItem}>
          <div>
            <strong>Receber alertas de doação</strong>
            <p>Ser notificado quando um pet compatível precisar de doação.</p>
          </div>
          <button
            className={`${styles.toggle} ${alertas ? styles.toggleAtivo : ''}`}
            onClick={() => setAlertas(!alertas)}
          >
            <span className={styles.toggleBolinha} />
          </button>
        </div>

        <div className={styles.preferenciaItem}>
          <div>
            <strong>Notificações via WhatsApp</strong>
            <p>Receber alertas diretamente no seu WhatsApp.</p>
          </div>
          <button
            className={`${styles.toggle} ${whatsapp ? styles.toggleAtivo : ''}`}
            onClick={() => setWhatsapp(!whatsapp)}
          >
            <span className={styles.toggleBolinha} />
          </button>
        </div>

        <div className={styles.preferenciaItem}>
          <div>
            <strong>Notificações por e-mail</strong>
            <p>Receber resumo semanal de atividades por e-mail.</p>
          </div>
          <button
            className={`${styles.toggle} ${email ? styles.toggleAtivo : ''}`}
            onClick={() => setEmail(!email)}
          >
            <span className={styles.toggleBolinha} />
          </button>
        </div>

        <div className={styles.preferenciaItem}>
          <div>
            <strong>Raio de busca (km)</strong>
            <p>Distância máxima para receber alertas de doação.</p>
          </div>
          <select
            className={styles.selectRaio}
            value={raio}
            onChange={e => setRaio(e.target.value)}
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>
        </div>
      </div>

      <div className={styles.rodapePainel}>
        <button className={styles.btnSalvar}>Salvar Preferências</button>
      </div>
    </div>
  )
}

function PainelSeguranca() {
  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalhoSimples}>
        <h2 className={styles.painelTitulo}>Segurança</h2>
        <p className={styles.painelSubtitulo}>Mantenha sua conta protegida atualizando sua senha regularmente.</p>
      </div>

      <div className={styles.gridSimples}>
        <div className={styles.campo}>
          <label>Senha Atual</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className={styles.campo}>
          <label>Nova Senha</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className={styles.campo}>
          <label>Confirmar Nova Senha</label>
          <input type="password" placeholder="••••••••" />
        </div>
      </div>

      <div className={styles.rodapePainel}>
        <button className={styles.btnSalvar}>Atualizar Senha</button>
      </div>
    </div>
  )
}
