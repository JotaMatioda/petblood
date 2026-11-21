import { Routes, Route, Navigate } from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho/Cabecalho'
import Rodape from './componentes/Rodape/Rodape'
import RotaProtegida, { RotaClinica, RotaTutor } from './componentes/RotaProtegida'
import Inicio from './paginas/Inicio/Inicio/Inicio.tsx'
import Login from './paginas/Inicio/Login/Login.tsx'
import Cadastro from './paginas/Inicio/Cadastro/Cadastro.tsx'
import CadastrarPet from './paginas/tutor/CadastrarPet/CadastrarPet.tsx'
import Dashboard from './paginas/tutor/Dashboard/Dashboard.tsx'
import Configuracoes from './paginas/tutor/Configuracoes/Configuracoes.tsx'
import Notificacoes from './paginas/tutor/Notificacoes/Notificacoes.tsx'
import Historico from './paginas/tutor/Historico/Historico.tsx'
import MeusPets from './paginas/tutor/MeusPets/MeusPets.tsx'
import Inventario from './paginas/clinica/Inventario/Inventario.tsx'
import Solicitacoes from './paginas/clinica/Solicitacoes/Solicitacoes.tsx'
import NovaSolicitacao from './paginas/clinica/NovaSolicitacao/NovaSolicitacao.tsx'
import DetalhesSolicitacao from './paginas/clinica/DetalhesSolicitacao/DetalhesSolicitacao.tsx'
import EditarSolicitacao from './paginas/clinica/EditarBolsa/EditarSolicitacao.tsx'
import ConfiguracoesClinica from './paginas/clinica/Configuracoes/Configuracoes.tsx'
import BuscaEmergencia from './paginas/clinica/BuscaEmergencia/BuscaEmergencia.tsx'
import NovaEntradaBolsa from './paginas/clinica/NovaEntradaBolsa/NovaEntradaBolsa.tsx'
import DetalhesBolsa from './paginas/clinica/DetalhesBolsa/DetalhesBolsa.tsx'
import EditarBolsa from './paginas/clinica/EditarBolsa/EditarBolsa.tsx'
import PerfilPet from './paginas/tutor/PerfilPet/PerfilPet.tsx'
import EditarPet from './paginas/tutor/EditarPet/EditarPet.tsx'
import HistoricoPet from './paginas/tutor/HistoricoPet/HistoricoPet.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Cabecalho /><Inicio /><Rodape /></>} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<RotaTutor><Dashboard /></RotaTutor>} />
      <Route path="/meus-pets" element={<RotaTutor><MeusPets /></RotaTutor>} />
      <Route path="/cadastrar-pet" element={<RotaTutor><CadastrarPet /></RotaTutor>} />
      <Route path="/historico" element={<RotaTutor><Historico /></RotaTutor>} />
      <Route path="/notificacoes" element={<RotaTutor><Notificacoes /></RotaTutor>} />
      <Route path="/configuracoes" element={<RotaTutor><Configuracoes /></RotaTutor>} />
      <Route path="/pets/:id" element={<RotaTutor><PerfilPet /></RotaTutor>} />
      <Route path="/pets/:id/editar" element={<RotaTutor><EditarPet /></RotaTutor>} />
      <Route path="/pets/:id/historico" element={<RotaTutor><HistoricoPet /></RotaTutor>} />
      <Route path="/clinica/inventario" element={<RotaClinica><Inventario /></RotaClinica>} />
      <Route path="/clinica/solicitacoes" element={<RotaClinica><Solicitacoes /></RotaClinica>} />
      <Route path="/clinica/nova-solicitacao" element={<RotaClinica><NovaSolicitacao /></RotaClinica>} />
      <Route path="/clinica/solicitacoes/:id" element={<RotaClinica><DetalhesSolicitacao /></RotaClinica>} />
      <Route path="/clinica/solicitacoes/:id/editar" element={<RotaClinica><EditarSolicitacao /></RotaClinica>} />
      <Route path="/clinica/configuracoes" element={<RotaClinica><ConfiguracoesClinica /></RotaClinica>} />
      <Route path="/clinica/busca" element={<RotaClinica><BuscaEmergencia /></RotaClinica>} />
      <Route path="/clinica/nova-bolsa" element={<RotaClinica><NovaEntradaBolsa /></RotaClinica>} />
      <Route path="/clinica/bolsas/:id" element={<RotaClinica><DetalhesBolsa /></RotaClinica>} />
      <Route path="/clinica/bolsas/:id/editar" element={<RotaClinica><EditarBolsa /></RotaClinica>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
