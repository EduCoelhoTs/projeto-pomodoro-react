import { Routes, Route } from 'react-router-dom'
import { History } from './pages/History'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/Home'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        {/* O react vai renderizar dentro do Default layout, todos os componentes declarados dentro dele */}
        {/* Sao somadas as rotas */}
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
