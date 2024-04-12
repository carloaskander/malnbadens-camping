import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import { Facebook, YouTube, Email, Phone, LocationOn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'rgba(4, 51, 40)', color: 'white', py: 3 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">Snabblänkar</Typography>
                        <Box component="nav">
                            <Link variant='h6' component={RouterLink} to="/opening-hours" color="inherit" underline="hover" sx={{ display: 'block' }}>Öppettider</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">Kontakta Oss</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1 }} />
                            <Typography variant='h6'>Malnvägen 34, 82456 Hudiksvall</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ mr: 1 }} />
                            <Link variant='h6' href="tel:+065013260" color="inherit" underline="hover">0650-132 60</Link>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Email sx={{ mr: 1 }} />
                            <Link variant='h6' href="mailto:info@malnbadenscamping.se" color="inherit" underline="hover">info@malnbadenscamping.se</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">Följ Oss</Typography>
                        <IconButton component="a" href="https://www.facebook.com/p/Malnbadens-Camping-Vandrarhem-Hudiksvall-100053636355088/" target="_blank" color="inherit">
                            <Facebook />
                        </IconButton>
                        <IconButton component="a" href="https://www.youtube.com/channel/UCzyJKfPRMY_tDbC8sowKIJg" target="_blank" color="inherit">
                            <YouTube />
                        </IconButton>
                    </Grid>
                </Grid>
                <Typography sx={{ pt: 3, textAlign: 'center' }} variant="body2">
                    © {new Date().getFullYear()} Malnbadens Camping. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
