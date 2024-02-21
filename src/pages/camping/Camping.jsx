import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery"; // Make sure the path is correct

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

  return (
    <Box sx={{ marginTop: 'var(--navbar-min-height)' }}>
      {/* PhotoGallery at the top */}
      <PhotoGallery images={imageUrls} /> 
      <Typography variant="h2" component="h1" gutterBottom>
        {campingContent.pageTitle}
      </Typography>
      <Typography variant="body1">
        {campingContent.pageDescription}
      </Typography>
      {/* Any additional content follows */}
    </Box>
  );
}

export default Camping;