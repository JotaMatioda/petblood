import styles from './Configuracoes.module.css'
import { useState, useRef } from 'react'
import {
  User, MapPin, SlidersHorizontal, Lock, Camera, CheckCircle
} from 'lucide-react'
import Sidebar from '../../../componentes/Sidebar/Sidebar.tsx'
import { getUsuario } from '../../../servicos/auth.ts'

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

      <Sidebar />

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
  const usuario = getUsuario()
  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'US'

  const [foto, setFoto] = useState<string | null>(localStorage.getItem('petblood_foto_perfil'))
  const [telefone, setTelefone] = useState(localStorage.getItem('petblood_tutor_telefone') ?? '')
  const [profissao, setProfissao] = useState(localStorage.getItem('petblood_tutor_profissao') ?? 'Tutor de Pets')
  const [salvo, setSalvo] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const base64 = ev.target?.result as string
      localStorage.setItem('petblood_foto_perfil', base64)
      setFoto(base64)
    }
    reader.readAsDataURL(file)
  }

  function salvar() {
    localStorage.setItem('petblood_tutor_telefone', telefone)
    localStorage.setItem('petblood_tutor_profissao', profissao)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalho}>
        <div className={styles.avatarWrapper}>
          {foto
            ? <img src={foto} alt="Foto de perfil" className={styles.avatarGrandeFoto} />
            : <div className={styles.avatarGrande}>{iniciais}</div>
          }
          <button className={styles.avatarEditar} onClick={() => inputRef.current?.click()} title="Trocar foto">
            <Camera size={14} />
          </button>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
        </div>
        <div>
          <h2 className={styles.painelTitulo}>Informações Pessoais</h2>
          <p className={styles.painelSubtitulo}>Atualize seus dados de contato básicos.</p>
          <span className={styles.fotoHint}>Clique na câmera para trocar a foto</span>
        </div>
      </div>

      <div className={styles.gridDuplo}>
        <div className={styles.campo}>
          <label>Nome Completo</label>
          <input type="text" defaultValue={usuario?.nome ?? ''} disabled className={styles.inputDesabilitado} />
        </div>
        <div className={styles.campo}>
          <label>E-mail</label>
          <input type="email" defaultValue={usuario?.email ?? ''} disabled className={styles.inputDesabilitado} />
        </div>
        <div className={styles.campo}>
          <label>Telefone</label>
          <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="+55 (11) 99999-9999" />
        </div>
        <div className={styles.campo}>
          <label>Profissão</label>
          <input type="text" value={profissao} onChange={e => setProfissao(e.target.value)} />
        </div>
      </div>

      <div className={styles.rodapePainel}>
        {salvo && <span className={styles.msgSalvo}><CheckCircle size={15} /> Salvo com sucesso!</span>}
        <button className={styles.btnSalvar} onClick={salvar}>Salvar Alterações</button>
      </div>
    </div>
  )
}

function PainelEndereco() {
  const [cep, setCep]           = useState(localStorage.getItem('petblood_tutor_cep') ?? '')
  const [estado, setEstado]     = useState(localStorage.getItem('petblood_tutor_estado') ?? '')
  const [cidade, setCidade]     = useState(localStorage.getItem('petblood_tutor_cidade') ?? '')
  const [bairro, setBairro]     = useState(localStorage.getItem('petblood_tutor_bairro') ?? '')
  const [rua, setRua]           = useState(localStorage.getItem('petblood_tutor_rua') ?? '')
  const [numero, setNumero]     = useState(localStorage.getItem('petblood_tutor_numero') ?? '')
  const [complemento, setComplemento] = useState(localStorage.getItem('petblood_tutor_complemento') ?? '')
  const [salvo, setSalvo] = useState(false)

  function salvar() {
    localStorage.setItem('petblood_tutor_cep', cep)
    localStorage.setItem('petblood_tutor_estado', estado)
    localStorage.setItem('petblood_tutor_cidade', cidade)
    localStorage.setItem('petblood_tutor_bairro', bairro)
    localStorage.setItem('petblood_tutor_rua', rua)
    localStorage.setItem('petblood_tutor_numero', numero)
    localStorage.setItem('petblood_tutor_complemento', complemento)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalhoSimples}>
        <h2 className={styles.painelTitulo}>Endereço</h2>
        <p className={styles.painelSubtitulo}>Seu endereço é usado para encontrar doadores e clínicas próximas.</p>
      </div>

      <div className={styles.gridDuplo}>
        <div className={styles.campo}>
          <label>CEP</label>
          <input type="text" value={cep} onChange={e => setCep(e.target.value)} placeholder="00000-000" />
        </div>
        <div className={styles.campo}>
          <label>Estado</label>
          <input type="text" value={estado} onChange={e => setEstado(e.target.value)} placeholder="Ex: São Paulo" />
        </div>
        <div className={`${styles.campo} ${styles.colSpan2}`}>
          <label>Cidade</label>
          <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo" />
        </div>
        <div className={`${styles.campo} ${styles.colSpan2}`}>
          <label>Bairro</label>
          <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Ex: Vila Madalena" />
        </div>
        <div className={`${styles.campo} ${styles.colSpan2}`}>
          <label>Rua</label>
          <input type="text" value={rua} onChange={e => setRua(e.target.value)} placeholder="Ex: Rua das Flores" />
        </div>
        <div className={styles.campo}>
          <label>Número</label>
          <input type="text" value={numero} onChange={e => setNumero(e.target.value)} placeholder="Ex: 123" />
        </div>
        <div className={styles.campo}>
          <label>Complemento</label>
          <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Ex: Apto 42" />
        </div>
      </div>

      <div className={styles.rodapePainel}>
        {salvo && <span className={styles.msgSalvo}><CheckCircle size={15} /> Salvo com sucesso!</span>}
        <button className={styles.btnSalvar} onClick={salvar}>Salvar Alterações</button>
      </div>
    </div>
  )
}

function PainelPreferencias() {
  const [alertas, setAlertas] = useState(() => localStorage.getItem('petblood_tutor_alertas') !== 'false')
  const [whatsapp, setWhatsapp] = useState(() => localStorage.getItem('petblood_tutor_whatsapp') !== 'false')
  const [email, setEmail] = useState(() => localStorage.getItem('petblood_tutor_email_notif') === 'true')
  const [raio, setRaio] = useState(localStorage.getItem('petblood_tutor_raio') ?? '10')
  const [salvoP, setSalvoP] = useState(false)

  function salvarPrefs() {
    localStorage.setItem('petblood_tutor_alertas', String(alertas))
    localStorage.setItem('petblood_tutor_whatsapp', String(whatsapp))
    localStorage.setItem('petblood_tutor_email_notif', String(email))
    localStorage.setItem('petblood_tutor_raio', raio)
    setSalvoP(true)
    setTimeout(() => setSalvoP(false), 2500)
  }

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
        {salvoP && <span className={styles.msgSalvo}><CheckCircle size={15} /> Salvo com sucesso!</span>}
        <button className={styles.btnSalvar} onClick={salvarPrefs}>Salvar Preferências</button>
      </div>
    </div>
  )
}

function PainelSeguranca() {
  const [atual, setAtual]       = useState('')
  const [nova, setNova]         = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro]         = useState('')
  const [salvo, setSalvo]       = useState(false)

  function salvar() {
    setErro('')
    if (!atual || !nova || !confirmar) { setErro('Preencha todos os campos.'); return }
    if (nova !== confirmar) { setErro('A nova senha e a confirmação não coincidem.'); return }
    if (nova.length < 6)    { setErro('A nova senha deve ter pelo menos 6 caracteres.'); return }
    setAtual(''); setNova(''); setConfirmar('')
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  return (
    <div className={styles.painelCard}>
      <div className={styles.painelCabecalhoSimples}>
        <h2 className={styles.painelTitulo}>Segurança</h2>
        <p className={styles.painelSubtitulo}>Mantenha sua conta protegida atualizando sua senha regularmente.</p>
      </div>

      <div className={styles.gridSimples}>
        <div className={styles.campo}>
          <label>Senha Atual</label>
          <input type="password" value={atual} onChange={e => setAtual(e.target.value)} placeholder="••••••••" />
        </div>
        <div className={styles.campo}>
          <label>Nova Senha</label>
          <input type="password" value={nova} onChange={e => setNova(e.target.value)} placeholder="••••••••" />
        </div>
        <div className={styles.campo}>
          <label>Confirmar Nova Senha</label>
          <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder="••••••••" />
        </div>
      </div>

      <div className={styles.rodapePainel}>
        {erro  && <span className={styles.msgErro}>{erro}</span>}
        {salvo && <span className={styles.msgSalvo}><CheckCircle size={15} /> Senha atualizada!</span>}
        <button className={styles.btnSalvar} onClick={salvar}>Atualizar Senha</button>
      </div>
    </div>
  )
}
