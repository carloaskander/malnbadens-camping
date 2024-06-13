import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const currentLanguage = i18n.language;

    const handleNavigate = (path) => {
        navigate(`/${currentLanguage}${path}`);
    };

    return (
        <Box sx={{ bgcolor: '#FAF6EE', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <Typography variant="h2" gutterBottom>
                    404 - {t('notFoundPage.title')}
                </Typography>
                <Typography variant="subtitle1" mb={4}>
                    {t('notFoundPage.subtitle')}
                </Typography>
                <Typography variant="body1">
                    {t('notFoundPage.description')}
                </Typography>
                <Box mt={4}>
                    <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => handleNavigate('/home')}>
                        {t('notFoundPage.homeButton')}
                    </Button>
                    <Button variant="outlined" startIcon={<ExploreIcon />} sx={{ ml: 2 }} onClick={() => handleNavigate('/accommodation/camping')}>
                        {t('notFoundPage.campingButton')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default NotFound;
