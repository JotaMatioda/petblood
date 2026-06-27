import styles from './Login.module.css'
import logo from '../assets/LogoPetBlood.png'
import { User, BriefcaseMedical, Building2, Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'

const perfis = [
  {
    icone: <User size={20} color="#C0392B" />,
    titulo: 'Tutor',
    descricao: 'Dono de pet herói. Gerencie o histórico de doações, agende coletas e receba alertas de urgência.',
  },
  {
    icone: <BriefcaseMedical size={20} color="#C0392B" />,
    titulo: 'Veterinário',
    descricao: 'Profissional autônomo. Solicite bolsas de sangue, verifique compatibilidade e acompanhe seus pacientes.',
  },
  {
    icone: <Building2 size={20} color="#C0392B" />,
    titulo: 'Clínica / Hospital',
    descricao: 'Gerencie estoque de sangue. Cadastre novos doadores e gerencie campanhas de coleta institucionais.',
  },
]

export default function Login() {
  const [perfilSelecionado, setPerfilSelecionado] = useState(0)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <div className={styles.card}>
        {/* Formulário */}
        <div className={styles.formularioWrapper}>
          <a href="/" className={styles.logoLink}>
            <img src={logo} alt="PetBlood" className={styles.logoImagem} />
            <span>PetBlood</span>
          </a>
          <h2 className={styles.bemVindo}>Bem-vindo de volta</h2>
          <p className={styles.subtitulo}>Acesse sua conta para gerenciar doações e salvar vidas.</p>

          <button className={styles.btnGoogle}>
            <img src="https://www.google.com/favicon.ico" alt="Google" width={18} />
            Continuar com Google
          </button>

          <div className={styles.divisor}>
            <span>ou utilize seu e-mail</span>
          </div>

          <form className={styles.formulario} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.campo}>
              <label>E-mail corporativo ou pessoal</label>
              <input type="email" placeholder="nome@exemplo.com" />
            </div>

            <div className={styles.campo}>
              <div className={styles.senhaLabel}>
                <label>Senha</label>
                <a href="/esqueceu-senha" className={styles.linkEsqueceu}>Esqueceu a senha?</a>
              </div>
              <div className={styles.senhaWrapper}>
                <input type={mostrarSenha ? 'text' : 'password'} placeholder="••••••••" />
                <button type="button" className={styles.btnVerSenha} onClick={() => setMostrarSenha(!mostrarSenha)}>
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className={styles.lembrar}>
              <input type="checkbox" />
              Lembrar de mim por 30 dias
            </label>

            <button type="submit" className={styles.btnEntrar}>Entrar na Plataforma</button>
          </form>

          <p className={styles.semConta}>
            Não tem uma conta?{' '}
            <a href="/cadastro" className={styles.linkCadastro}>Cadastre seu pet ou clínica</a>
          </p>
        </div>

        {/* Painel de perfis */}
        <div className={styles.painelPerfis}>
          <h3 className={styles.painelTitulo}>Escolha seu perfil</h3>

          <div className={styles.perfis}>
            {perfis.map((perfil, i) => (
              <div
                key={perfil.titulo}
                className={`${styles.perfilCard} ${perfilSelecionado === i ? styles.perfilAtivo : ''}`}
                onClick={() => setPerfilSelecionado(i)}
              >
                <div className={styles.perfilIcone}>{perfil.icone}</div>
                <div className={styles.perfilTexto}>
                  <strong>{perfil.titulo}</strong>
                  <span>{perfil.descricao}</span>
                </div>
                {perfilSelecionado === i && (
                  <div className={styles.perfilCheck}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className={styles.rodape}>
        <span className={styles.rodapeSeguranca}><Lock size={14} /> Sua conexão é segura e seus dados estão protegidos pela LGPD</span>
        <div className={styles.rodapeLinks}>
          <a href="#">Termos de uso</a>
          <a href="#">Privacidade</a>
          <a href="#">Suporte</a>
        </div>
      </footer>
    </div>
  )
}
