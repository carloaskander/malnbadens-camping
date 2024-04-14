import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import HostelPrices from "../../components/hostel-prices/HostelPrices"
import BookingConditions from "../../components/booking-conditions/BookingConditions";

function Hostel() {
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
        { name: "Wifi", icon: "wifi" },
        { name: "Privata rum", icon: "bedroom_parent" },
        { name: "Gemensamma Badrum", icon: "bathroom" },
        { name: "Tvättmaskin", icon: "local_laundry_service" },
        { name: "Gemensamma Kök", icon: "soup_kitchen" },
        { name: "Matsal", icon: "restaurant" },
        { name: "TV-rum", icon: "chair" },
        { name: "Uteterrass", icon: "deck" },
        // Add more amenities specific to the hostel
    ];

    const facts = [
        { name: "Antal rum", value: "15", icon: "bedroom_parent" },
        { name: "Enkel/Dubbelrum", value: "12", icon: "bedroom_child" },
        { name: "Fyrbäddsrum", value: "3", icon: "bedroom_parent" },
        { name: "Antal badrum", value: "2", icon: "bathroom" },
        { name: "Antal kök", value: "2", icon: "soup_kitchen" },
        { name: "Möjlighet för extra person (vid förfrågan)", value: "Ja", icon: "person_add" },
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
                                {hostelContent.pageTitle}
                            </Typography>
                            <Typography variant="body2">
                                {hostelContent.pageDescription}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Paper sx={{ 
                                padding: 4,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            }}>
                                <Typography mb={3} variant="h3">Gör en Bokning</Typography>
                                <Button 
                                    href='https://bokning4.paxess.se/malnbaden2' 
                                    target='_blank' 
                                    variant="contained" 
                                    sx={{ width: '100%' }}
                                >
                                    Boka
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
                    <HostelPrices/>
                    <BookingConditions/>
                </Container>
            </Container>
        </Box>
    );
}

export default Hostel;
