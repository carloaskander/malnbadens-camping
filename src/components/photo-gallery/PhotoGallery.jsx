// In src/components/photo-gallery/PhotoGallery.jsx

import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function PhotoGallery({ images }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const handlePrev = () => {
        setIsFading(true); // Start fading out
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setIsFading(false); // Fade in the new image
        }, 250); // Half of your transition duration
    };
    const handleNext = () => {
        setIsFading(true); // Start fading out
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            setIsFading(false); // Fade in the new image
        }, 400); // Half of your transition duration
    };
    
    useEffect(() => {
        // Set up a timer for auto-sliding
        const timer = setInterval(() => {
            handleNext(); // Change to the next image at each interval
        }, 4500); // Change image every 3 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <Box sx={{
            bgcolor: '#f8f8f8', // Off-white background
            overflow: 'hidden',
            width: '100%', // Ensure it takes full width
            boxShadow: 'inset 0 0px 20px rgba(0,0,0,0.2)'
        }}>
            <Box sx={{
                position: 'relative',
                width: '100%', 
                padding: 5,
            }}>
                {/* Main Image Display */}
                <Box component="img" src={images[currentImageIndex]} alt="" sx={{
                    width: '100%', 
                    height: { xs: '300px', sm: '500px' }, // Adjust heights as needed
                    objectFit: 'cover',
                    transition: 'opacity 0.5s ease-in-out', // Smooth transition for opacity
                    opacity: isFading ? 0 : 1,
                }} />

                {/* Navigation Arrows */}
                <IconButton onClick={handlePrev} sx={{
                    position: 'absolute', 
                    left: 16, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#000',
                    bgcolor: '#fff',
                    boxShadow: '0px 0px 10px 3px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: 'secondary.main', color: '#fff' },
                    zIndex: 2, // Ensure arrows are above indicators
                }}>
                    <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton onClick={handleNext} sx={{
                    position: 'absolute', 
                    right: 16, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#000',
                    bgcolor: '#fff', 
                    boxShadow: '0px 0px 10px 3px rgba(0,0,0,0.2)',
                    '&:hover': { bgcolor: 'secondary.main', color: '#fff' },
                    zIndex: 2, // Ensure arrows are above indicators
                }}>
                    <ArrowForwardIosIcon />
                </IconButton>

                {/* Image Indicators */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10px',
                }}>
                    {images.map((_, index) => (
                        <Box key={index} sx={{
                            width: '25px',
                            height: '5px',
                            bgcolor: index === currentImageIndex ? 'secondary.main' : 'grey.400',
                            margin: '0 4px',
                            transition: 'background-color 0.3s ease',
                            '&:hover': { bgcolor: 'secondary.dark' },
                            cursor: 'pointer',
                        }} onClick={() => setCurrentImageIndex(index)} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default PhotoGallery;
