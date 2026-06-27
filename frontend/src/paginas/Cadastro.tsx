import styles from './Cadastro.module.css'
import logo from '../assets/LogoPetBlood.png'
import { PawPrint, BriefcaseMedical, LayoutGrid, ArrowRight, Info } from 'lucide-react'
import { useState } from 'react'

const perfis = [
  {
    icone: <PawPrint size={18} color="#C0392B" />,
    titulo: 'Tutor',
    descricao: 'Quero cadastrar meus pets e encontrar doadores.',
  },
  {
    icone: <BriefcaseMedical size={18} color="#6B7280" />,
    titulo: 'Veterinário',
    descricao: 'Quero solicitar bolsas e gerenciar emergências.',
  },
  {
    icone: <LayoutGrid size={18} color="#6B7280" />,
    titulo: 'Clínica / Banco',
    descricao: 'Quero gerenciar estoque e processar doações.',
  },
]

export default function Cadastro() {
  const [perfilSelecionado, setPerfilSelecionado] = useState(0)

  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <div className={styles.card}>

          {/* Formulário */}
          <div className={styles.formularioWrapper}>
            <a href="/" className={styles.logoLink}>
              <img src={logo} alt="PetBlood" className={styles.logoImg} />
              <span>PetBlood</span>
            </a>
            <h1 className={styles.titulo}>Criar sua conta</h1>
            <p className={styles.subtitulo}>Crie sua conta para gerenciar doações e salvar vidas.</p>

            <form className={styles.formulario} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.campo}>
                <label>{perfilSelecionado === 2 ? 'Nome da Clínica/Banco' : 'Nome Completo'}</label>
                <input type="text" placeholder={perfilSelecionado === 2 ? 'Ex: Clínica VetCare' : 'Ex: Maria Silva'} />
              </div>

              <div className={styles.campo}>
                <label>{perfilSelecionado === 2 ? 'CNPJ' : 'CPF'}</label>
                <input
                  type="text"
                  placeholder={perfilSelecionado === 2 ? '00.000.000/0001-00' : '000.000.000-00'}
                  maxLength={perfilSelecionado === 2 ? 18 : 14}
                />
              </div>

              <div className={styles.campo}>
                <label>E-mail</label>
                <input type="email" placeholder="maria@exemplo.com" />
              </div>

              <div className={styles.camposDuplos}>
                <div className={styles.campo}>
                  <label>Senha</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className={styles.campo}>
                  <label>Confirmar Senha</label>
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" className={styles.btnCriar}>
                Criar Conta <ArrowRight size={16} />
              </button>
            </form>

            <p className={styles.jaTemConta}>
              Já tem uma conta? <a href="/entrar" className={styles.linkEntrar}>Entre aqui</a>
            </p>
          </div>

          {/* Painel de perfis */}
          <div className={styles.painelPerfis}>
            <h3 className={styles.painelTitulo}>Quem é você?</h3>
            <p className={styles.painelSubtitulo}>Selecione o tipo de perfil para personalizar sua experiência.</p>

            <div className={styles.perfis}>
              {perfis.map((perfil, i) => (
                <div
                  key={perfil.titulo}
                  className={`${styles.perfilCard} ${perfilSelecionado === i ? styles.perfilAtivo : ''}`}
                  onClick={() => setPerfilSelecionado(i)}
                >
                  <div className={`${styles.perfilIcone} ${perfilSelecionado === i ? styles.perfilIconeAtivo : ''}`}>
                    {perfil.icone}
                  </div>
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

            <div className={styles.aviso}>
              <Info size={16} color="#C0392B" className={styles.avisoIcone} />
              <p>
                Ao se cadastrar, você concorda com nossos{' '}
                <a href="/termos" className={styles.linkAviso}>Termos de Uso</a>{' '}
                e{' '}
                <a href="/privacidade" className={styles.linkAviso}>Política de Privacidade</a>.
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className={styles.rodape}>
        <span>© 2024 PetBlood. Todos os direitos reservados.</span>
        <div className={styles.rodapeLinks}>
          <a href="#">Privacidade</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Contato</a>
        </div>
      </footer>
    </div>
  )
}
