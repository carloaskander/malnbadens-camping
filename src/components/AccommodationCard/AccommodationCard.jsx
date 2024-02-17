import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

function AccommodationCard({ title, description, imageUrl, link }) {
  return (
    <Card 
      sx={{
        flex: '1 1 auto',
        Width: '100%', // Minimum width of the card
        maxWidth: { sm: 375 },
        mb: 2, // Margin bottom for spacing between cards
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={title}
        sx={{
          // You can add specific styles for CardMedia if needed
        }}
      />
      <CardContent
        sx={{
          // Styles specific to the content area, if needed
        }}
      >
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button 
          size="small" 
          href={link}
          sx={{
            mt: 1, // Margin top for spacing above the button
            // Additional button styles if needed
          }}
        >Learn More</Button>
      </CardContent>
    </Card>
  );
}

export default AccommodationCard;