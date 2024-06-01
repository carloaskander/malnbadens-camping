import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { Facebook, Instagram, Phone, Place } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function Restaurant() {
    const { t } = useTranslation();

    return (
        <>
            <Box sx={{ bgcolor: '#FAF6EE', minHeight: 'calc(100vh - 250px)', pt: 'calc(70px + 75px)', pb: 4 }}>
                <Container maxWidth='lg'>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant='h3'>{t('restaurantPage.welcome')}</Typography>
                            <Box 
                                component="img" 
                                src="https://media-cdn.tripadvisor.com/media/photo-s/17/c4/b5/91/maln-hav-krog-logotyp.jpg" 
                                alt="Maln Hav & Krog" 
                                sx={{ maxWidth: '100%', mt: 2, mb: 2 }} 
                            />
                            <Typography variant='body1' mt={2}>
                                {t('restaurantPage.description')}
                            </Typography>
                            <Box mt={2}>
                                <Typography variant='body1' mb={1}>
                                    <IconButton color="primary" href="https://www.facebook.com/malnhavochkrog/" target="_blank" rel="noopener">
                                        <Facebook />
                                    </IconButton>
                                    <Link href="https://www.facebook.com/malnhavochkrog/" target="_blank" rel="noopener" variant="body1">
                                        {t('restaurantPage.facebook')}
                                    </Link>
                                </Typography>
                                <Typography variant='body1' mb={1}>
                                    <IconButton color="primary" href="https://www.instagram.com/malnhavochkrog/" target="_blank" rel="noopener">
                                        <Instagram />
                                    </IconButton>
                                    <Link href="https://www.instagram.com/malnhavochkrog/" target="_blank" rel="noopener" variant="body1">
                                        {t('restaurantPage.instagram')}
                                    </Link>
                                </Typography>
                            </Box>
                            <Box mt={2}>
                                <Typography variant='body1' mb={1}>
                                    <IconButton color="primary" href="https://maps.google.com/?q=Malnvägen 38, Hudiksvall 82450 Sverige" target="_blank" rel="noopener">
                                        <Place />
                                    </IconButton>
                                    <Link href="https://maps.google.com/?q=Malnvägen 38, Hudiksvall 82450 Sverige" target="_blank" rel="noopener" variant="body1">
                                        {t('restaurantPage.address')}
                                    </Link>
                                </Typography>
                                <Typography variant='body1' mb={1}>
                                    <IconButton color="primary" href="tel:+46705441159">
                                        <Phone />
                                    </IconButton>
                                    <Link href="tel:+46705441159" variant="body1">
                                        {t('restaurantPage.phone')}
                                    </Link>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 0,
                                    paddingBottom: { xs: '177.78%', md: '150%' }, // Adjust height for desktop
                                    overflow: 'hidden',
                                    maxWidth: { xs: '100%', md: '80%' }, // Adjust width for desktop
                                    margin: '0 auto' // Center the video on desktop
                                }}
                            >
                                <iframe
                                    src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1127619845221350&show_text=0&width=560&autoplay=true&loop=true&muted=true"
                                    width="100%"
                                    height="100%"
                                    style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
                                    scrolling="no"
                                    frameBorder="0"
                                    allowTransparency="true"
                                    allow="encrypted-media"
                                    allowFullScreen={true}
                                    title="Facebook Reel"
                                ></iframe>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default Restaurant;
