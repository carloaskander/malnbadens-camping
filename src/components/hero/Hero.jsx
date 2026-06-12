import { useRef, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import heroVideo from '../../assets/images/hero/malnbaden-drone-video.mp4';
import heroVideoPoster from '../../assets/images/hero/malnbaden-drone-video-poster.webp';
import heroLogo from '../../assets/images/logo/mbc-wordmark-white.svg';
import BookingCountdown from '../booking-countdown/BookingCountdown';
import AnimatedSection from '../animated-section/AnimatedSection';

function Hero() {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Slow down the video
    }
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '75vh', md: '75vh' },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
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
          width: 'auto',
          height: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      >
        Your browser does not support the video tag.
      </video>
      <Container
        maxWidth="xl"
        sx={{
          position: 'absolute',
          top: { xs: 0, lg: '10%' },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-end', lg: 'center' },
        }}
      >
        <AnimatedSection direction='left'>
          <Typography
            color="text.secondary"
            component='h2'
            variant="h5"
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
              textAlign: 'left',
              maxWidth: 'none',  // Ensures text aligns within the Container
            }}
          >
            {t('hero.subtitle')}
          </Typography>
        </AnimatedSection>
        <AnimatedSection direction='right' delay={0.2}>
          <Typography
            component="h1"
            sx={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              p: 0,
              m: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Malnbadens Camping
          </Typography>
          <Box
            component="img"
            src={heroLogo}
            alt=""
            sx={{
              display: 'block',
              width: {
                xs: '300px',
                sm: '360px',
                md: '420px',
                lg: '480px',
              },
              maxWidth: '100%',
              maxHeight: { xs: '22vh', md: '24vh' },
              objectFit: 'contain',
              mt: { xs: -1, sm: -1.5, md: -2, lg: -2.5 },
              mb: { xs: 1, sm: 1.5, lg: 2 },
            }}
          />
        </AnimatedSection>
        <AnimatedSection direction='left' delay={0.4}>
          <BookingCountdown />
        </AnimatedSection>
      </Container>
    </Box>
  );
}

export default Hero;
