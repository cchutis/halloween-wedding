import { AppBar, Toolbar, Button, Box } from '@mui/material'
import styled from 'styled-components'
import Image from 'next/image'

const StyledAppBar = styled(AppBar)`
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(5px);
`

const StyledToolbar = styled(Toolbar)`
    min-height: 80px !important;
    & > * {
        min-height: 80px;
    }
`

const NavButton = styled(Button)`
    color: #b8860b;
    margin: 0 8px;
    &:hover {
        color: #cd7f32;
    }
`

const LogoContainer = styled.div`
    width: 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
`

const Navigation = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <StyledAppBar position="fixed">
            <StyledToolbar>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <LogoContainer>
                        <Image src="/logo.png" alt="Logo" width={60} height={60} style={{ objectFit: 'contain' }} priority />
                    </LogoContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                </Box>
            </StyledToolbar>
        </StyledAppBar>
    )
}

export default Navigation
