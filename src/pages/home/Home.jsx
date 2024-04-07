import React from 'react';
import Hero from '../../components/hero/Hero';
import AccommodationCard from '../../components/AccommodationCard/AccommodationCard';
import ActivitiesSection from '../../components/activities-section/ActivitiesSection';
import RestaurantSection from '../../components/restaurant-section/RestaurantSection';
import MapSection from '../../components/map-section/MapSection';
import { Box, Container, Grid } from '@mui/material';
import campingThumbnail from '../../assets/images/accommodation-cards/camping-thumbnail.jpg';
import cottagesThumbnail from '../../assets/images/accommodation-cards/cottages-thumbnail.jpg';
import hostelThumbnail from '../../assets/images/accommodation-cards/hostel-thumbnail.jpg';

function Home() {
  return (
    <div>
      <Hero />
      <Box sx={{ bgcolor: '#FAF6EE' }}>
        <Container maxWidth='xl' sx={{ py: 8 }}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <AccommodationCard
                title="Camping"
                description="Upplev campinglivets charm med havsbrisen som sällskap och bekvämligheter inom räckhåll."
                imageUrl={campingThumbnail}
                link="/accommodation/camping"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AccommodationCard
                title="Stugor"
                description="Våra mysiga stugor erbjuder en perfekt balans mellan naturupplevelse och hemtrevlig komfort."
                imageUrl={cottagesThumbnail}
                link="/accommodation/cottages"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AccommodationCard
                title="Vandrarhem"
                description="Vårt vandrarhem kombinerar prisvärdhet med trivsam gemenskap, idealiskt för äventyrslystna resenärer."
                imageUrl={hostelThumbnail}
                link="/accommodation/hostel"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <ActivitiesSection />
      <RestaurantSection />
      <MapSection />
    </div>
  );
}

export default Home;
