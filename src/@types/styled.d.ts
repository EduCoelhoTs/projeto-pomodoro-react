// arquivo de definição de tipos:
// o arquivo .d.ts apenas pode receber codigo typescript(type, interface)
import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme
// o tipo ThemeType vai ser o formato atribuido ao defaultTheme => primary: string; secondary: string;

declare module 'styled-components' {
  // nesse ponto, estamos sobrescrevendo o DefaulTheme.
  export interface DefaultTheme extends ThemeType {}
}
