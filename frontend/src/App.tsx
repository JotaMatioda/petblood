import { Routes, Route, Navigate } from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho/Cabecalho'
import Rodape from './componentes/Rodape/Rodape'
import RotaProtegida from './componentes/RotaProtegida'
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
      <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/meus-pets" element={<RotaProtegida><MeusPets /></RotaProtegida>} />
      <Route path="/cadastrar-pet" element={<RotaProtegida><CadastrarPet /></RotaProtegida>} />
      <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
      <Route path="/notificacoes" element={<RotaProtegida><Notificacoes /></RotaProtegida>} />
      <Route path="/configuracoes" element={<RotaProtegida><Configuracoes /></RotaProtegida>} />
      <Route path="/clinica/inventario" element={<RotaProtegida><Inventario /></RotaProtegida>} />
      <Route path="/clinica/solicitacoes" element={<RotaProtegida><Solicitacoes /></RotaProtegida>} />
      <Route path="/clinica/nova-solicitacao" element={<RotaProtegida><NovaSolicitacao /></RotaProtegida>} />
      <Route path="/clinica/solicitacoes/:id" element={<RotaProtegida><DetalhesSolicitacao /></RotaProtegida>} />
      <Route path="/clinica/solicitacoes/:id/editar" element={<RotaProtegida><EditarSolicitacao /></RotaProtegida>} />
      <Route path="/clinica/configuracoes" element={<RotaProtegida><ConfiguracoesClinica /></RotaProtegida>} />
      <Route path="/clinica/busca" element={<RotaProtegida><BuscaEmergencia /></RotaProtegida>} />
      <Route path="/clinica/nova-bolsa" element={<RotaProtegida><NovaEntradaBolsa /></RotaProtegida>} />
      <Route path="/clinica/bolsas/:id" element={<RotaProtegida><DetalhesBolsa /></RotaProtegida>} />
      <Route path="/clinica/bolsas/:id/editar" element={<RotaProtegida><EditarBolsa /></RotaProtegida>} />
      <Route path="/pets/:id" element={<RotaProtegida><PerfilPet /></RotaProtegida>} />
      <Route path="/pets/:id/editar" element={<RotaProtegida><EditarPet /></RotaProtegida>} />
      <Route path="/pets/:id/historico" element={<RotaProtegida><HistoricoPet /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
