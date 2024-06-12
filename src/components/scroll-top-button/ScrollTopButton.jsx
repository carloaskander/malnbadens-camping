import React, { useState, useEffect } from 'react';
import { Fab, useScrollTrigger, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Zoom in={visible}>
            <Fab
                onClick={scrollToTop}
                color="primary"
                aria-label="scroll back to top"
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    backgroundColor: '#D66B27', // Custom color
                    '&:hover': {
                        backgroundColor: '#A54A19', // Darker shade for hover
                    },
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
}

export default ScrollTopButton;
