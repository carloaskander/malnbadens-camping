import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography, Container, Grid, Button, Paper, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import CampingPrices from "../../components/camping-prices/CampingPrices.jsx";
import CampingInfo from "../../components/camping-info/CampingInfo.jsx";

// Material UI Icon Imports
import WifiIcon from '@mui/icons-material/Wifi';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import WcIcon from '@mui/icons-material/Wc';
import HotTubIcon from '@mui/icons-material/HotTub';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
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
  const { t } = useTranslation();
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
    { name: t('accommodation.campingPage.amenities.items.el'), icon: <ElectricalServicesIcon /> },
    { name: t('accommodation.campingPage.amenities.items.wifi'), icon: <WifiIcon /> },
    { name: t('accommodation.campingPage.amenities.items.latrintömning'), icon: <FormatColorFillIcon /> },
    { name: t('accommodation.campingPage.amenities.items.gråvattentömning'), icon: <FormatColorFillIcon /> },
    { name: t('accommodation.campingPage.amenities.items.servicehus'), icon: <WcIcon /> },
    { name: t('accommodation.campingPage.amenities.items.bastu'), icon: <HotTubIcon /> },
    { name: t('accommodation.campingPage.amenities.items.skötrum'), icon: <BabyChangingStationIcon /> },
    { name: t('accommodation.campingPage.amenities.items.kök'), icon: <SoupKitchenIcon /> },
    { name: t('accommodation.campingPage.amenities.items.gemensamGrill'), icon: <OutdoorGrillIcon /> },
    { name: t('accommodation.campingPage.amenities.items.matplatsUtomhus'), icon: <RestaurantIcon /> },
    { name: t('accommodation.campingPage.amenities.items.diskrum'), icon: <CountertopsIcon /> },
    { name: t('accommodation.campingPage.amenities.items.dricksvatten'), icon: <WaterDropIcon /> },
    { name: t('accommodation.campingPage.amenities.items.kiosk'), icon: <LocalGroceryStoreIcon /> },
  ];

  const facts = [
    { name: t('accommodation.campingPage.facts.items.antalPlatser'), value: "125", icon: <FormatListNumberedIcon /> },
    { name: t('accommodation.campingPage.facts.items.areaPlatser'), value: "90-110m²", icon: <SquareFootIcon /> },
    { name: t('accommodation.campingPage.facts.items.andelElplatser'), value: "99%", icon: <ElectricalServicesIcon /> },
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
                {t('accommodation.campingPage.title')}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('accommodation.campingPage.description')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ 
                padding: 4,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}>
                <Typography mb={3} variant="h3">{t('accommodation.campingPage.booking.title')}</Typography>
                <Button 
                  href='https://bokning4.paxess.se/malnbaden2' 
                  target='_blank' variant="contained" 
                  sx={{ width: '100%' }}
                >
                  {t('accommodation.campingPage.booking.button')}
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} mb={6}>
              <Typography mb={2} variant="h5">{t('accommodation.campingPage.amenities.title')}</Typography>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography mb={2} variant="h5">{t('accommodation.campingPage.facts.title')}</Typography>
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
