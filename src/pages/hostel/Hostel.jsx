import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";
import Icon from '@mui/material/Icon';

function Hostel() {
  const [hostelContent, setHostelContent] = useState(null);

  useEffect(() => {
    contentfulClient.getEntries({
      content_type: 'accommodation',
      'fields.entryTitle': 'Hostel Page'
    })
    .then((response) => {
      if (response.items.length > 0) {
        setHostelContent(response.items[0].fields);
      }
    })
    .catch(console.error);
  }, []);

  if (!hostelContent) return <p>Loading...</p>;

  const imageUrls = hostelContent.photoGallery?.map(photo => photo.fields.file.url) || [];

  const amenities = [
    { name: "shared kitchen", icon: "kitchen" },
    { name: "locker", icon: "lock" },
    // Add more amenities specific to the hostel
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
                  {hostelContent.pageTitle}
                </Typography>
                <Typography variant="body1">
                  {hostelContent.pageDescription}
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
              <Typography>Rooms available: 20</Typography>
              {/* Add more facts as needed */}
            </Grid>
          </Grid>
        </Container>
      </Container>
    </Box>
  );
}

export default Hostel;
