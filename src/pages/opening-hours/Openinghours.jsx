import React, { useState, useEffect, useRef } from 'react';
import contentfulClient from '../../contentfulClient';
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material';
import Lottie from 'react-lottie-player';
import emailjs from 'emailjs-com'; // Import emailjs
import loadingAnimation from '../../assets/lottie-animations/loading-animation.json'; // Import loading animation
import checkmarkAnimation from '../../assets/lottie-animations/checkmark-animation.json'; // Import checkmark animation
import './Openinghours.css';

function OpeningHours() {
    const [hoursData, setHoursData] = useState(null);
    const form = useRef();

    const [lottieAnimation, setLottieAnimation] = useState({
        animationData: null,
        play: false,
        loop: false
    });
    const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'loading', 'sent'

    useEffect(() => {
        contentfulClient.getEntry('2xiCKoDLdxacqubv36ei5r')
            .then((entry) => {
                setHoursData(entry.fields);
            })
            .catch(console.error);
    }, []);

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
                console.log(result.text);
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
                        <Typography variant="h2" gutterBottom>Öppettider</Typography>
                        {hoursData ? (
                            <>
                                <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', paddingLeft: 2 }}>
                                    <Typography variant="h3" color='rgba(11, 110, 73)'>Reception</Typography>
                                    {hoursData.openingHours.receptionHours.map((hour, index) => (
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
                                <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', paddingLeft: 2 }}>
                                    <Typography variant="h3" color='rgba(11, 110, 73)'>Minigolf</Typography>
                                    {hoursData.openingHours.minigolfHours.map((hour, index) => (
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
                            </>
                        ) : <Typography>Loading...</Typography>}
                    </Grid>
                    <Grid item xs={12} md={6} style={{ position: 'relative', display: 'none' }}>
                        <Typography variant="h2" gutterBottom>Kontakta Oss</Typography>
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
                            <TextField name="from_name" label="Ditt Namn" variant="outlined" fullWidth margin="normal" disabled={formStatus !== 'idle'} />
                            <TextField name="user_email" label="Din Email" variant="outlined" fullWidth margin="normal" disabled={formStatus !== 'idle'} />
                            <TextField name="message" label="Meddelande..." variant="outlined" fullWidth margin="normal" multiline rows={6} disabled={formStatus !== 'idle'} />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={formStatus !== 'idle'}>
                                Skicka
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default OpeningHours;
