import { AppBar, Toolbar, Button, Box } from '@mui/material';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(5px);
`;

const NavButton = styled(Button)`
  color: #B8860B;
  margin: 0 8px;
  &:hover {
    color: #CD7F32;
  }
`;

const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <NavButton onClick={() => scrollToSection('hero')}>Home</NavButton>
          <NavButton onClick={() => scrollToSection('about')}>Our Story</NavButton>
          <NavButton onClick={() => scrollToSection('when-where')}>When & Where</NavButton>
          <NavButton onClick={() => scrollToSection('hotels')}>Hotels</NavButton>
          <NavButton onClick={() => scrollToSection('masquerade')}>Masquerade</NavButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navigation;
