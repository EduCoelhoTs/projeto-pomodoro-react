import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
export function DefaultLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      {/* outlet vai renderizar o componente filho. */}
    </div>
  )
}
