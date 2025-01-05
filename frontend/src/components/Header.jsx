import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import voiceLogo from '../assets/voice-logo-png.png';

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

// Custom styled components
const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0,0,0,0.06)'
});

const NavButton = styled(Button)({
  color: '#26313E',
  textTransform: 'none',
  fontSize: '15px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#26313E',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  }
});

const SignUpButton = styled(Button)({
  backgroundColor: '#26313E',
  color: 'white',
  textTransform: 'none',
  fontSize: '15px',
  padding: '8px 24px',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: '#26313E',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
  }
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer'
});

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Navigation items array
  const navigationItems = [
    { label: 'Dashboard', path: '/primary' },
    { label: 'Priority Board', path: '/priority' },
    { label: 'All Issues', path: '/issues' },
    { label: 'Blogs', path: '/blogs' }
  ];

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleUploadClick = () => {
    if (user) {
      navigate('/upload-issue');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', padding: '8px 0' }}>
            {/* Logo Section */}
            <LogoContainer onClick={() => navigate('/')} sx={{ flex: isMobile ? 'auto' : 1 }}>
              <img 
                src={voiceLogo}
                alt="Voice Logo" 
                style={{ height: '80px', width: 'auto' }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: '#26313E',
                  fontSize: '20px',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                VOICE
              </Typography>
            </LogoContainer>

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuClick}
                  sx={{ color: '#26313E' }}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  {navigationItems.map((item) => (
                    <MenuItem 
                      key={item.path} 
                      onClick={() => handleNavigate(item.path)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                  {user && (
                    <MenuItem onClick={handleUploadClick}>Upload Issue</MenuItem>
                  )}
                </Menu>
              </>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flex: 2,
                  justifyContent: 'center'
                }}>
                  {navigationItems.map((item) => (
                    <NavButton 
                      key={item.path}
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                    </NavButton>
                  ))}
                </Box>

                {/* Auth Section */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flex: 1,
                  justifyContent: 'flex-end'
                }}>
                  {user ? (
                    <>
                      <NavButton onClick={handleUploadClick}>
                        Upload Issue
                      </NavButton>
                      <NavButton onClick={handleLogout}>
                        Logout
                      </NavButton>
                    </>
                  ) : (
                    <>
                      <NavButton onClick={() => setIsLoginOpen(true)}>
                        Login
                      </NavButton>
                      <SignUpButton 
                        onClick={() => setIsSignupOpen(true)}
                        variant="contained"
                        disableElevation
                      >
                        Sign up
                      </SignUpButton>
                    </>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Toolbar /> {/* Spacing element */}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        switchToSignup={switchToSignup}
      />
      
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        switchToLogin={switchToLogin}
      />
    </>
  );
}

export default Header;