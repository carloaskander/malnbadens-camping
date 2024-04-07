import React from 'react';
import { Box, Grid, Container, Card, CardMedia, CardContent, Typography } from '@mui/material';

function Activities() {
  const activities = [
    { title: 'Strand', description: 'Description 1', imageUrl: '../../assets/images/beach/beach-ladder.jpg' },
    { title: 'Motionsspår', description: 'Description 2', imageUrl: '../../assets/images/activities/running-trail.jpg' },
    { title: 'Aktivitet 3', description: 'Description 3', imageUrl: 'image-url-3' },
  ];

  return (
    <Box sx={{ bgcolor: '#FAF6EE', py: 8 }}> {/* Add padding and background color here */}
      <Container maxWidth="xl">
        <Grid container spacing={2} justifyContent="center">
          {activities.map((activity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={activity.imageUrl}
                  alt={activity.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Activities;
