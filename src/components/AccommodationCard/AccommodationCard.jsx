import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Container } from '@mui/material';

// Importera bilder med olika storlekar
import campingThumbnailSmall from '../../assets/images/accommodation-cards/camping-card/camping-thumbnail-small.webp';
import campingThumbnailMedium from '../../assets/images/accommodation-cards/camping-card/camping-thumbnail-medium.webp';

import cottagesThumbnailSmall from '../../assets/images/accommodation-cards/cottages-card/cottages-thumbnail-small.webp';
import cottagesThumbnailMedium from '../../assets/images/accommodation-cards/cottages-card/cottages-thumbnail-medium.webp';

import hostelThumbnailSmall from '../../assets/images/accommodation-cards/hostel-card/hostel-thumbnail-small.webp';
import hostelThumbnailMedium from '../../assets/images/accommodation-cards/hostel-card/hostel-thumbnail-medium.webp';

const accommodationOptions = [
  {
    title: "Camping",
    description: "Upplev campinglivets charm omgiven av grönska, med bekvämligheter inom räckhåll och nära till havet.",
    imageUrls: {
      medium: campingThumbnailMedium,
      small: campingThumbnailSmall,
    },
    link: "/accommodation/camping"
  },
  {
    title: "Stugor",
    description: "Våra mysiga stugor erbjuder en perfekt balans mellan naturupplevelse och hemtrevlig komfort.",
    imageUrls: {
      medium: cottagesThumbnailMedium,
      small: cottagesThumbnailSmall,
    },
    link: "/accommodation/cottages"
  },
  {
    title: "Vandrarhem",
    description: "Vårt vandrarhem kombinerar prisvärdhet med personlig komfort, idealiskt för resenärer som söker ett praktiskt och avkopplande boende.",
    imageUrls: {
      medium: hostelThumbnailMedium,
      small: hostelThumbnailSmall,
    },
    link: "/accommodation/hostel"
  }
];

function AccommodationCard() {
  return (
    <Box>
      <Container maxWidth='xl' sx={{ py: 8 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {accommodationOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{
                  flexGrow: 1,
                  boxShadow: 'none',
                  bgcolor: 'transparent',
                  '&:hover': {
                    boxShadow: '0px 6px 10px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img 
                    src={option.imageUrls.small} 
                    srcSet={`
                      ${option.imageUrls.small} 480w,
                      ${option.imageUrls.medium} 800w
                    `}
                    sizes="(max-width: 960px) 800px, 480px"
                    alt={option.title} 
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h4">{option.title}</Typography>
                  <Typography variant="body2" mb={2} sx={{ minHeight: '100px' }}>
                    {option.description}
                  </Typography>
                  <Button variant='contained' href={option.link}>
                    Info & Bokning
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default AccommodationCard;
