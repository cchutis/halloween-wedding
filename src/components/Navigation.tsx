import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import styled from 'styled-components'
import Image from 'next/image'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'

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

    @media (max-width: 1024px) {
        display: none !important;
    }
`

const MobileMenuButton = styled(IconButton)`
    color: #b8860b;
    display: none !important;

    @media (max-width: 1024px) {
        display: flex !important;
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

const StyledDrawer = styled(Drawer)`
    .MuiDrawer-paper {
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(5px);
        width: 240px;
    }
`

const DrawerListItem = styled(ListItemButton)`
    color: #b8860b !important;

    &:hover {
        color: #cd7f32 !important;
        background-color: rgba(205, 127, 50, 0.1) !important;
    }
`

const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToSection = (id: string) => {
        if (window.location.pathname === '/rsvp') {
            window.location.href = `/#${id}`
        } else {
            const element = document.getElementById(id)
            element?.scrollIntoView({ behavior: 'smooth' })
        }
        setMobileMenuOpen(false)
    }

    const menuItems = [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'Our Story' },
        { id: 'when-where', label: 'When & Where' },
        { id: 'hotels', label: 'Hotels' },
        { id: 'masquerade', label: 'Masquerade' },
        { id: 'song-requests', label: 'Request a Song' },
        { id: 'game', label: 'Wedding Invaders' },
        { id: 'honeyfund', label: 'Registry' },
        { id: 'contact', label: 'Contact Us' },
    ]

    return (
        <StyledAppBar position="fixed">
            <StyledToolbar>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LogoContainer>
                            <Image src="/logo.png" alt="Logo" width={60} height={60} style={{ objectFit: 'contain' }} priority />
                        </LogoContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {menuItems.map((item) => (
                                <NavButton key={item.id} onClick={() => scrollToSection(item.id)}>
                                    {item.label}
                                </NavButton>
                            ))}
                        </Box>
                    </Box>
                    <MobileMenuButton edge="end" onClick={() => setMobileMenuOpen(true)} aria-label="menu">
                        <MenuIcon />
                    </MobileMenuButton>
                </Box>
            </StyledToolbar>

            <StyledDrawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                            <DrawerListItem onClick={() => scrollToSection(item.id)}>
                                <ListItemText primary={item.label} />
                            </DrawerListItem>
                        </ListItem>
                    ))}
                </List>
            </StyledDrawer>
        </StyledAppBar>
    )
}

export default Navigation
