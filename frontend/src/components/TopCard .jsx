import React from 'react';
import { Card, Typography, Box, Chip, styled } from '@mui/material';

const StyledCard = styled(Card)({
  display: 'flex',
  margin: '20px 0',
  padding: '24px',
  borderRadius: '12px',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  gap: '24px',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  }
});

const RankBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#26313E',
  color: 'white',
  fontWeight: 'bold',
});

const InfoContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const ImageContainer = styled(Box)({
  width: '300px',
  height: '200px',
  borderRadius: '8px',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
});

const ChipsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

const StyledChip = styled(Chip)({
  borderRadius: '6px',
  backgroundColor: '#f5f5f5',
  '&.priority': {
    backgroundColor: '#e3f2fd',
  },
  '&.authority': {
    backgroundColor: '#f3e5f5',
  },
  '&.location': {
    backgroundColor: '#e8f5e9',
  }
});

const UpvoteBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid #ff4081',
  color: '#ff4081',
  fontWeight: '500',
  marginTop: '8px',
  width: 'fit-content'
});

const TopCard = ({ issue, rank }) => {
  const {
    title,
    description,
    priority,
    concernAuthority,
    colony,
    pincode,
    images,
    upvotes
  } = issue;

  return (
    <StyledCard>
      <RankBox>
        {rank}
      </RankBox>
      
      <InfoContainer>
        <Typography variant="h5" sx={{ fontWeight: '600', color: '#26313E' }}>
          {title}
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#546e7a' }}>
          {description}
        </Typography>

        <ChipsContainer>
          <StyledChip 
            label={priority}
            className="priority"
          />
          <StyledChip 
            label={concernAuthority}
            className="authority"
          />
          <StyledChip 
            label={`${colony} - ${pincode}`}
            className="location"
          />
        </ChipsContainer>

        <UpvoteBox>
          {upvotes.count} upvotes
        </UpvoteBox>
      </InfoContainer>

      <ImageContainer>
        {images && images[0] ? (
          <img src={images[0]} alt={title} />
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9e9e9e'
            }}
          >
            No Image
          </Box>
        )}
      </ImageContainer>
    </StyledCard>
  );
};

export default TopCard;