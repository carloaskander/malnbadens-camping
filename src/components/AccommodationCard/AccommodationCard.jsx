import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import LazyLoad from 'react-lazyload';

function AccommodationCard({ title, description, imageUrl, link }) {
  return (
    <Card 
      sx={{
        mb: 2,
        flexGrow: 1,
        boxShadow: 'none',
        bgcolor: 'transparent',
        '&:hover': {
          boxShadow: '0px 4px 20px rgba(0,0,0,0.12)',
        },
      }}
    >
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */, overflow: 'hidden' }}>
          <LazyLoad height="100%" once offset={200} placeholder={<div style={{ height: '100%', background: 'grey' }} />}>
            <img
              alt={title}
              src={imageUrl}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
            />
          </LazyLoad>
        </Box>
        <CardContent>
          <Typography variant="h4" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.primary" mb={2} sx={{ minHeight: '100px' }}>
            {description}
          </Typography>
          <Button
            size="medium"
            href={link}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Info & Bokning
          </Button>
        </CardContent>
    </Card>
  );
}

export default AccommodationCard;
