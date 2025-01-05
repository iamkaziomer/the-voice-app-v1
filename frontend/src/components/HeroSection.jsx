import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F85F2F',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e54e1e',
  },
}));

const VoiceButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#DAE5EB',
  color: '#252525',
  padding: '4px 16px',
  textTransform: 'none',
  fontWeight: 'inherit',
  fontSize: 'inherit',
  '&:hover': {
    backgroundColor: '#c5d6e0',
  },
}));

const HeroSection = () => {
  const navigate = useNavigate();

  const handleVoiceClick = () => {
    navigate('/primary');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        backgroundColor: '#F2F4F5',
        borderRadius: 2,
        p: { xs: 3, md: 4 },
        mb: 3,
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="h1" 
        sx={{ 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          color: '#252525',
          mb: 4,
          '& > span': {
            display: 'inline-block',
          }
        }}
      >
        Report Upvote Resolve All With{' '}
        <VoiceButton
          onClick={handleVoiceClick}
          disableElevation
        >
          VOICE
        </VoiceButton>
      </Typography>

      <StyledButton
        variant="contained"
        onClick={handleSignupClick}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Get Started
      </StyledButton>
    </Box>
  );
};

export default HeroSection;