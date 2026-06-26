import styles from './Inicio.module.css'
import cachorro from '../assets/cachorro.png'
import tablet from '../assets/tablet.png'
import { LayoutGrid, Search, MessageCircle, CheckCircle2 } from 'lucide-react'

const passos = [
  {
    icone: <LayoutGrid size={22} color="#C0392B" />,
    numero: '1.',
    titulo: 'Tutor cadastra o pet',
    descricao: 'Insira as informações básicas, tipo sanguíneo e histórico de saúde do seu pet. O cadastro é rápido e seguro.',
    tag: 'Disponível para cães e gatos',
    cor: '#FFF0F0',
  },
  {
    icone: <Search size={22} color="#2563EB" />,
    numero: '2.',
    titulo: 'Veterinário busca doador',
    descricao: 'Em casos de emergência, veterinários logados buscam por doadores compatíveis na mesma região geográfica.',
    tag: 'Filtro por localização e peso',
    cor: '#EFF6FF',
  },
  {
    icone: <MessageCircle size={22} color="#16A34A" />,
    numero: '3.',
    titulo: 'Alerta via WhatsApp',
    descricao: 'O sistema dispara alertas instantâneos para os tutores selecionados. A conexão é direta e imediata.',
    tag: 'Notificação 24/7 em tempo real',
    cor: '#F0FFF4',
  },
]

export default function Inicio() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroConteudo}>
            <span className={styles.badge}> Rede de solidariedade pet ativa</span>
            <h1 className={styles.heroTitulo}>
              Transfusão de<br />
              emergência para quem<br />
              <span className={styles.destaque}>não fala</span>, mas precisa.
            </h1>
            <p className={styles.heroSubtitulo}>
              Conectamos tutores de doadores e veterinários em segundos. Uma plataforma
              gratuita para garantir que nenhum animal espere tempo demais por uma doação
              de sangue.
            </p>
            <div className={styles.heroBotoes}>
              <a href="/cadastro" className={styles.btnPrimario}>Cadastrar meu pet 🐾</a>
              <a href="/veterinario" className={styles.btnSecundario}>Sou veterinário ↗</a>
            </div>
          </div>
          <div className={styles.heroImagem}>
            <img src={cachorro} alt="Golden retriever na clínica" className={styles.cachorroImg} />
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className={styles.comoFunciona}>
        <div className={styles.secaoContainer}>
          <div className={styles.secaoCabecalho}>
            <h2 className={styles.secaoTitulo}>Como funciona o PetBlood</h2>
            <p className={styles.secaoSubtitulo}>
              Três passos simples para transformar um pet em um herói e salvar uma vida em perigo.
            </p>
          </div>
          <div className={styles.cards}>
            {passos.map((passo) => (
              <div key={passo.numero} className={styles.card}>
                <div className={styles.cardIcone} style={{ background: passo.cor }}>
                  <span>{passo.icone}</span>
                </div>
                <h3 className={styles.cardTitulo}>
                  <span>{passo.numero}</span> {passo.titulo}
                </h3>
                <p className={styles.cardDescricao}>{passo.descricao}</p>
                <span className={styles.cardTag}>{passo.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança e Ética */}
      <section className={styles.seguranca}>
        <div className={styles.segurancaContainer}>
          <div className={styles.segurancaConteudo}>
            <h2 className={styles.secaoTitulo}>Segurança e Ética Médica</h2>
            <p className={styles.segurancaDescricao}>
              Seguimos protocolos veterinários rigorosos. Somente profissionais cadastrados
              podem acessar dados de contato para garantir a privacidade e o uso responsável
              da rede.
            </p>
            <ul className={styles.segurancaLista}>
              <li><CheckCircle2 size={18} color="#16A34A" /> Dados protegidos por LGPD</li>
              <li><CheckCircle2 size={18} color="#16A34A" /> Validação de CRMV obrigatória para clínicas</li>
              <li><CheckCircle2 size={18} color="#16A34A" /> Comunidade colaborativa e humanitária</li>
            </ul>
          </div>
          <div>
            <img src={tablet} alt="Interface veterinária no tablet" className={styles.tabletImg} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSecao}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitulo}>Prepare-se para salvar uma vida hoje.</h2>
          <p className={styles.ctaDescricao}>
            Seu pet pode ser o doador que alguém busca desesperadamente agora.
            O cadastro é 100% gratuito e o impacto é eterno.
          </p>
          <div className={styles.ctaBotoes}>
            <a href="/cadastro" className={styles.ctaBtnPrimario}>Cadastrar agora</a>
            <a href="/sobre" className={styles.ctaBtnSecundario}>Saiba mais sobre doação</a>
          </div>
        </div>
      </section>
    </>
  )
}
