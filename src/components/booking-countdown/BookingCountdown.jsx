// import React from 'react';
// import { Button, Paper } from '@mui/material';
// import { useTranslation } from 'react-i18next';

// function BookingCountdown() {
//     const { t } = useTranslation();

//     return (
//             <Button
//                 variant="contained"
//                 color="secondary"
//                 href='https://bokning4.paxess.se/malnbaden2'
//                 target='_blank'
//                 sx={{
//                     p: { xs: '4px', sm: '8px', md: '10px', lg: '12px' },
//                     fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px' },
//                 }}
//             >
//                 {t('bookingCountdown.button')}
//             </Button>
//     );
// }

// export default BookingCountdown;


// OLD COMPONENT:

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import contentfulClient from '../../contentfulClient';
import moment from 'moment-timezone';
import 'moment/locale/sv';
import 'moment/locale/fi';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/nb'; // Norska Bokmål

function BookingCountdown() {
    const { t, i18n } = useTranslation();
    const [currentTime, setCurrentTime] = useState(moment());
    const [dates, setDates] = useState({
        seasonOpenDate: null,
        seasonCloseDate: null,
        bookingOpenDate: null,
    });
    const [campingStatusText, setCampingStatusText] = useState('');

    useEffect(() => {
        const currentLang = i18n.language;
        console.log(`Current language: ${currentLang}`);

        // Use appropriate moment locale based on the current language
        moment.locale(currentLang === 'sv' || currentLang === 'no' ? 'sv' : currentLang);

        const timer = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);
        return () => clearInterval(timer);
    }, [i18n.language]);

    useEffect(() => {
        async function fetchDates() {
            try {
                const locale = i18n.language === 'sv' || i18n.language === 'no' ? 'sv' : 'en';
                const entry = await contentfulClient.getEntries({
                    content_type: 'openingHours',
                    locale: locale,
                });
                console.log('Contentful response:', entry);

                if (entry.items.length > 0) {
                    const { seasonOpenDate, seasonCloseDate, bookingOpenDate, campingStatusText } = entry.items[0].fields;
                    setDates({
                        seasonOpenDate: moment.tz(seasonOpenDate, "Europe/Stockholm"),
                        seasonCloseDate: moment.tz(seasonCloseDate, "Europe/Stockholm"),
                        bookingOpenDate: moment.tz(bookingOpenDate, "Europe/Stockholm"),
                    });
                    setCampingStatusText(campingStatusText);
                }
            } catch (error) {
                console.error('Error fetching data from Contentful:', error);
            }
        }
        fetchDates();
    }, [i18n.language]);

    const { seasonOpenDate, seasonCloseDate, bookingOpenDate } = dates;
    let content;

    if (!seasonOpenDate || !seasonCloseDate || !bookingOpenDate) {
        content = <CircularProgress color="secondary" />;
    } else if (currentTime > seasonCloseDate) {
        content = <Typography variant='h4' sx={{ color: 'red' }}>{t('bookingCountdown.closedForSeason')}</Typography>;
    } else if (currentTime < bookingOpenDate) {
        const weekBeforeBooking = bookingOpenDate.clone().subtract(7, 'days');
        const dayBeforeBooking = bookingOpenDate.clone().subtract(1, 'days');

        if (currentTime < weekBeforeBooking) {
            content = <Typography variant='h4' color='text.secondary' sx={{ fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>
                {t('bookingCountdown.bookingOpens')}: <Box component='span' sx={{ color: 'yellow' }}>{bookingOpenDate.format('D MMM')}</Box>
            </Typography>;
        } else if (currentTime < dayBeforeBooking) {
            const days = bookingOpenDate.diff(currentTime, 'days');
            content = <Typography variant='h4' color='text.secondary' sx={{ fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>
                {t('bookingCountdown.bookingOpensIn')}: <Box component='span' sx={{ color: 'yellow' }}>{days} {t('bookingCountdown.days')}</Box>
            </Typography>;
        } else {
            const hours = bookingOpenDate.diff(currentTime, 'hours') % 24;
            const minutes = bookingOpenDate.diff(currentTime, 'minutes') % 60;
            const seconds = bookingOpenDate.diff(currentTime, 'seconds') % 60;
            content = <Typography variant='h4' color='text.secondary' sx={{ fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>
                {t('bookingCountdown.bookingOpensIn')}: <Box component='span' sx={{ color: 'yellow' }}>{hours}{t('bookingCountdown.hours')} {minutes}{t('bookingCountdown.minutes')} {seconds}{t('bookingCountdown.seconds')}</Box>
            </Typography>;
        }
    } else {
        content = <Typography variant='h4' sx={{ color: 'green', fontSize: { xs: '22px', sm: '25px', md: '30px', lg: '35px' } }}>{t('bookingCountdown.bookingOpen')}</Typography>;
    }

    return (
        <Paper sx={{ p: 3, mb: { xs: 2, lg: 0 }, maxWidth: {xs: '60vw', md: '40vw', lg:'30vw'}, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderLeft: '5px solid rgba(214, 107, 39)' }}>
            {content}
            {campingStatusText && <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontSize: { xs: '16px', sm: '18px', md: '18px', lg: '20px' } }}>{campingStatusText}</Typography>}
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
                {t('bookingCountdown.button')}
            </Button>
        </Paper>
    );
}

export default BookingCountdown;