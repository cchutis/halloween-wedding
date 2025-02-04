import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#B8860B', // Dark golden color
        },
        secondary: {
            main: '#CD7F32', // Bronze color
        },
        background: {
            default: '#1A1A1A', // Dark grey-black
            paper: '#242424',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '5rem',
            textShadow: '2px 2px 3px rgba(184, 134, 11, 0.3)', // Subtle gold shadow
        },
        h2: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '4rem',
            textShadow: '1px 1px 2px rgba(205, 127, 50, 0.3)', // Subtle bronze shadow
        },
        h3: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '3.5rem',
        },
        h4: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '3rem',
        },
        h5: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '2.5rem',
        },
        h6: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '2rem',
        },
    },
})
