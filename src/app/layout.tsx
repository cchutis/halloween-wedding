'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '../styles/theme'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Estonia&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #1A1A1A;
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Estonia', cursive;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: none;
    font-smooth: never;
    font-variant-ligatures: none;
    font-kerning: none;
    text-transform: none;
    font-size-adjust: 0.5;
    letter-spacing: 0.02em;
  }
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Constantine & Lauren&apos;s Halloween Wedding</title>
                <meta name="description" content="Join us for our Halloween Masquerade Wedding Celebration" />
            </head>
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <GlobalStyle />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
