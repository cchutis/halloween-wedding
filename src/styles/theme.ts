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
            fontSize: '6rem',
        },
        h2: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '3.75rem',
        },
        h3: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '3rem',
        },
        h4: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '2.125rem',
        },
        h5: {
            fontFamily: 'Estonia',
            fontWeight: 400,
            fontSize: '2rem',
        },
        body1: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '1.1rem',
        },
        body2: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 400,
            fontSize: '1.1rem',
        },
    },
})
