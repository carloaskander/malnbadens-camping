import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import CampingPrices from "../../components/camping-prices/CampingPrices.jsx";
import CampingInfo from "../../components/camping-info/CampingInfo.jsx";


function Camping() {
  const [campingContent, setCampingContent] = useState(null);

  useEffect(() => {
    contentfulClient.getEntries({
      content_type: 'accommodation',
      'fields.entryTitle': 'Camping Page'
    })
    .then((response) => {
      if (response.items.length > 0) {
        setCampingContent(response.items[0].fields);
      }
    })
    .catch(console.error);
  }, []);

  if (!campingContent) return <p>Loading...</p>;

  const imageUrls = campingContent.photoGallery?.map(photo => photo.fields.file.url) || [];

  const amenities = [
    { name: "El", icon: "electrical_services" },
    { name: "Wifi", icon: "wifi" },
    { name: "Latrintömning", icon: "format_color_fill" },
    { name: "Servicehus", icon: "wc" },
    { name: "Bastu", icon: "hot_tub" },
    { name: "Skötrum", icon: "baby_changing_station" },
    { name: "Kök", icon: "soup_kitchen" },
    { name: "Gemensam grill", icon: "outdoor_grill" },
    { name: "Matplats utomhus", icon: "restaurant" },
    { name: "Diskrum", icon: "countertops" },
    { name: "Dricksvatten", icon: "water_drop" },
    { name: "Kiosk", icon: "local_grocery_store" },
  ];

  const facts = [
    { name: "Antal platser", value: ">115", icon: "format_list_numbered" },
    { name: "Area platser", value: "90-110m²", icon: "square_foot" },
    { name: "Andel elplatser", value: "99%", icon: "electrical_services" },
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
                {campingContent.pageTitle}
              </Typography>
              <Typography variant="body2" paragraph>
                {campingContent.pageDescription}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ 
                padding: 4,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}>
                <Typography mb={3} variant="h3">Gör en bokning</Typography>
                <Button 
                  href='https://bokning4.paxess.se/malnbaden2' 
                  target='_blank'variant="contained" 
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
                    <Typography variant="h6">{`${fact.name}: ${fact.value}`}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          <CampingPrices/>
          <CampingInfo/>
        </Container>
      </Container>
    </Box>
  );
}

export default Camping;
