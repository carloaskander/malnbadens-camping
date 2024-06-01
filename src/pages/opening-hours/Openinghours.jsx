import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import contentfulClient from '../../contentfulClient';
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material';
import Lottie from 'react-lottie-player';
import emailjs from 'emailjs-com'; // Import emailjs
import loadingAnimation from '../../assets/lottie-animations/loading-animation.json'; // Import loading animation
import checkmarkAnimation from '../../assets/lottie-animations/checkmark-animation.json'; // Import checkmark animation
import './Openinghours.css';

function OpeningHours() {
    const { t, i18n } = useTranslation();
    const [hoursData, setHoursData] = useState(null);
    const form = useRef();

    const [lottieAnimation, setLottieAnimation] = useState({
        animationData: null,
        play: false,
        loop: false
    });
    const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'loading', 'sent'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const locale = i18n.language === 'sv' || i18n.language === 'no' ? 'sv' : 'en'; // Adjust locale based on language
                const response = await contentfulClient.getEntries({
                    content_type: 'openingHours',
                    locale: locale // Use the adjusted locale
                });

                if (response.items.length > 0) {
                    const fields = response.items[0].fields;

                    if (fields.openingHours && fields.openingHours.receptionHours && fields.openingHours.minigolfHours) {
                        setHoursData(fields.openingHours);
                    }
                }
            } catch (error) {
                console.error('Error fetching data from Contentful:', error);
            }
        };

        fetchData();
    }, [i18n.language]);

    const sendEmail = (e) => {
        e.preventDefault();
        setFormStatus('loading');
        setLottieAnimation({
            animationData: loadingAnimation,
            play: true,
            loop: true
        });

        emailjs.sendForm('service_by9uo47', 'template_ynhwx15', form.current, 'XZ_pnDIfsRFsAprpA')
            .then((result) => {
                setFormStatus('sent');
                setLottieAnimation({
                    animationData: checkmarkAnimation,
                    play: true,
                    loop: false
                });
            }, (error) => {
                console.log(error.text);
                setFormStatus('error');
                setLottieAnimation({
                    animationData: null,
                    play: false,
                    loop: false
                });
            });
    };

    return (
        <Box sx={{ bgcolor: '#FAF6EE', minHeight: 'calc(100vh - 250px)', pt: 'calc(70px + 75px)', pb: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" gutterBottom>{t('openingHoursPage.openingHours.title')}</Typography>
                        {hoursData ? (
                            <>
                                {hoursData.receptionHours && (
                                    <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', paddingLeft: 2 }}>
                                        <Typography variant="h3" color='rgba(11, 110, 73)'>{t('openingHoursPage.openingHours.reception')}</Typography>
                                        {hoursData.receptionHours.map((hour, index) => (
                                            <Box mb={2} key={index}>
                                                <Typography variant="h4" color='secondary.main'>
                                                    {hour.dateRange}
                                                </Typography>
                                                <Typography variant="h5">
                                                    {hour.description}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {hour.note}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                                {hoursData.minigolfHours && (
                                    <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', paddingLeft: 2 }}>
                                        <Typography variant="h3" color='rgba(11, 110, 73)'>{t('openingHoursPage.openingHours.minigolf')}</Typography>
                                        {hoursData.minigolfHours.map((hour, index) => (
                                            <Box mb={2} key={index}>
                                                <Typography variant="h4" color='secondary.main'>
                                                    {hour.dateRange}
                                                </Typography>
                                                <Typography variant="h5">
                                                    {hour.description}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {hour.note}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </>
                        ) : <Typography>{t('openingHoursPage.loading')}</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6} style={{ position: 'relative', display: 'none' }}>
                        <Typography variant="h2" gutterBottom>{t('openingHoursPage.contactUs.title')}</Typography>
                        {lottieAnimation.animationData && (
                            <Lottie
                                animationData={lottieAnimation.animationData}
                                play={lottieAnimation.play}
                                loop={false}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '150px',
                                    height: '150px',
                                    zIndex: 10, // Highest, to keep animation on top
                                }}
                                onComplete={() => {
                                    if (formStatus === 'sent' || formStatus === 'loading') {
                                        setFormStatus('idle');
                                        setLottieAnimation({
                                            animationData: null,
                                            play: true,
                                            loop: false
                                        });                                        
                                    }
                                }}
                            />
                        )}
                        <form ref={form} onSubmit={sendEmail} noValidate autoComplete="off" className={`${formStatus === 'loading' || formStatus === 'sent' ? 'blur-effect' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
                            <TextField name="from_name" label={t('openingHoursPage.contactUs.name')} variant="outlined" fullWidth margin="normal" disabled={formStatus !== 'idle'} />
                            <TextField name="user_email" label={t('openingHoursPage.contactUs.email')} variant="outlined" fullWidth margin="normal" disabled={formStatus !== 'idle'} />
                            <TextField name="message" label={t('openingHoursPage.contactUs.message')} variant="outlined" fullWidth margin="normal" multiline rows={6} disabled={formStatus !== 'idle'} />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={formStatus !== 'idle'}>
                                {t('openingHoursPage.contactUs.send')}
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default OpeningHours;
