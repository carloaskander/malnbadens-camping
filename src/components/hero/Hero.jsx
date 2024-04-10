import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import heroVideo from '../../assets/images/hero/malnbaden-drone-video.mp4';

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
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust the opacity as needed
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
        src={heroVideo}
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
          justifyContent: 'center',
          gap: 2,
          alignItems: 'start',
          height: 'calc(100% - 70px)',
          zIndex: 2, // Ensure text appears above the overlay
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
          href='https://bokning4.paxess.se/malnbaden2'
          target='_blank'
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
