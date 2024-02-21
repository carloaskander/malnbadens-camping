import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography } from '@mui/material';
import PhotoGallery from "../../components/photo-gallery/PhotoGallery";

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

  return (
    <Box sx={{ marginTop: 'var(--navbar-min-height)' }}>
      <PhotoGallery images={imageUrls} />
      <Typography variant="h2" component="h1" gutterBottom>
        {hostelContent.pageTitle}
      </Typography>
      <Typography variant="body1">
        {hostelContent.pageDescription}
      </Typography>
    </Box>
  );
}

export default Hostel;
