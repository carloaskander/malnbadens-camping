import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import LazyLoad from 'react-lazyload';
import restaurantImage1 from '../../assets/images/restaurant/restaurant-sign.jpg';
import restaurantImage2 from '../../assets/images/restaurant/restaurant-food-bbq.jpg';

function RestaurantSection() {
  const images = [
    {
      src: restaurantImage1,
      alt: 'Beachside Restaurant',
      style: {
        position: 'absolute',
        top: { xs: '5%', md: '10%' },
        left: { xs: '10%', md: '18%' },
        width: { xs: '90%', md: '78%' },
        height: { xs: '90%', md: '100%' }, // Adjusted for responsiveness
        zIndex: 1,
        backgroundSize: 'cover', // Ensure the image covers the area
        backgroundPosition: 'center right', // Center the background image
        border: '10px solid white',
      },
    },
    {
      src: restaurantImage2,
      alt: 'Delicious Cuisine',
      style: {
        position: 'absolute',
        top: { xs: '50%', md: '65%' },
        left: { xs: '5%', md: '5%' },
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
    // Add more images as needed
  ];

  return (
    <Box sx={{ py: 8, px: 2, bgcolor: '#FAF6EE', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3">
              Strandnära Restaurang
            </Typography>
            <Typography variant='h5' gutterBottom>
              Maln Hav & Krog
            </Typography>
            <Typography sx={{ mb: 3 }}>
            Med sin varierade meny och enastående utsikt över havet lockar restaurangen både lokalbefolkningen och besökare. Här samlas människor för att njuta av solen, livliga evenemang och den avslappnade atmosfären. Bara ett stenkast från campingen hittar du en samlingspunkt för god mat och gemenskap.
            </Typography>
            <Button variant="contained" href='/restaurant'>
              Mer Info
            </Button>
          </Grid>
          {/* Image Container */}
          <Grid item xs={12} md={6} mb={12} sx={{ position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {images.map((image, index) => (
              <LazyLoad key={index} once offset={200} placeholder={<Box sx={{ height: 300, backgroundColor: 'grey.200' }} />}>
                <Box
                  sx={{
                    ...image.style,
                    backgroundImage: `url(${image.src})`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </LazyLoad>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default RestaurantSection;
