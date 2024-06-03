import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const AnimatedSection = ({ children, direction = 'left', delay = 0 }) => {
    const ref = useRef();
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(ref.current);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -100 : 100,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                delay: delay,
            },
        },
    };

    return (
        <Box ref={ref}>
            <motion.div
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={variants}
            >
                {children}
            </motion.div>
        </Box>
    );
};

export default AnimatedSection;
