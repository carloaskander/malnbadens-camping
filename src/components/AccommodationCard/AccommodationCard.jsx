// AccommodationCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Container } from '@mui/material';

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
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
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
              color: 'white', // Text color for the button
              '&:hover': {
                  backgroundColor: 'primary.dark', // Darken the button on hover
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
