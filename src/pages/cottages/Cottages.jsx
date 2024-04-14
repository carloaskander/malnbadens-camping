import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import CottagePrices from "../../components/cottage-prices/CottagePrices";
import BookingConditions from "../../components/booking-conditions/BookingConditions.jsx";

function Cottages() {
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

    if (!cottagesContent) return <p>Laddar...</p>;

    const imageUrls = cottagesContent.photoGallery?.map(photo => photo.fields.file.url) || [];

    const amenities = [
      { name: "Wifi", icon: "wifi" },
      { name: "LCD-TV", icon: "tv" },
      { name: "Egen uteplats", icon: "deck" },
      { name: "WC i servicehuset", icon: "wc" },
      { name: "Dusch i servicehuset", icon: "shower" },
      { name: "Bastu i servicehuset", icon: "hot_tub" },
      { name: "Skötrum", icon: "baby_changing_station" },
      { name: "Simpelt kök i stugan", icon: "microwave" },
      { name: "Extra gemensamt storkök", icon: "soup_kitchen" },
      { name: "Gemensam grill", icon: "outdoor_grill" },
        // Add more amenities as needed
    ];

    const facts = [
        { name: "Antal stugor", value: "9", icon: "format_list_numbered" },
        { name: "Storlek stugor", value: "16m²", icon: "cottage" },
        { name: "Antal bäddar", value: "2-4", icon: "bed" },
        { name: "Möjlighet för extra madrass", value: "Ja", icon: "airline_seat_flat" },
        // Add more facts as needed
    ];

    return (
        <Box sx={{ marginTop: 'var(--navbar-min-height)' }}>
            <Box mb={6}>
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
                            <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                                {cottagesContent.pageTitle}
                            </Typography>
                            <Typography variant="body2" paragraph>
                                {cottagesContent.pageDescription}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ 
                                padding: 4,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            }}>
                                <Typography mb={3} variant="h3">Gör en Bokning</Typography>
                                    <Button href='https://bokning4.paxess.se/malnbaden2' target='_blank' variant="contained" sx={{ width: '100%', mb: 2 }}>
                                        Boka Nu
                                    </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} mb={6}>
                            <Typography mb={2} variant="h5">Bekvämligheter</Typography>
                            <Grid container spacing={1}>
                                {amenities.map((amenity, index) => (
                                <Grid item xs={12} sm={6} key={index}> {/* xs=12 för full bredd på små skärmar, sm=6 för halv bredd på större skärmar */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Icon sx={{ color: 'secondary.main' }}>{amenity.icon}</Icon>
                                    <Typography variant="h6" sx={{ color: 'primary.main' }}>{amenity.name}</Typography>
                                    </Box>
                                </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography mb={2} variant="h5">Fakta</Typography>
                            <Box>
                                {facts.map((fact) => (
                                    <Box key={fact.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '8px' }}>
                                        <Icon sx={{ color: 'secondary.main' }}>{fact.icon}</Icon>
                                        <Typography variant='h6'>{`${fact.name}: ${fact.value}`}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                    <CottagePrices/>
                    <BookingConditions/>
                </Container>
            </Container>
        </Box>
    );
}

export default Cottages;
