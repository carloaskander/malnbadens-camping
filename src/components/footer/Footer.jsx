import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import { Facebook, YouTube, Email, Phone, LocationOn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
    const { t } = useTranslation();
    const headingStyle = {
        fontSize: {
          xs: '0.75rem', // mindre för små enheter
          sm: '0.875rem', // lite större för medium enheter
          md: '1rem', // standardstorlek för större enheter
        },
        // Lägg till ytterligare stilinställningar här
    };

    const textStyle = {
        fontSize: {
          xs: '1rem', // mindre för små enheter
          sm: '0.95rem', // lite större för medium enheter
          md: '1.25rem', // standardstorlek för större enheter
        },
        whiteSpace: 'nowrap',
        // Lägg till ytterligare stilinställningar här
    };

    return (
        <Box component="footer" sx={{ minHeight: { xs: '400px', sm:'256px'}, bgcolor: 'rgba(4, 51, 40)', color: 'white', py: 3 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">{t('footer.links.title')}</Typography>
                        <Box component="nav">
                            <Link variant='h6' sx={textStyle} component={RouterLink} to="/opening-hours" color="inherit" underline="hover">{t('footer.links.openingHours')}</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">{t('footer.contact.title')}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1 }} />
                            <Typography variant='h6'sx={textStyle}>Malnvägen 34, 82456 Hudiksvall</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ mr: 1 }} />
                            <Link variant='h6' href="tel:065013260" sx={textStyle} color="inherit" underline="hover">0650-132 60</Link>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email sx={{ mr: 1 }} />
                            <Link variant='h6' href="mailto:info@malnbadenscamping.se" sx={textStyle} color="inherit" underline="hover">info@malnbadenscamping.se</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">{t('footer.socials.title')}</Typography>
                        <IconButton component="a" href="https://www.facebook.com/p/Malnbadens-Camping-Vandrarhem-Hudiksvall-100053636355088/" target="_blank" color="inherit">
                            <Facebook />
                        </IconButton>
                        <IconButton component="a" href="https://www.youtube.com/channel/UCzyJKfPRMY_tDbC8sowKIJg" target="_blank" color="inherit">
                            <YouTube />
                        </IconButton>
                    </Grid>
                </Grid>
                <Typography sx={{ pt: 3, textAlign: 'center' }} variant="body3">
                    © {new Date().getFullYear()} Malnbadens Camping. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
