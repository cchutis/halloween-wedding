import { AppBar, Toolbar, Button, Box } from '@mui/material'
import styled from 'styled-components'

const StyledAppBar = styled(AppBar)`
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(5px);
`

const NavButton = styled(Button)`
    color: #b8860b;
    margin: 0 8px;
    &:hover {
        color: #cd7f32;
    }
`

const Navigation = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <StyledAppBar position="fixed">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <NavButton onClick={() => scrollToSection('hero')}>Home</NavButton>
                    <NavButton onClick={() => scrollToSection('about')}>Our Story</NavButton>
                    <NavButton onClick={() => scrollToSection('when-where')}>When & Where</NavButton>
                    <NavButton onClick={() => scrollToSection('hotels')}>Hotels</NavButton>
                    <NavButton onClick={() => scrollToSection('masquerade')}>Masquerade</NavButton>
                    {/* <NavButton onClick={() => scrollToSection('wedding-party')}>Wedding Party</NavButton> */}
                    <NavButton onClick={() => scrollToSection('song-requests')}>Request a Song</NavButton>
                    <NavButton onClick={() => scrollToSection('honeyfund')}>Registry</NavButton>
                    <NavButton onClick={() => scrollToSection('contact')}>Contact Us</NavButton>
                </Box>
            </Toolbar>
        </StyledAppBar>
    )
}

export default Navigation
