import React from 'react';
import { Box, Grid, Container, Skeleton, Card, CardMedia, CardContent, Typography } from '@mui/material';
import beachImage from '../../assets/images/beach/beach.jpg';
import runningTrailImage from '../../assets/images/activities/running-trail.jpg';
import kayakImage from '../../assets/images/activities/kayak.jpg';

function Activities() {
  const activities = [
    { title: 'Stranden', description: 'Upplev den vackra sandstranden med aktiviteter för hela familjen.', imageUrl: beachImage },
    { title: 'Motionsspår', description: 'Ta en löprunda eller en avkopplande promenad längs våra natursköna spår.', imageUrl: runningTrailImage },
    { title: 'Kajak', description: 'Upplev spänningen och det rogivande vattnet när du paddlar kajak längs Hudiksvalls kustlinje.', imageUrl: kayakImage },
    { title: 'Minigolf', description: 'Testa din precision och ha kul med familj och vänner på vår utmanande minigolfbana.', imageUrl: '' },
  ];

  return (
    <>
    <Box sx={{ bgcolor: '#FAF6EE', minHeight: '100vh' }}>
      <Box sx={{ pt: 'calc(70px + 75px)', pb: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom>
            Saker att göra...
          </Typography>
          <Typography sx={{ fontSize: '18px' }}>
            Utforska alla roliga och spännande aktiviteter som Malnbaden har att erbjuda.
          </Typography>
        </Container>
      </Box>
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="flex-start">
            {activities.map((activity, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */, overflow: 'hidden' }}>
                  {activity.imageUrl ? (
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
                  ) : (
                    <Skeleton variant="rectangular" sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%' // Adjust this if necessary to match the aspect ratio height
                    }} />
                  )}
                </Box>

                  <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                      {activity.title}
                    </Typography>
                    <Typography sx={{ minHeight: '70px' }} variant="body3" component="div">
                      {activity.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {/* Skeletons for "Coming Soon" activities */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <Skeleton variant="rectangular" width="100%" height={165} />
                <CardContent>
                  <Skeleton variant="text" sx={{ width: '40%', minHeight:{ lg: '75px', sm: '50px' }, marginBottom: '-10px' }} />
                  <Skeleton variant="text" width="100%" height='100px' />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Card>
                <Skeleton variant="rectangular" width="100%" height={165} />
                <CardContent>
                  <Skeleton variant="text" sx={{ width: '40%', minHeight:{ lg: '75px', sm: '50px' }, marginBottom: '-10px' }} />
                  <Skeleton variant="text" width="100%" height='100px'/>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
    </>
  );
}

export default Activities;
