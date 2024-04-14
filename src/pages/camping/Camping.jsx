import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import CampingPrices from "../../components/camping-prices/CampingPrices.jsx";
import CampingInfo from "../../components/camping-info/CampingInfo.jsx";

//Material UI Icon Imports
import WifiIcon from '@mui/icons-material/Wifi';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import WcIcon from '@mui/icons-material/Wc';
import HotTubIcon from '@mui/icons-material/HotTub';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'; // Observera att detta kan vara en annan ikon om det inte finns någon med exakt detta namn.
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CountertopsIcon from '@mui/icons-material/Countertops';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

const ColoredIcon = ({ icon, color }) => (
  <Icon sx={{ color: color }}>{icon}</Icon>
);

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
    { name: "El", icon: <ElectricalServicesIcon /> },
    { name: "Wifi", icon: <WifiIcon /> },
    { name: "Latrintömning", icon: <FormatColorFillIcon /> },
    { name: "Servicehus", icon: <WcIcon /> },
    { name: "Bastu", icon: <HotTubIcon /> },
    { name: "Skötrum", icon: <BabyChangingStationIcon /> },
    { name: "Kök", icon: <SoupKitchenIcon /> },
    { name: "Gemensam grill", icon: <OutdoorGrillIcon /> },
    { name: "Matplats utomhus", icon: <RestaurantIcon /> },
    { name: "Diskrum", icon: <CountertopsIcon /> },
    { name: "Dricksvatten", icon: <WaterDropIcon /> },
    { name: "Kiosk", icon: <LocalGroceryStoreIcon /> },
  ];

  const facts = [
    { name: "Antal platser", value: ">115", icon: <FormatListNumberedIcon /> },
    { name: "Area platser", value: "90-110m²", icon: <SquareFootIcon /> },
    { name: "Andel elplatser", value: "99%", icon: <ElectricalServicesIcon /> },
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
