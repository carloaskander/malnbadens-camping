import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import heroImage from '../../assets/images/hero/hero-image-1.jpg';

function Hero() {
  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '75vh', md: '50vh' }, // Less tall on desktop
        '&::before': { // Using pseudo-element for hero image
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        },
        '&::after': { // Using pseudo-element for overlay
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '70px',
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'calc(100% - 70px)',
          zIndex: 1,
        }}
      >
        <Typography
          color="text.secondary"
          variant="h3"
          gutterBottom
          sx={{ fontStyle: 'italic', textAlign: 'center' }}
        >
          Welcome to our Campsite
        </Typography>
        <Typography
          color="text.secondary"
          variant="h6"
          sx={{ fontStyle: 'italic', mb: 2, textAlign: 'center' }}
        >
          Experience sea, city, and nature.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            fontSize: '1.125rem',
            borderRadius: '1px',
          }}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );
}

export default Hero;