import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import LazyLoad from 'react-lazyload';
import beachLadderImage from '../../assets/images/beach/beach-ladder.jpg';
import runningTrailImage from '../../assets/images/activities/running-trail.jpg';
import beachDockImage from '../../assets/images/beach/beach-dock.jpg';

function ActivitiesSection() {
  const activities = [
    {
      title: 'Strand',
      description:
        'Endast 150 meter från campingen finner du Malnbadens strand med dess populära strandrestaurang, känd för god mat, härlig stämning och roliga evenemang. Stranden är även utrustad med planer för beachvolleyboll och strandfotboll, perfekt för de som söker aktivitet och spel under sommardagarna. För hundägare finns ett särskilt avsnitt på stranden där fyrbenta vänner är välkomna att leka och svalka sig i vattnet.',
      imageUrl: beachDockImage,
      imageStyle: {
        width: '100%', // Default width
        maxWidth: '450px',
        height: { xs:'500px', md: '550' }, // Adjust the height as needed
        border: '10px solid white',
        // Add more styles as needed
      },
      polaroid: {
        imageUrl: beachLadderImage,
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
      title: 'Motionsspår',
      description:
        'Motionsspåret vid Malnbadens camping erbjuder flera olika rutter i varierande längder, vilket gör det till ett perfekt ställe för löpning, promenader och naturupplevelser. För de som föredrar rullskridskor, rullskidor eller cykling finns särskilda banor och vägar anpassade för varje aktivitet. I närheten hittar du även en Dirt Jump-bana för de som söker adrenalinfyllda hopp och utmaningar på cykel.',
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
    <Box sx={{ py: 8, bgcolor: '#FAF6EE' }}>
      <Container maxWidth='lg'>
        <Typography variant="h2" gutterBottom sx={{ mb: 8, textAlign: 'center' }}>
          AKTIVITETER
        </Typography>
        
        {activities.map((activity, index) => (
          <Grid container spacing={ {xs: 2, md: 10} } alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'} key={index} mb={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h3" gutterBottom>
                      {activity.title}
                    </Typography>
                    <Typography variant="body1">
                      {activity.description}
                    </Typography>
                  </Grid>
            <Grid item xs={12} md={6} mb={15} sx={{ position: 'relative', }}>
              <LazyLoad once offset={100} placeholder={<Box sx={{ height: 300, backgroundColor: 'grey.200' }} />}>
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
          <Button variant="contained">
            Mer Aktiviteter
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ActivitiesSection;
