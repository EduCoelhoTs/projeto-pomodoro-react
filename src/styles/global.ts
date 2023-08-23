// criando um arquivo de estilo com styled components de forma global para a aplicação:
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background: #333;
        color: #fff;
    }
`