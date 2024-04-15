import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: '#FAF6EE', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom>
            404 - Sidan hittades inte
            </Typography>
            <Typography variant="subtitle1" mb={4}>
            Tyvärr kan vi inte hitta den sida du letar efter. Det kan bero på att sidan inte finns längre eller att en felaktig URL har angetts.
            </Typography>
            <Typography variant="body1">
            En flitig programmerare sitter och jobbar för fullt bakom kulisserna för att kontinuerligt förbättra vår webbplats och ge dig en bättre användarupplevelse. Du kanske hittar sidan du letade efter genom att navigera på vår webbplats.            </Typography>
            <Box mt={4}>
            <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => navigate('/home')}>
                Hem
            </Button>
            <Button variant="outlined" startIcon={<ExploreIcon />} sx={{ ml: 2 }} onClick={() => navigate('/accommodation/camping')}>
                Camping
            </Button>
            </Box>
        </Container>
        </Box>
    );
}

export default NotFound;
