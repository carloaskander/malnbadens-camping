import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import beachLadderImage from '../../assets/images/beach/beach-ladder.jpg';
import runningTrailImage from '../../assets/images/activities/running-trail.jpg';

function ActivitiesSection() {
  const activities = [
    {
      title: 'Strand',
      description: 'Endast 150 meter från campingen finner du Malnbadens strand med dess populära strandrestaurang, känd för god mat, härlig stämning och roliga evenemang. Stranden är även utrustad med planer för beachvolleyboll och strandfotboll, perfekt för de som söker aktivitet och spel under sommardagarna. För hundägare finns ett särskilt avsnitt på stranden där fyrbenta vänner är välkomna att leka och svalka sig i vattnet.',
      imageUrl: beachLadderImage,
      imageStyle: {
        width: '100%', // Default width
        maxWidth: '500px',
        height: '575px', // Adjust the height as needed
        // Add more styles as needed
      },
    },
    {
      title: 'Motionsspår',
      description: 'Motionsspåret vid Malnbadens camping erbjuder flera olika rutter i varierande längder, vilket gör det till ett perfekt ställe för löpning, promenader och naturupplevelser. För de som föredrar rullskridskor, rullskidor eller cykling finns särskilda banor och vägar anpassade för varje aktivitet. I närheten hittar du även en Dirt Jump-bana för de som söker adrenalinfyllda hopp och utmaningar på cykel.',
      imageUrl: runningTrailImage,
      imageStyle: {
        width: '100%', // Default width
        maxWidth: '500px',
        height: '575px', // Adjust the height as needed
        // Add more styles as needed
      },
    },
    // Add more activities as needed
  ];

  return (
    <Box sx={{ py: 8, bgcolor: '#FAF6EE' }}>
      <Container maxWidth='lg'>
        <Typography variant="h2" gutterBottom sx={{ mb: 8, textAlign: 'center' }}>
          AKTIVITETER
        </Typography>
        
        {activities.map((activity, index) => (
          <Grid container spacing={4} alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'} key={index}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h3" gutterBottom>
                      {activity.title}
                    </Typography>
                    <Typography variant="body1">
                      {activity.description}
                    </Typography>
                  </Grid>
            <Grid item xs={12} md={6} mb={8}>
              <Box
                sx={{
                  ...activity.imageStyle,
                  backgroundImage: `url(${activity.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </Grid>
          </Grid>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Mer Aktiviteter
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ActivitiesSection;
