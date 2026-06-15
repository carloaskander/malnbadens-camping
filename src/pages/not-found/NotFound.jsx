import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import { useLocation, useNavigate } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['sv', 'en', 'no', 'de', 'fr', 'fi'];

function NotFound() {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const routeLanguage = pathname.split('/')[1];
    const currentLanguage = SUPPORTED_LANGUAGES.includes(routeLanguage)
        ? routeLanguage
        : i18n.resolvedLanguage;
    const translate = (key) => t(key, { lng: currentLanguage });

    useEffect(() => {
        document.title = `${t('notFoundPage.title', { lng: currentLanguage })} | Malnbadens Camping`;
    }, [currentLanguage, t]);

    const handleNavigate = (path) => {
        navigate(`/${currentLanguage}${path}`);
    };

    return (
        <Box sx={{ bgcolor: '#FAF6EE', minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <Typography variant="h2" gutterBottom>
                    404 - {translate('notFoundPage.title')}
                </Typography>
                <Typography variant="subtitle1" mb={4}>
                    {translate('notFoundPage.subtitle')}
                </Typography>
                <Typography variant="body1">
                    {translate('notFoundPage.description')}
                </Typography>
                <Box mt={4}>
                    <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => handleNavigate('/home')}>
                        {translate('notFoundPage.homeButton')}
                    </Button>
                    <Button variant="outlined" startIcon={<ExploreIcon />} sx={{ ml: 2 }} onClick={() => handleNavigate('/accommodation/camping')}>
                        {translate('notFoundPage.campingButton')}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default NotFound;
