import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient.js";
import { Box, Typography } from '@mui/material';

function Camping() {
  const [campingContent, setCampingContent] = useState(null);

  useEffect(() => {
    contentfulClient.getEntries({
      content_type: 'accommodation', // Updated to the correct content type ID
      'fields.entryTitle': 'Camping Page' // Assuming you use this field to identify the Camping page uniquely
    })
    .then((response) => {
      if (response.items.length > 0) {
        // Assuming the first entry is the one you want
        setCampingContent(response.items[0].fields);
      }
    })
    .catch(console.error);
  }, []);

  if (!campingContent) return <p>Loading...</p>;

  return (
    <Box sx={{ padding: 3 }}> {/* Added padding for styling */}
      <Typography variant="h2" component="h1" gutterBottom>
        {campingContent.pageTitle} {/* Updated field name to match your content model */}
      </Typography>
      <Typography variant="body1">
        {campingContent.pageDescription} {/* Updated field name to match your content model */}
      </Typography>
      {/* Assuming photo gallery is an array of image assets */}
      {campingContent.photoGallery && campingContent.photoGallery.map((photo, index) => (
        <Box key={index} component="img" src={photo.fields.file.url} alt={photo.fields.title} sx={{ width: '100%', height: 'auto', marginBottom: 2 }} />
      ))}
    </Box>
  );
}

export default Camping;
