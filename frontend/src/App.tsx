import { Routes, Route } from 'react-router-dom'
import Cabecalho from './componentes/Cabecalho/Cabecalho'
import Rodape from './componentes/Rodape/Rodape'
import Inicio from './paginas/Inicio'

function App() {
  return (
    <>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<Inicio />} />
      </Routes>
      <Rodape />
    </>
  )
}

export default App
