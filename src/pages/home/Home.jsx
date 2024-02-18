import React from 'react';
import Hero from '../../components/hero/Hero';
import AccommodationCard from '../../components/AccommodationCard/AccommodationCard';
import Box from '@mui/material/Box'; // Import Box from MUI
import campingThumbnail from '../../assets/images/accommodation-cards/camping-thumbnail.jpg';
import cottagesThumbnail from '../../assets/images/accommodation-cards/cottages-thumbnail.jpg';
import hostelThumbnail from '../../assets/images/accommodation-cards/hostel-thumbnail.jpg';

function Home() {
  return (
    <div>
      <Hero />
      <Box
        sx={{
          display: 'flex', // Apply Flexbox
          flexWrap: 'wrap', // Allow items to wrap
          justifyContent: 'center', // Center items horizontally
          gap: 2, // Space between items
          p: 3, // Padding around the container for some breathing room
        }}
      >
        <AccommodationCard
          title="Camping"
          description="Enjoy a night under the stars and reconnect with nature."
          imageUrl={campingThumbnail}
          link="/camping"
        />
        <AccommodationCard
          title="Cottages"
          description="Cozy up in our comfortable cottages for a more private experience."
          imageUrl={cottagesThumbnail}
          link="/cottages"
        />
        <AccommodationCard
          title="Hostel"
          description="Meet fellow travelers in our friendly and affordable hostel."
          imageUrl={hostelThumbnail}
          link="/hostel"
        />
      </Box>
    </div>
  );
}

export default Home;