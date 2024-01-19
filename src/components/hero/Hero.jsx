import React from 'react';
import './Hero.css';

import hero from '../../assets/images/hero/hero-image-1.jpg'

// MATERIAL-UI IMPORTS
import { Typography, Button } from '@mui/material';

function Hero() {
  return (
    <div className="hero-container">
      <img src={hero} alt="Campsite" className="hero-image" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <Typography variant="h4" component="h1" style={{ fontStyle: 'italic' }} className="hero-title">
          Welcome to our Campsite
        </Typography>
        <Typography variant="h6" component="h2" style={{ fontStyle: 'italic', marginBottom: '20px' }} className="hero-subtitle">
          Experience sea, city and nature.
        </Typography>
        <Button variant="contained" color="secondary" className="hero-cta"
        sx={{
          padding: '10px 20px',
          backgroundColor: 'var(--secondary-color)', // Ensure this variable is defined
          color: 'white',
          border: 'none',
          borderRadius: '1px',
          cursor: 'pointer',
          fontSize: '1.125rem',
        }}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}


export default Hero;
