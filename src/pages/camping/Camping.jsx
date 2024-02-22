import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import Icon from '@mui/material/Icon';

function Camping() {
  const [campingContent, setCampingContent] = useState(null);

  useEffect(() => {
    contentfulClient.getEntries({
      content_type: 'accommodation',
      'fields.entryTitle': 'Camping Page'
    })
    .then((response) => {
      if (response.items.length > 0) {
        setCampingContent(response.items[0].fields);
      }
    })
    .catch(console.error);
  }, []);

  if (!campingContent) return <p>Loading...</p>;

  // Transform photoGallery into an array of URLs
  const imageUrls = campingContent.photoGallery?.map(photo => photo.fields.file.url) || [];

  const amenities = [
    { name: "wifi", icon: "wifi" },
    { name: "parking", icon: "local_parking" },
    // Add more amenities as needed
  ];

  return (
    <Box sx={{ marginTop: 'var(--navbar-min-height)' }}>

      {/* PhotoGallery */}
      <Box mb={6}>
        <PhotoGallery images={imageUrls} />
      </Box>

      {/* Content */}
      <Container maxWidth="lg">
        <Container sx={{ padding: '30px', backgroundColor: '#fff', boxShadow: '-4px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <Grid container spacing={8} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Title and description */}
            <Grid item xs={12} md={7}  sx={{ order: { xs: 1, md: 1 } }}>
                <Typography variant="h2" component="h1" color="text.primary" gutterBottom>
                  {campingContent.pageTitle}
                </Typography>
                <Typography variant="body1">
                  {campingContent.pageDescription}
                </Typography>
            </Grid>
            {/* Make a reservation */}
            <Grid item xs={12} md={5} sx={{ order: { xs: 4, md: 2 } }}>
              <Paper sx={{ padding: 4, boxShadow: '-8px 8px 10px rgba(0, 0, 0, 0.1)' }}>
                <Typography mb={3} variant="h3">Make a Reservation</Typography>
                <Button variant="contained" sx={{ width: '100%' }}>Book Now</Button>
              </Paper>
            </Grid>
            {/* Amenities */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 3 } }}>
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
            {/* Additional facts */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 3, md: 3 } }}>
              <Typography mb={2} variant='h5'>Facts</Typography>
              <Typography>Area: 35m2 grass pitches</Typography>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </Box>
  );
}

export default Camping;