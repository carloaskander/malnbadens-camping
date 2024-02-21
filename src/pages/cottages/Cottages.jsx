import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";

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

  return (
    <Box sx={{ marginTop: 'var(--navbar-min-height)' }}>
      <PhotoGallery images={imageUrls} />
      <Typography variant="h2" component="h1" gutterBottom>
        {cottagesContent.pageTitle}
      </Typography>
      <Typography variant="body1">
        {cottagesContent.pageDescription}
      </Typography>
    </Box>
  );
}

export default Cottages;
