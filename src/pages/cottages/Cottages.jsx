import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import Icon from '@mui/material/Icon';

function Cottages() {
  const [cottagesContent, setCottagesContent] = useState(null);

  useEffect(() => {
    contentfulClient.getEntries({
      content_type: 'accommodation',
      'fields.entryTitle': 'Cottages Page'
    })
    .then((response) => {
      if (response.items.length > 0) {
        setCottagesContent(response.items[0].fields);
      }
    })
    .catch(console.error);
  }, []);

  if (!cottagesContent) return <p>Loading...</p>;

  const imageUrls = cottagesContent.photoGallery?.map(photo => photo.fields.file.url) || [];

  const amenities = [
    { name: "kitchen", icon: "kitchen" },
    { name: "shower", icon: "shower" },
    // Add more amenities as needed
  ];

  return (
    <Box sx={{ marginTop: 'var(--navbar-min-height)' }}>
      <Box mb={6}>
        <PhotoGallery images={imageUrls} />
      </Box>

      <Container maxWidth="lg">
        <Container sx={{ padding: '30px', backgroundColor: '#fff', boxShadow: '-4px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <Grid container spacing={8} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={12} md={7}>
                <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                  {cottagesContent.pageTitle}
                </Typography>
                <Typography variant="body1">
                  {cottagesContent.pageDescription}
                </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ padding: 4, boxShadow: '-8px 8px 10px rgba(0, 0, 0, 0.1)' }}>
                <Typography mb={3} variant="h3">Make a Reservation</Typography>
                <Button variant="contained" sx={{ width: '100%' }}>Book Now</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography mb={2} variant="h5">Amenities</Typography>
              <Box>
              {amenities.map((amenity) => (
                <Box key={amenity.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '8px' }}>
                  <Icon sx={{ color: 'secondary.main' }}>{amenity.icon}</Icon>
                  <Typography variant='body1'>{amenity.name}</Typography>
                </Box>
              ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography mb={2} variant='h5'>Facts</Typography>
              <Typography>Available Cottages: 10</Typography>
              {/* Add more facts as needed */}
            </Grid>
          </Grid>
        </Container>
      </Container>
    </Box>
  );
}

export default Cottages;
