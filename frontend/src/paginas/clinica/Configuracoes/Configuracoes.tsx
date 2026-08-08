import { useState, useRef } from 'react'
import styles from './Configuracoes.module.css'
import SidebarClinica from '../../../componentes/SidebarClinica/SidebarClinica.tsx'
import { getUsuario } from '../../../servicos/auth.ts'
import {
  User, Lock, Bell, Shield, Save, Eye, EyeOff,
  Building2, Mail, MapPin, CheckCircle2, Camera
} from 'lucide-react'

type Aba = 'perfil' | 'seguranca' | 'notificacoes'

export default function Configuracoes() {
  const usuario = getUsuario()
  const [aba, setAba] = useState<Aba>('perfil')
  const [salvo, setSalvo] = useState(false)

  // Perfil
  const [foto, setFoto] = useState<string | null>(
    localStorage.getItem('petblood_foto_perfil_clinica')
  )
  const inputFotoRef = useRef<HTMLInputElement>(null)

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const base64 = ev.target?.result as string
      localStorage.setItem('petblood_foto_perfil_clinica', base64)
      setFoto(base64)
    }
    reader.readAsDataURL(file)
  }

  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [email] = useState(usuario?.email ?? '')
  const [telefone, setTelefone] = useState(localStorage.getItem('petblood_clinica_telefone') ?? '')
  const [crmv, setCrmv] = useState(localStorage.getItem('petblood_clinica_crmv') ?? '')
  const [cep, setCep]           = useState(localStorage.getItem('petblood_clinica_cep') ?? '')
  const [estado, setEstado]     = useState(localStorage.getItem('petblood_clinica_estado') ?? '')
  const [cidade, setCidade]     = useState(localStorage.getItem('petblood_clinica_cidade') ?? '')
  const [bairro, setBairro]     = useState(localStorage.getItem('petblood_clinica_bairro') ?? '')
  const [rua, setRua]           = useState(localStorage.getItem('petblood_clinica_rua') ?? '')
  const [numero, setNumero]     = useState(localStorage.getItem('petblood_clinica_numero') ?? '')
  const [complemento, setComplemento] = useState(localStorage.getItem('petblood_clinica_complemento') ?? '')

  // Segurança
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // Notificações
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSolicitacoes, setNotifSolicitacoes] = useState(true)
  const [notifEstoque, setNotifEstoque] = useState(true)
  const [notifVencimento, setNotifVencimento] = useState(false)

  function salvar() {
    localStorage.setItem('petblood_clinica_telefone', telefone)
    localStorage.setItem('petblood_clinica_crmv', crmv)
    localStorage.setItem('petblood_clinica_cep', cep)
    localStorage.setItem('petblood_clinica_estado', estado)
    localStorage.setItem('petblood_clinica_cidade', cidade)
    localStorage.setItem('petblood_clinica_bairro', bairro)
    localStorage.setItem('petblood_clinica_rua', rua)
    localStorage.setItem('petblood_clinica_numero', numero)
    localStorage.setItem('petblood_clinica_complemento', complemento)
    // Monta endereço completo para geocodificação
    const enderecoCompleto = [rua, numero, bairro, cidade, estado, cep].filter(Boolean).join(', ')
    localStorage.setItem('petblood_clinica_endereco', enderecoCompleto)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  return (
    <div className={styles.pagina}>
      <SidebarClinica />

      <div className={styles.conteudoWrapper}>
        <main className={styles.main}>
          <div className={styles.tituloBarra}>
            <div>
              <h1 className={styles.titulo}>Configurações</h1>
              <p className={styles.subtitulo}>Gerencie as informações e preferências da sua clínica.</p>
            </div>
          </div>

          {salvo && (
            <div className={styles.alertaSalvo}>
              <CheckCircle2 size={18} /> Alterações salvas com sucesso!
            </div>
          )}

          <div className={styles.layout}>
            {/* Abas laterais */}
            <aside className={styles.abas}>
              <button className={`${styles.aba} ${aba === 'perfil' ? styles.abaAtiva : ''}`} onClick={() => setAba('perfil')}>
                <User size={17} /> Perfil da Clínica
              </button>
              <button className={`${styles.aba} ${aba === 'seguranca' ? styles.abaAtiva : ''}`} onClick={() => setAba('seguranca')}>
                <Lock size={17} /> Segurança
              </button>
              <button className={`${styles.aba} ${aba === 'notificacoes' ? styles.abaAtiva : ''}`} onClick={() => setAba('notificacoes')}>
                <Bell size={17} /> Notificações
              </button>
            </aside>

            {/* Conteúdo */}
            <div className={styles.conteudo}>

              {/* ── PERFIL ── */}
              {aba === 'perfil' && (
                <div className={styles.card}>
                  <div className={styles.cardTopo}>
                    <div className={styles.avatarWrapper}>
                      {foto
                        ? <img src={foto} alt="Foto" className={styles.avatarGrandeFoto} />
                        : <div className={styles.avatarGrande}>{nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'CL'}</div>
                      }
                      <button className={styles.avatarEditar} onClick={() => inputFotoRef.current?.click()} title="Trocar foto">
                        <Camera size={13} />
                      </button>
                      <input ref={inputFotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
                    </div>
                    <div>
                      <strong className={styles.avatarNome}>{nome || 'Clínica'}</strong>
                      <span className={styles.avatarPerfil}><Shield size={13} /> Perfil Clínica / Banco de Sangue</span>
                      <span className={styles.fotoHint}>Clique na câmera para trocar a foto</span>
                    </div>
                  </div>

                  <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}><Building2 size={16} /> Informações da Unidade</h3>
                    <div className={styles.grade2}>
                      <div className={styles.campo}>
                        <label>Nome da Clínica / Hospital</label>
                        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Hospital Vet São Paulo" />
                      </div>
                      <div className={styles.campo}>
                        <label>CRMV</label>
                        <input value={crmv} onChange={e => setCrmv(e.target.value)} placeholder="Ex: 12345" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}><Mail size={16} /> Contato</h3>
                    <div className={styles.grade2}>
                      <div className={styles.campo}>
                        <label>E-mail</label>
                        <input value={email} disabled className={styles.inputDesabilitado} />
                        <span className={styles.campoHint}>O e-mail não pode ser alterado.</span>
                      </div>
                      <div className={styles.campo}>
                        <label>Telefone</label>
                        <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Ex: (11) 99999-9999" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}><MapPin size={16} /> Localização</h3>
                    <div className={styles.grade2}>
                      <div className={styles.campo}>
                        <label>CEP</label>
                        <input value={cep} onChange={e => setCep(e.target.value)} placeholder="00000-000" />
                      </div>
                      <div className={styles.campo}>
                        <label>Estado</label>
                        <input value={estado} onChange={e => setEstado(e.target.value)} placeholder="Ex: São Paulo" />
                      </div>
                    </div>
                    <div className={styles.campo}>
                      <label>Cidade</label>
                      <input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo" />
                    </div>
                    <div className={styles.campo}>
                      <label>Bairro</label>
                      <input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Ex: Vila Madalena" />
                    </div>
                    <div className={styles.campo}>
                      <label>Rua</label>
                      <input value={rua} onChange={e => setRua(e.target.value)} placeholder="Ex: Av. Paulista" />
                    </div>
                    <div className={styles.grade2}>
                      <div className={styles.campo}>
                        <label>Número</label>
                        <input value={numero} onChange={e => setNumero(e.target.value)} placeholder="Ex: 1000" />
                      </div>
                      <div className={styles.campo}>
                        <label>Complemento</label>
                        <input value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Ex: Sala 42" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.rodape}>
                    <button className={styles.btnSalvar} onClick={salvar}>
                      <Save size={16} /> Salvar Alterações
                    </button>
                  </div>
                </div>
              )}

              {/* ── SEGURANÇA ── */}
              {aba === 'seguranca' && (
                <div className={styles.card}>
                  <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}><Lock size={16} /> Alterar Senha</h3>
                    <p className={styles.secaoDesc}>Escolha uma senha forte com pelo menos 6 caracteres.</p>

                    <div className={styles.campoSenha}>
                      <div className={styles.campo}>
                        <label>Senha Atual</label>
                        <div className={styles.senhaWrapper}>
                          <input
                            type={mostrarSenha ? 'text' : 'password'}
                            value={senhaAtual}
                            onChange={e => setSenhaAtual(e.target.value)}
                            placeholder="••••••••"
                          />
                          <button className={styles.olhoBtn} onClick={() => setMostrarSenha(v => !v)} type="button">
                            {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className={styles.campo}>
                        <label>Nova Senha</label>
                        <div className={styles.senhaWrapper}>
                          <input
                            type={mostrarSenha ? 'text' : 'password'}
                            value={novaSenha}
                            onChange={e => setNovaSenha(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className={styles.campo}>
                        <label>Confirmar Nova Senha</label>
                        <div className={styles.senhaWrapper}>
                          <input
                            type={mostrarSenha ? 'text' : 'password'}
                            value={confirmarSenha}
                            onChange={e => setConfirmarSenha(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                        {novaSenha && confirmarSenha && novaSenha !== confirmarSenha && (
                          <span className={styles.campoErro}>As senhas não coincidem.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.rodape}>
                    <button
                      className={styles.btnSalvar}
                      onClick={salvar}
                      disabled={!!novaSenha && novaSenha !== confirmarSenha}
                    >
                      <Save size={16} /> Alterar Senha
                    </button>
                  </div>
                </div>
              )}

              {/* ── NOTIFICAÇÕES ── */}
              {aba === 'notificacoes' && (
                <div className={styles.card}>
                  <div className={styles.secao}>
                    <h3 className={styles.secaoTitulo}><Bell size={16} /> Preferências de Notificação</h3>
                    <p className={styles.secaoDesc}>Escolha quais alertas deseja receber.</p>

                    <div className={styles.toggleLista}>
                      {[
                        { label: 'Notificações por e-mail',       desc: 'Receba um resumo diário por e-mail',                         val: notifEmail,       set: setNotifEmail       },
                        { label: 'Novas solicitações de sangue',   desc: 'Alerta imediato ao receber novas solicitações',              val: notifSolicitacoes, set: setNotifSolicitacoes },
                        { label: 'Alerta de estoque crítico',      desc: 'Aviso quando um tipo sanguíneo estiver em nível crítico',    val: notifEstoque,     set: setNotifEstoque     },
                        { label: 'Bolsas próximas ao vencimento',  desc: 'Aviso 7 dias antes do vencimento de uma bolsa',             val: notifVencimento,  set: setNotifVencimento  },
                      ].map(({ label, desc, val, set }) => (
                        <div
                          key={label}
                          className={`${styles.toggleItem} ${val ? styles.toggleItemAtivo : ''}`}
                          onClick={() => set(v => !v)}
                        >
                          <div>
                            <strong>{label}</strong>
                            <span>{desc}</span>
                          </div>
                          <button
                            className={`${styles.toggle} ${val ? styles.toggleAtivo : ''}`}
                            onClick={e => { e.stopPropagation(); set(v => !v) }}
                            type="button"
                          >
                            <span className={styles.toggleThumb} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.rodape}>
                    <button className={styles.btnSalvar} onClick={salvar}>
                      <Save size={16} /> Salvar Preferências
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
