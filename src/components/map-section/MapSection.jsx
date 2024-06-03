import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container } from '@mui/material';

import AnimatedSection from '../animated-section/AnimatedSection.jsx';

function MapSection() {
  const { t } = useTranslation();
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4284.628849544789!2d17.16882598623433!3d61.71999865100633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4666a86ea3138b93%3A0x8cbdb97b6d603dcf!2sMalnbadens%20Camping%20%26%20Vandrarhem!5e0!3m2!1ssv!2sse!4v1710938059448!5m2!1ssv!2sse";

  return (
    <Box sx={{ py: 8, px: 2 }}>
        <Container maxWidth="lg">
          <AnimatedSection direction='right'>
            <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
              {t('mapSection.title')}
            </Typography>
          </AnimatedSection>
          <AnimatedSection direction='left'>
            <Box sx={{ width: '100%', overflow: 'hidden', mb: 3, display: 'flex', justifyContent: 'center' }}>
              <iframe
                title="campsite-map"
                src={mapUrl}
                style={{ border: 0, width: '100%', maxWidth: '1000px', height: '450px' }}
                allowFullScreen=""
              ></iframe>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" href="https://maps.google.com?q=Malnbadens%20Camping%20%26%20Vandrarhem" target="_blank">
                {t('mapSection.button')}
              </Button>
            </Box>
          </AnimatedSection>
        </Container>
      </Box>
  );
}

export default MapSection;
