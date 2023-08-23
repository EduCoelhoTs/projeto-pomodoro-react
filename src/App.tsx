import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'
import { Router } from './Router'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      {/* É necessário adicionar o BrowserRouter para que funcione o roteamento no navegador */}
      <BrowserRouter>
        <Router />
        {/* adicionando global style na aplicação */}
        <GlobalStyle />
      </BrowserRouter>
    </ThemeProvider>
  )
}
