import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import heroVideo from '../../assets/images/hero/malnbaden-drone-video.mp4';
import heroVideoPoster from '../../assets/images/hero/malnbaden-drone-video-poster.webp';

function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if(videoRef.current) {
      videoRef.current.playbackRate = 0.6; // Slow down the video to half speed
    }
  }, []);

  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '75vh', md: '75vh' },
        overflow: 'hidden',
        '&::before': { // Adding the overlay back
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
          zIndex: 1, // Ensure it's above the video but below the text
        },
      }}
    >
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        ref={videoRef}
        preload='auto'
        poster={heroVideoPoster}
        src={heroVideo}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: 0, // Ensure the video stays in the background
        }}
      >
        Your browser does not support the video tag.
      </video>

      <Box
        sx={{
          position: 'absolute',
          top: '70px',
          left: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-end', lg: 'center' },
          gap: 1,
          alignItems: 'start',
          height: 'calc(100% - 70px)',
          zIndex: 2, // Ensure text appears above the overlay
        }}
      >
        <Typography
          color="text.secondary"
          component='h2'
          variant="h5"
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
            minHeight: { xs: '40px', sm: '50px', md: '42px' } // Anpassade värden för olika skärmstorlekar
          }}
        >
          Upplev hav, stad och natur.
        </Typography>
        <Typography
          color="text.secondary"
          variant="h1"
          sx={{
            fontSize: {
              xs: '4rem', // default for mobile screens
              sm: '5rem', // for tablets and above
              md: '6rem'  // for medium screens and larger
            },
            minHeight: { xs: '149px', sm: '186px', md: '224px' } // Anpassade värden för olika skärmstorlekar
          }}
        >
          Malnbadens<br/>Camping
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          href='https://bokning4.paxess.se/malnbaden2'
          target='_blank'
          sx={{
            fontSize: { xs: '20', lg: '22px' },
            marginBottom: { xs: '10px', lg: '0px' },
            minHeight: { xs: '51px', sm: '54px', md: '60px' } // Anpassade värden för olika skärmstorlekar
          }}
        >
          Boka Direkt
        </Button>

      </Box>
    </Box>
  );
}

export default Hero;
