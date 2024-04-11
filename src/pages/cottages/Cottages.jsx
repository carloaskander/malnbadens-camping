import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import CottagePrices from "../../components/cottage-prices/CottagePrices"

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
      { name: "Uteplats med bord och stolar", icon: "deck" },
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
                    boxShadow: {
                        xs: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        sm: '-4px 4px 6px rgba(0, 0, 0, 0.1)'
                    } 
                }}>                    
                    <Grid container spacing={8} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                                {cottagesContent.pageTitle}
                            </Typography>
                            <Typography variant="body2">
                                {cottagesContent.pageDescription}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ 
                                padding: 4,
                                boxShadow: { 
                                    xs: '0px 8px 10px rgba(0, 0, 0, 0.1)', // No boxShadow on xs breakpoint
                                    sm: '-8px 8px 10px rgba(0, 0, 0, 0.1)' // Apply boxShadow from sm breakpoint and up
                                }
                            }}>
                                <Typography mb={3} variant="h3">Gör en Bokning</Typography>
                                    <Button href='https://bokning4.paxess.se/malnbaden2' target='_blank' variant="contained" sx={{ width: '100%' }}>
                                        Boka Nu
                                    </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography mb={2} variant="h5">Bekvämligheter</Typography>
                            <Box>
                                {amenities.map((amenity) => (
                                    <Box key={amenity.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '8px' }}>
                                        <Icon sx={{ color: 'secondary.main' }}>{amenity.icon}</Icon>
                                        <Typography variant='h6'>{amenity.name}</Typography>
                                    </Box>
                                ))}
                            </Box>
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
                </Container>
            </Container>
        </Box>
    );
}

export default Cottages;
