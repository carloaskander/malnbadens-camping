import React from 'react';
import { Box, Grid, Container, Card, CardMedia, CardContent, Typography } from '@mui/material';
import beachLadderImage from '../../assets/images/beach/beach-ladder.jpg';
import runningTrailImage from '../../assets/images/activities/running-trail.jpg'

function Activities() {
  const activities = [
    { title: 'Stranden', description: 'Upplev den vackra sandstranden med aktiviteter för hela familjen.', imageUrl: beachLadderImage },
    { title: 'Motionsspår', description: 'Ta en löprunda eller en avkopplande promenad längs våra natursköna spår.', imageUrl: runningTrailImage },
    { title: 'Aktivitet 3', description: 'Fördjupa dig i roliga aktiviteter som väntar på att utforskas.', imageUrl: 'image-url-3' },
    { title: 'Aktivitet 4', description: 'Fördjupa dig i roliga aktiviteter som väntar på att utforskas.', imageUrl: 'image-url-3' },
  ];

  return (
    <>
      <Box sx={{ bgcolor: '#FAF6EE', pt: 'calc(70px + 75px)', pb: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom>
            Saker att göra...
          </Typography>
          <Typography sx={{ fontSize: '18px' }}>
            Utforska alla roliga och spännande aktiviteter som Malnbaden har att erbjuda.
          </Typography>
        </Container>
      </Box>
      <Box sx={{ bgcolor: '#FAF6EE', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="center">
            {activities.map((activity, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */, overflow: 'hidden' }}>
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
                  <CardContent sx={{ minHeight: 140 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {activity.title}
                    </Typography>
                    <Typography variant="body3">
                      {activity.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Activities;
