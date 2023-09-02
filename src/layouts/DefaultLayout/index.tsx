import { Outlet } from 'react-router-dom'
import { LayoutContainer } from './styles'
import { Header } from '../../components/header'
export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
      {/* outlet vai renderizar o componente filho. */}
    </LayoutContainer>
  )
}
