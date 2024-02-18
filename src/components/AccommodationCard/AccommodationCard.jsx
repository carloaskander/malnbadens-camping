import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

function AccommodationCard({ title, description, imageUrl, link }) {
  return (
    <Card 
      sx={{
        flex: '1 1 auto',
        width: '100%',
        maxWidth: { sm: 375 },
        mb: 2, // Margin bottom for spacing between cards
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          height: 200,
          objectFit: 'cover',
        }}
      />
      <CardContent
        sx={{
          // Styles specific to the content area
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold', // Makes the title bold
            color: 'text.primary', // Use the primary color from the theme
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
          }}
        >
          {description}
        </Typography>
        <Button
          size="medium"
          href={link}
          sx={{
            mt: 1, // Margin top for spacing above the button
            color: 'white', // Text color for the button
            '&:hover': {
              backgroundColor: 'primary.dark', // Darken the button on hover
            },
          }}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}

export default AccommodationCard;
