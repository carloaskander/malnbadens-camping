import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Container, Card, CardMedia, CardContent, Typography } from '@mui/material';
import beachSoccerImage from '../../assets/images/beach/beach-soccer.webp';
import runningTrailImage from '../../assets/images/activities/running-trail.jpg';
import kayakImage from '../../assets/images/activities/kayak.jpg';
import miniGolfImage from '../../assets/images/activities/minigolf.jpeg';
import AnimatedSection from '../../components/animated-section/AnimatedSection.jsx'; // Importera AnimatedSection

function Activities() {
  const { t } = useTranslation();

  const activities = [
    { 
      title: t('activitiesPage.activities.beach.title'), 
      description: t('activitiesPage.activities.beach.description'), 
      imageUrl: beachSoccerImage 
    },
    { 
      title: t('activitiesPage.activities.runningTrail.title'), 
      description: t('activitiesPage.activities.runningTrail.description'), 
      imageUrl: runningTrailImage 
    },
    { 
      title: t('activitiesPage.activities.kayak.title'), 
      description: t('activitiesPage.activities.kayak.description'), 
      imageUrl: kayakImage 
    },
    { 
      title: t('activitiesPage.activities.miniGolf.title'), 
      description: t('activitiesPage.activities.miniGolf.description'), 
      imageUrl: miniGolfImage 
    },
  ];

  return (
    <>
      <Box sx={{ bgcolor: '#FAF6EE', minHeight: '100vh' }}>
        <Box sx={{ pt: 'calc(70px + 75px)', pb: 8, textAlign: 'center' }}>
          <Container maxWidth="lg">
          <AnimatedSection direction="right">
            <Typography variant="h2" gutterBottom>
              {t('activitiesPage.title')}
            </Typography>
          </AnimatedSection>
          <AnimatedSection direction="left" delay={0.2}>
            <Typography sx={{ fontSize: '18px' }}>
              {t('activitiesPage.description')}
            </Typography>
          </AnimatedSection>
          </Container>
        </Box>
        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="flex-start">
              {activities.map((activity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <AnimatedSection direction='right' delay={0.4 + index * 0.2}>
                    <Card>
                      <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={activity.imageUrl}
                          alt={activity.title}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                          {activity.title}
                        </Typography>
                        <Typography sx={{ minHeight: '70px' }} variant="body2" component="div">
                          {activity.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Activities;
