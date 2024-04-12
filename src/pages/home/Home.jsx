import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@mui/material';
import Hero from '../../components/hero/Hero';
import AccommodationCard from '../../components/AccommodationCard/AccommodationCard';
import ActivitiesSection from '../../components/activities-section/ActivitiesSection';
import RestaurantSection from '../../components/restaurant-section/RestaurantSection';
import MapSection from '../../components/map-section/MapSection';
import campingThumbnail from '../../assets/images/accommodation-cards/camping-thumbnail.jpg';
import cottagesThumbnail from '../../assets/images/accommodation-cards/cottages-thumbnail.jpg';
import hostelThumbnail from '../../assets/images/accommodation-cards/hostel-thumbnail.jpg';

function Home() {
  return (
    <div>
      <Helmet>
        <title>Malnbadens Camping - Upplev hav, stad och natur</title>
        <meta name="description" content="Besök Malnbadens Camping i Hudiksvall för en avkopplande upplevelse nära både stad och natur. Våra campingplatser, stugor och vandrarhem erbjuder bekvämt boende för alla besökare." />
        <meta name="keywords" content="Malnbadens Camping, camping Hudiksvall, stuga Hudiksvall, vandrarhem Hudiksvall, strand camping Sverige, camping Sweden, best campsites Sweden, Hudiksvall cabins, Malnbaden cabins, Malnbaden beach" />
        <meta property="og:title" content="Malnbadens Camping - Upplev hav, stad och natur" />
        <meta property="og:description" content="Besök Malnbadens Camping i Hudiksvall för en avkopplande upplevelse nära både stad och natur. Våra campingplatser, stugor och vandrarhem erbjuder bekvämt boende för alla besökare." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.malnbadenscamping.se" />
        <meta property="og:image" content="https://images.ctfassets.net/l5zpxv35osem/4J3hJTniRiVA9nGLsGfzVe/8ad70dbc212c0d27e13d0b737bfb389f/1D5A2860.jpg" />
        <link rel="canonical" href="https://www.malnbadenscamping.se" />
      </Helmet>
      <script type="application/ld+json">
        {`
          {
            "@context": "http://schema.org",
            "@type": "Organization",
            "name": "Malnbadens Camping",
            "url": "https://www.malnbadenscamping.se",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+0650-132 60",
              "contactType": "customer service"
            }],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Malnvägen 34",
              "addressLocality": "Hudiksvall",
              "postalCode": "82456",
              "addressCountry": "SE"
            },
            "sameAs": [
              "https://www.facebook.com/p/Malnbadens-Camping-Vandrarhem-Hudiksvall-100053636355088/",
              "https://www.instagram.com/malnbadenscamping/"
            ],
            "image": "https://images.ctfassets.net/l5zpxv35osem/4J3hJTniRiVA9nGLsGfzVe/8ad70dbc212c0d27e13d0b737bfb389f/1D5A2860.jpg"
          }
        `}
      </script>
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
