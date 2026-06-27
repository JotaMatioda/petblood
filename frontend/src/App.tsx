import { Routes, Route, Navigate } from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho/Cabecalho'
import Rodape from './componentes/Rodape/Rodape'
import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'
import CadastrarPet from './paginas/CadastrarPet'
import Dashboard from './paginas/Dashboard'
import Configuracoes from './paginas/Configuracoes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Cabecalho /><Inicio /><Rodape /></>} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/cadastrar-pet" element={<CadastrarPet />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/meus-pets" element={<Navigate to="/dashboard" replace />} />
      <Route path="/historico" element={<Navigate to="/dashboard" replace />} />
      <Route path="/notificacoes" element={<Navigate to="/dashboard" replace />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
  )
}

export default App
