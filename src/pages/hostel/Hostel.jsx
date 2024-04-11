import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import HostelPrices from "../../components/hostel-prices/HostelPrices"

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
                    boxShadow: {
                        xs: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        sm: '-4px 4px 6px rgba(0, 0, 0, 0.1)'
                    } 
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
                                boxShadow: { 
                                    xs: '0px 8px 10px rgba(0, 0, 0, 0.1)', // No boxShadow on xs breakpoint
                                    sm: '-8px 8px 10px rgba(0, 0, 0, 0.1)' // Apply boxShadow from sm breakpoint and up
                                }
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
                    <HostelPrices/>
                </Container>
            </Container>
        </Box>
    );
}

export default Hostel;
