import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './PhotoGallery.css'; // Import the custom CSS
import { Box } from '@mui/material'; // Use MUI for layout

const PhotoGallery = ({ images }) => {
    const items = images.map(image => ({
        original: image,
        thumbnail: image
    }));

    return (
        <Box 
            sx={{ 
                maxWidth: '1200px', 
                width: '100%', 
                margin: '0 auto', 
                backgroundColor: '#faf6ee', 
                padding: 2 
            }}
            >
            <ImageGallery 
                items={items} 
                showThumbnails={true}
                showFullscreenButton={true}
                showPlayButton={true}
                autoPlay={true}
                slideDuration={300}
                slideInterval={4500}
            />
        </Box>
    );
};

export default PhotoGallery;
