import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import heroImage from '../../assets/images/hero/hero-image-1.jpg';

function Hero() {
  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '75vh', md: '75vh' }, // Less tall on desktop
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
          left: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          alignItems: 'start',
          height: 'calc(100% - 70px)',
          zIndex: 1,
        }}
      >
        <Typography
          color="text.secondary"
          variant="h5"
        >
          Experience sea, city, and nature.
        </Typography>
        <Typography
          color="text.secondary"
          variant="h1"
        >
          Malnbaden<br/>Camping
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            fontSize: '22px',
          }}
        >
          Boka Direkt
        </Button>
      </Box>
    </Box>
  );
}

export default Hero;