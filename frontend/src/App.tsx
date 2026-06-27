import { Routes, Route, Navigate } from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho/Cabecalho'
import Rodape from './componentes/Rodape/Rodape'
import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'
import CadastrarPet from './paginas/CadastrarPet'
import Dashboard from './paginas/Dashboard'
import Configuracoes from './paginas/Configuracoes'
import Notificacoes from './paginas/Notificacoes'
import Historico from './paginas/Historico'
import MeusPets from './paginas/MeusPets'

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Cabecalho /><Inicio /><Rodape /></>} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/cadastrar-pet" element={<CadastrarPet />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/meus-pets" element={<MeusPets />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/notificacoes" element={<Notificacoes />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
  )
}

export default App
