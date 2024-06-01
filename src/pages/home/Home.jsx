import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@mui/material';
import Hero from '../../components/hero/Hero';
import AccommodationCard from '../../components/AccommodationCard/AccommodationCard';
import ActivitiesSection from '../../components/activities-section/ActivitiesSection';
import RestaurantSection from '../../components/restaurant-section/RestaurantSection';
import MapSection from '../../components/map-section/MapSection';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="keywords" content={t('meta.keywords')} />
        <meta property="og:title" content={t('meta.og.title')} />
        <meta property="og:description" content={t('meta.og.description')} />
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
              "telephone": "0650-132 60",
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
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAF6EE' }}>
        <AccommodationCard/>
        <ActivitiesSection />
        <RestaurantSection />
        <MapSection />
      </Box>
    </>
  );
}

export default Home;
