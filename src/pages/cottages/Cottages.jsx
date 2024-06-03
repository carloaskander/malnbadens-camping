import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import CottagePrices from "../../components/cottage-prices/CottagePrices";
import BookingConditions from "../../components/booking-conditions/BookingConditions.jsx";
import AnimatedSection from '../../components/animated-section/AnimatedSection.jsx';

// Material UI Icon Imports
import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import DeckIcon from '@mui/icons-material/Deck';
import WcIcon from '@mui/icons-material/Wc';
import ShowerIcon from '@mui/icons-material/Shower'; 
import HotTubIcon from '@mui/icons-material/HotTub';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CottageIcon from '@mui/icons-material/Cottage';
import BedIcon from '@mui/icons-material/Bed';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';

const ColoredIcon = ({ icon, color }) => (
    <Icon sx={{ color: color }}>{icon}</Icon>
);

function Cottages() {
    const { t } = useTranslation();
    const [cottagesContent, setCottagesContent] = useState(null);

    useEffect(() => {
        contentfulClient.getEntries({
            content_type: 'accommodation',
            'fields.entryTitle': 'Cottages Page'
        })
        .then((response) => {
            if (response.items.length > 0) {
                setCottagesContent(response.items[0].fields);
            }
        })
        .catch(console.error);
    }, []);

    if (!cottagesContent) return <p>{t('loading')}</p>;

    const imageUrls = cottagesContent.photoGallery?.map(photo => photo.fields.file.url) || [];

    const amenities = [
        { name: t('accommodation.cottagesPage.amenities.items.wifi'), icon: <WifiIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.lcdTv'), icon: <TvIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.privatePatio'), icon: <DeckIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.wcInServiceHouse'), icon: <WcIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.showerInServiceHouse'), icon: <ShowerIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.saunaInServiceHouse'), icon: <HotTubIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.babyChangingRoom'), icon: <BabyChangingStationIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.simpleKitchen'), icon: <MicrowaveIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.sharedLargeKitchen'), icon: <SoupKitchenIcon /> },
        { name: t('accommodation.cottagesPage.amenities.items.sharedGrill'), icon: <OutdoorGrillIcon /> },
    ];

    const facts = [
        { name: t('accommodation.cottagesPage.facts.items.numberOfCottages'), value: "9", icon: <FormatListNumberedIcon /> },
        { name: t('accommodation.cottagesPage.facts.items.cottageSize'), value: "16m²", icon: <CottageIcon /> },
        { name: t('accommodation.cottagesPage.facts.items.numberOfBeds'), value: "2-4", icon: <BedIcon /> },
        { name: t('accommodation.cottagesPage.facts.items.extraMattressOption'), value: t('yes'), icon: <AirlineSeatFlatIcon /> },
    ];

    return (
        <Box sx={{ marginTop: 8, minHeight: '100vh' }}>
            <AnimatedSection direction="right">
                <Box sx={{ backgroundColor: '#faf6ee' }}>
                    <PhotoGallery images={imageUrls} />
                </Box>
            </AnimatedSection>
            <Container maxWidth="lg">
                <Container sx={{ 
                    padding: '30px', 
                    backgroundColor: '#fff', 
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', 
                }}>                    
                    <Grid container spacing={8} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item xs={12} md={7}>
                            <AnimatedSection direction="left" delay={0.2}>
                                <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                                    {t('accommodation.cottagesPage.title')}
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    {t('accommodation.cottagesPage.description')}
                                </Typography>
                            </AnimatedSection>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <AnimatedSection direction="right" delay={0.2}>
                                <Paper sx={{ 
                                    padding: 4,
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                }}>
                                    <Typography mb={3} variant="h3">{t('accommodation.cottagesPage.booking.title')}</Typography>
                                    <Button href='https://bokning4.paxess.se/malnbaden2' target='_blank' variant="contained" sx={{ width: '100%', mb: 2 }}>
                                        {t('accommodation.cottagesPage.booking.button')}
                                    </Button>
                                </Paper>
                            </AnimatedSection>
                        </Grid>
                        <Grid item xs={12} md={6} mb={6}>
                            <AnimatedSection direction="left" delay={0.4}>
                                <Typography mb={2} variant="h5">{t('accommodation.cottagesPage.amenities.title')}</Typography>
                                <Grid container spacing={1}>
                                    {amenities.map((amenity, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ColoredIcon icon={amenity.icon} color='#D66B27' />
                                        <Typography variant="h6" sx={{ color: 'primary.main' }}>{amenity.name}</Typography>
                                        </Box>
                                    </Grid>
                                    ))}
                                </Grid>
                            </AnimatedSection>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AnimatedSection direction="right" delay={0.4}>
                                <Typography mb={2} variant="h5">{t('accommodation.cottagesPage.facts.title')}</Typography>
                                <Box>
                                    {facts.map((fact) => (
                                        <Box key={fact.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '8px' }}>
                                            <ColoredIcon icon={fact.icon} color='#D66B27' />
                                            <Typography variant='h6'>{`${fact.name}: ${fact.value}`}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </AnimatedSection>
                        </Grid>
                    </Grid>
                    <AnimatedSection direction="left">
                        <CottagePrices/>
                    </AnimatedSection>
                    <AnimatedSection direction="right">
                        <BookingConditions/>
                    </AnimatedSection>
                </Container>
            </Container>
        </Box>
    );
}

export default Cottages;
