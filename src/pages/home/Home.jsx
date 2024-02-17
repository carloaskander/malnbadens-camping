import React from 'react';
import Hero from '../../components/hero/Hero';
import AccommodationCard from '../../components/AccommodationCard/AccommodationCard';
import Box from '@mui/material/Box'; // Import Box from MUI

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
          imageUrl="/images/camping.jpg"
          link="/camping"
        />
        <AccommodationCard
          title="Cottages"
          description="Cozy up in our comfortable cottages for a more private experience."
          imageUrl="/images/cottages.jpg"
          link="/cottages"
        />
        <AccommodationCard
          title="Hostel"
          description="Meet fellow travelers in our friendly and affordable hostel."
          imageUrl="/images/hostel.jpg"
          link="/hostel"
        />
      </Box>
    </div>
  );
}

export default Home;