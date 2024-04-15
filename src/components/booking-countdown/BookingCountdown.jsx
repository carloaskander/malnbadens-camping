import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, CircularProgress } from '@mui/material';
import contentfulClient from '../../contentfulClient';
import moment from 'moment-timezone';
import 'moment/locale/sv';  // Import Swedish locale


function BookingCountdown() {
    const [currentTime, setCurrentTime] = useState(moment());
    const [dates, setDates] = useState({
        seasonOpenDate: null,
        seasonCloseDate: null,
        bookingOpenDate: null
    });

    useEffect(() => {
        moment.locale('sv');  // Set locale to Swedish
        const timer = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchDates() {
            const entry = await contentfulClient.getEntries({
                content_type: 'openingHours',
                'fields.entryTitle': 'Opening Hours'
            });
            if (entry.items.length > 0) {
                const { seasonOpenDate, seasonCloseDate, bookingOpenDate } = entry.items[0].fields;
                setDates({
                    seasonOpenDate: moment.tz(seasonOpenDate, "Europe/Stockholm"),
                    seasonCloseDate: moment.tz(seasonCloseDate, "Europe/Stockholm"),
                    bookingOpenDate: moment.tz(bookingOpenDate, "Europe/Stockholm")
                });
            }
        }
        fetchDates();
    }, []);

    const { seasonOpenDate, seasonCloseDate, bookingOpenDate } = dates;
    let content;

    if (!seasonOpenDate || !seasonCloseDate || !bookingOpenDate) {
        content = <CircularProgress color="secondary" />;
    } else if (currentTime > seasonCloseDate) {
        content = <Typography variant='h4' sx={{ color: 'red' }}>Stängt för säsongen</Typography>;
    } else if (currentTime < bookingOpenDate) {
        const weekBeforeBooking = bookingOpenDate.clone().subtract(7, 'days');
        const dayBeforeBooking = bookingOpenDate.clone().subtract(1, 'days');

        if (currentTime < weekBeforeBooking) {
            content = <Typography variant='h4' color='text.secondary' sx={{ fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>
                Bokning öppnar: <Box component='span' sx={{ color: 'yellow' }}>{bookingOpenDate.format('D MMM')}</Box>
            </Typography>;
        } else if (currentTime < dayBeforeBooking) {
            const days = bookingOpenDate.diff(currentTime, 'days');
            content = <Typography variant='h4' color='text.secondary' sx={{ fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>
                Bokning öppnar om: <Box component='span' sx={{ color: 'yellow' }}>{days} dagar</Box>
            </Typography>;
        } else {
            const hours = bookingOpenDate.diff(currentTime, 'hours') % 24;
            const minutes = bookingOpenDate.diff(currentTime, 'minutes') % 60;
            const seconds = bookingOpenDate.diff(currentTime, 'seconds') % 60;
            content = <Typography variant='h4' color='text.secondary' sx={{ fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>
                Bokning öppnar om: <Box component='span' sx={{ color: 'yellow' }}>{hours}H {minutes}M {seconds}S</Box>
            </Typography>;
        }
    } else {
        content = <Typography variant='h4' sx={{ color: 'green', fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>Bokning öppet</Typography>;
    }

    return (
        <Paper sx={{ p: 3, mb: { xs: 2, lg: 0 }, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderLeft: '5px solid rgba(214, 107, 39)' }}>
            {content}
            <Typography variant='h5' color='text.secondary' sx={{ mb: 1, fontSize: { xs: '16px', sm: '20px', md: '22px', lg: '25px' } }}>
                Säsongen {currentTime.year()}: <Box component='span' sx={{ color: 'orange' }}>
                    {seasonOpenDate ? seasonOpenDate.format('D MMM') : 'loading...'} - 
                    {seasonCloseDate ? seasonCloseDate.format('D MMM') : 'loading...'}
                </Box>
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                href='https://bokning4.paxess.se/malnbaden2'
                target='_blank'
                sx={{
                    p: { xs: '4px', sm: '8px', md: '10px', lg: '12px' },
                    fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px' },
                }}
            >
                Boka Direkt
            </Button>
        </Paper>
    );
}

export default BookingCountdown;
