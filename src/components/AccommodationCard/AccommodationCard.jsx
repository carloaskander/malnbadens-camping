import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Card, CardContent, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '../animated-section/AnimatedSection.jsx';

// Importera bilder med olika storlekar
import campingThumbnailSmall from '../../assets/images/accommodation-cards/camping-card/camping-thumbnail-small.webp';
import campingThumbnailMedium from '../../assets/images/accommodation-cards/camping-card/camping-thumbnail-medium.webp';

import cottagesThumbnailSmall from '../../assets/images/accommodation-cards/cottages-card/cottages-thumbnail-small.webp';
import cottagesThumbnailMedium from '../../assets/images/accommodation-cards/cottages-card/cottages-thumbnail-medium.webp';

import hostelThumbnailSmall from '../../assets/images/accommodation-cards/hostel-card/hostel-thumbnail-small-new.jpg';
import hostelThumbnailMedium from '../../assets/images/accommodation-cards/hostel-card/hostel-thumbnail-medium-new.jpg';

function createAccommodationOptions(t) {
  return [
    {
      title: t('accommodationCard.camping.title'),
      description: t('accommodationCard.camping.description'),
      imageUrls: {
        medium: campingThumbnailMedium,
        small: campingThumbnailSmall,
      },
      imagePosition: 'center center',
      link: "/accommodation/camping",
      button: t('accommodationCard.camping.button')
    },
    {
      title: t('accommodationCard.cottages.title'),
      description: t('accommodationCard.cottages.description'),
      imageUrls: {
        medium: cottagesThumbnailMedium,
        small: cottagesThumbnailSmall,
      },
      imagePosition: 'center top',
      link: "/accommodation/cottages",
      button: t('accommodationCard.cottages.button')
    },
    {
      title: t('accommodationCard.hostel.title'),
      description: t('accommodationCard.hostel.description'),
      imageUrls: {
        medium: hostelThumbnailMedium,
        small: hostelThumbnailSmall,
      },
      imagePosition: '50% 65%',
      link: "/accommodation/hostel",
      button: t('accommodationCard.hostel.button')
    }
  ];
}

function AccommodationCard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  const accommodationOptions = createAccommodationOptions(t);

  const handleNavigate = (path) => {
    navigate(`/${currentLanguage}${path}`);
  };

  return (
    <Box>
      <Container maxWidth='xl' sx={{ py: 8 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {accommodationOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AnimatedSection direction='right' delay={0.4 + index * 0.2} noDelayOnMobile={true}>
                <Card 
                  sx={{
                    flexGrow: 1,
                    boxShadow: 'none',
                    bgcolor: 'transparent',
                    '&:hover': {
                      boxShadow: '0px 6px 10px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: 0,
                    paddingBottom: '66.67%', // 3:2 aspect ratio (2/3 * 100%)
                    overflow: 'hidden', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}>
                    <img 
                      src={option.imageUrls.small} 
                      srcSet={`
                        ${option.imageUrls.small} 480w,
                        ${option.imageUrls.medium} 800w
                      `}
                      sizes="(max-width: 960px) 800px, 480px"
                      alt={option.title} 
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: option.imagePosition || 'center center'
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h4">{option.title}</Typography>
                    <Typography variant="body2" mb={2} sx={{ minHeight: '100px' }}>
                      {option.description}
                    </Typography>
                    <Button variant='contained' onClick={() => handleNavigate(option.link)}>
                      {option.button}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default AccommodationCard;
