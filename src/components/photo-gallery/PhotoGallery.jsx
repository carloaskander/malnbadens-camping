import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function PhotoGallery({ images }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pauseTimer, setPauseTimer] = useState(null);

    const handlePrev = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setIsFading(false);
        }, 400);
        pauseAutoPlay();
    };

    const handleNext = () => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            setIsFading(false);
        }, 400);
        pauseAutoPlay();
    };

    const pauseAutoPlay = () => {
        if (pauseTimer) {
            clearTimeout(pauseTimer);  // Clear the existing timer if it's set
        }
        setAutoPlay(false);
        setPauseTimer(setTimeout(() => {
            setAutoPlay(true);  // Resume auto play after 10 seconds
        }, 10000));
    };

    useEffect(() => {
        let timer;
        if (autoPlay) {
            timer = setInterval(handleNext, 4500);  // Change image every 4.5 seconds
        }

        // Clean up the interval and timeout on component unmount
        return () => {
            clearInterval(timer);
            clearTimeout(pauseTimer);
        };
    }, [images.length, autoPlay]);

    return (
        <Box sx={{
            bgcolor: '#f8f8f8',
            overflow: 'hidden',
            width: '100%',
            boxShadow: 'inset 0 0px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Box maxWidth="lg" sx={{
                position: 'relative',
                width: '100%',
                padding: 5,
            }}>
                {/* Main Image Display */}
                <Box component="img" src={images[currentImageIndex]} alt="" sx={{
                    width: '100%',
                    height: { xs: '300px', sm: '500px' },
                    objectFit: 'cover',
                    transition: 'opacity 0.5s ease-in-out',
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
                    zIndex: 2,
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
                    zIndex: 2,
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
                        }} onClick={() => {
                            setCurrentImageIndex(index);
                            pauseAutoPlay();  // Also pause autoPlay when indicators are clicked
                        }} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default PhotoGallery;
