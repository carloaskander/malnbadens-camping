import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import HostelPrices from "../../components/hostel-prices/HostelPrices"
import BookingConditions from "../../components/booking-conditions/BookingConditions";

//Material UI Icon Imports
import WifiIcon from '@mui/icons-material/Wifi';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import BathroomIcon from '@mui/icons-material/Bathroom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ChairIcon from '@mui/icons-material/Chair'; // Antag att detta är TV-rum ikonen
import DeckIcon from '@mui/icons-material/Deck';
import BedroomChildIcon from '@mui/icons-material/BedroomChild'; // Antag att detta är för enkel/dubbelrum
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const ColoredIcon = ({ icon, color }) => (
    <Icon sx={{ color: color }}>{icon}</Icon>
);

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
            { name: "Wifi", icon: <WifiIcon /> },
            { name: "Privata rum", icon: <BedroomParentIcon /> },
            { name: "Gemensamma Badrum", icon: <BathroomIcon /> },
            { name: "Tvättmaskin", icon: <LocalLaundryServiceIcon /> },
            { name: "Gemensamma Kök", icon: <SoupKitchenIcon /> },
            { name: "Matsal", icon: <RestaurantIcon /> },
            { name: "TV-rum", icon: <ChairIcon /> },
            { name: "Uteterrass", icon: <DeckIcon /> },
        ];

        const facts = [
            { name: "Antal rum", value: "15", icon: <BedroomParentIcon /> },
            { name: "Enkel/Dubbelrum", value: "12", icon: <BedroomChildIcon /> },
            { name: "Fyrbäddsrum", value: "3", icon: <BedroomParentIcon /> },
            { name: "Antal badrum", value: "2", icon: <BathroomIcon /> },
            { name: "Antal kök", value: "2", icon: <SoupKitchenIcon /> },
            { name: "Möjlighet för extra person (vid förfrågan)", value: "Ja", icon: <PersonAddIcon /> },
        ];

    return (
        <Box sx={{ marginTop: 8, minHeight: '100vh' }}>
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
                                    <ColoredIcon icon={amenity.icon} color='#D66B27'/>
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
                                        <ColoredIcon icon={fact.icon} color='#D66B27'/>
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
