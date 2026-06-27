import { Routes, Route } from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho/Cabecalho'
import Rodape from './componentes/Rodape/Rodape'
import Inicio from './paginas/Inicio'
import Login from './paginas/Login'
import Cadastro from './paginas/Cadastro'
import CadastrarPet from "./paginas/CadastrarPet.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Cabecalho /><Inicio /><Rodape /></>} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/cadastrar-pet" element={<CadastrarPet />} />
    </Routes>
  )
}

export default App
