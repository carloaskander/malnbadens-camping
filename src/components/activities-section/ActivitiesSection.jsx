import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { Box, Typography, Button, Grid, Container } from '@mui/material';

import AnimatedSection from '../animated-section/AnimatedSection.jsx';

import beachDroneImage from '../../assets/images/beach/beach-drone.webp';
import beachSoccerRestaurantImage from '../../assets/images/beach/beach-soccer-restaurant.webp';
import runningTrailImage from '../../assets/images/activities/running-trail.jpg';


function ActivitiesSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;
  
  const handleClick = () => {
    navigate(`/${currentLanguage}/activities`);
  };

  const activities = [
    {
      title: t('activitiesSection.beach.title'),
      description: t('activitiesSection.beach.description'),
      imageUrl: beachDroneImage,
      imageStyle: {
        width: '100%', // Default width
        maxWidth: '450px',
        height: { xs:'500px', md: '550' }, // Adjust the height as needed
        border: '10px solid white',
        // Add more styles as needed
      },
      polaroid: {
        imageUrl: beachSoccerRestaurantImage,
        style: {
          position: 'absolute',
          bottom: { xs: '-17%', md: '-10%' },
          left: { xs: '35%', sm: '45%', md: '5%' },
          width: { xs: '250px', md: '250px' },
          height: { xs: '300px', md: '300px' }, // Adjusted for responsiveness
          zIndex: 2,
          backgroundSize: 'cover', // Cover effect
          backgroundPosition: 'center', // Center the background image
          border: '15px solid white',
          borderBottom: '70px solid white',
          boxShadow: '1px 1px 0px 1px rgba(0,0,0,0.1)',
        },
      },
    },
    {
      title: t('activitiesSection.runningTrail.title'),
      description: t('activitiesSection.runningTrail.description'),
      imageUrl: runningTrailImage,
      imageStyle: {
        width: '100%', // Default width
        maxWidth: '450px',
        height: '550px', // Adjust the height as needed
        border: '10px solid white',
        // Add more styles as needed
      },
    },
    // Add more activities as needed
  ];
  

  return (
    <Box>
        <Container maxWidth='lg'>
          <AnimatedSection direction='left'>
            <Typography variant="h2" gutterBottom sx={{ mb: 8, textAlign: 'center' }}>
              {t('activitiesSection.title')}
            </Typography>
          </AnimatedSection>
          {activities.map((activity, index) => (
            <Grid container spacing={ {xs: 2, md: 10} } alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'} key={index} mb={4}>
                      <Grid item xs={12} md={6}>
                        <AnimatedSection direction='right'>
                          <Typography variant="h3" gutterBottom>
                            {activity.title}
                          </Typography>
                          <Typography variant="body1">
                            {activity.description}
                          </Typography>
                        </AnimatedSection>
                      </Grid>
              <Grid item xs={12} md={6} mb={15} sx={{ position: 'relative', }}>
                <LazyLoad once offset={200} placeholder={<Box sx={{ height: 300, backgroundColor: 'grey.200' }} />}>
                  <Box
                    sx={{
                      ...activity.imageStyle,
                      backgroundImage: `url(${activity.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {activity.polaroid && (
                    <Box
                      sx={{
                        ...activity.polaroid.style,
                        backgroundImage: `url(${activity.polaroid.imageUrl})`,
                        // Rest of the polaroid styles, make sure to add position: 'absolute' if you want to position it inside the relative container
                        }}
                    />
                  )}
                </LazyLoad>
              </Grid>
            </Grid>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant='contained' onClick={handleClick}>
            {t('activitiesSection.button')}
            </Button>
          </Box>
        </Container>
      </Box>
  );
}

export default ActivitiesSection;
