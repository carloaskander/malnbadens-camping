import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import HostelPrices from "../../components/hostel-prices/HostelPrices";
import BookingConditions from "../../components/booking-conditions/BookingConditions";
import AnimatedSection from '../../components/animated-section/AnimatedSection.jsx';

// Material UI Icon Imports
import WifiIcon from '@mui/icons-material/Wifi';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import BathroomIcon from '@mui/icons-material/Bathroom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ChairIcon from '@mui/icons-material/Chair';
import DeckIcon from '@mui/icons-material/Deck';
import BedroomChildIcon from '@mui/icons-material/BedroomChild';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const ColoredIcon = ({ icon, color }) => (
    <Icon sx={{ color: color }}>{icon}</Icon>
);

function Hostel() {
    const { t } = useTranslation();
    const [hostelContent, setHostelContent] = useState(null);

    useEffect(() => {
        contentfulClient.getEntries({
            content_type: 'accommodation',
            'fields.entryTitle': 'Hostel Page'
        })
        .then((response) => {
            if (response.items.length > 0) {
                setHostelContent(response.items[0].fields);
            }
        })
        .catch(console.error);
    }, []);

    if (!hostelContent) return <p>Laddar...</p>;

    const imageUrls = hostelContent.photoGallery?.map(photo => photo.fields.file.url) || [];

    const amenities = [
        { name: t('accommodation.hostelPage.amenities.items.wifi'), icon: <WifiIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.privateRooms'), icon: <BedroomParentIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.sharedBathrooms'), icon: <BathroomIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.washingMachine'), icon: <LocalLaundryServiceIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.sharedKitchens'), icon: <SoupKitchenIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.diningRoom'), icon: <RestaurantIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.tvRoom'), icon: <ChairIcon /> },
        { name: t('accommodation.hostelPage.amenities.items.outdoorTerrace'), icon: <DeckIcon /> },
    ];

    const facts = [
        { name: t('accommodation.hostelPage.facts.items.numberOfRooms'), value: "15", icon: <BedroomParentIcon /> },
        { name: t('accommodation.hostelPage.facts.items.singleDoubleRooms'), value: "12", icon: <BedroomChildIcon /> },
        { name: t('accommodation.hostelPage.facts.items.numberOfBathrooms'), value: "2", icon: <BathroomIcon /> },
        { name: t('accommodation.hostelPage.facts.items.numberOfKitchens'), value: "2", icon: <SoupKitchenIcon /> },
        { name: t('accommodation.hostelPage.facts.items.extraPersonOption'), value: "Ja", icon: <PersonAddIcon /> },
    ];

    return (
        <Box sx={{ marginTop: 8, minHeight: '100vh' }}>
                <Box sx={{ backgroundColor: '#faf6ee' }}>
                    <PhotoGallery images={imageUrls} />
                </Box>
            <Container maxWidth="lg">
                <Container sx={{ 
                    padding: '30px', 
                    backgroundColor: '#fff', 
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', 
                }}>
                    <Grid container spacing={8} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item xs={12} md={7}>
                            <AnimatedSection direction="left" delay={0.2} noDelayOnMobile={true}>
                                <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                                    {t('accommodation.hostelPage.title')}
                                </Typography>
                                <Typography variant="body2">
                                    {t('accommodation.hostelPage.description')}
                                </Typography>
                            </AnimatedSection>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <AnimatedSection direction="right" delay={0.2} noDelayOnMobile={true}>
                                <Paper sx={{ 
                                    padding: 4,
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                }}>
                                    <Typography mb={3} variant="h3">{t('accommodation.hostelPage.booking.title')}</Typography>
                                    <Button 
                                        href='https://bokning4.paxess.se/malnbaden2' 
                                        target='_blank' 
                                        variant="contained" 
                                        sx={{ width: '100%' }}
                                    >
                                        {t('accommodation.hostelPage.booking.button')}
                                    </Button>
                                </Paper>
                            </AnimatedSection>
                        </Grid>
                        <Grid item xs={12} md={6} mb={6}>
                            <AnimatedSection direction="left" delay={0.4} noDelayOnMobile={true}>
                                <Typography mb={2} variant="h5">{t('accommodation.hostelPage.amenities.title')}</Typography>
                                <Grid container spacing={1}>
                                    {amenities.map((amenity, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ColoredIcon icon={amenity.icon} color='#D66B27'/>
                                        <Typography variant="h6" sx={{ color: 'primary.main' }}>{amenity.name}</Typography>
                                        </Box>
                                    </Grid>
                                    ))}
                                </Grid>
                            </AnimatedSection>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AnimatedSection direction="right" delay={0.4} noDelayOnMobile={true}>
                                <Typography mb={2} variant="h5">{t('accommodation.hostelPage.facts.title')}</Typography>
                                <Box>
                                    {facts.map((fact) => (
                                        <Box key={fact.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '8px' }}>
                                            <ColoredIcon icon={fact.icon} color='#D66B27'/>
                                            <Typography variant='h6'>{`${fact.name}: ${fact.value}`}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </AnimatedSection>
                        </Grid>
                    </Grid>
                    <AnimatedSection direction="left">
                        <HostelPrices/>
                    </AnimatedSection>
                    <AnimatedSection direction="right">
                        <BookingConditions/>
                    </AnimatedSection>
                </Container>
            </Container>
        </Box>
    );
}

export default Hostel;
