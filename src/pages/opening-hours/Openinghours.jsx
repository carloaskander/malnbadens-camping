import React, { useState, useEffect, useRef } from 'react';
import contentfulClient from '../../contentfulClient';
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material';

function OpeningHours() {
    const [hoursData, setHoursData] = useState(null);
    const form = useRef();

    useEffect(() => {
        contentfulClient.getEntry('2xiCKoDLdxacqubv36ei5r')
            .then((entry) => {
                setHoursData(entry.fields);
            })
            .catch(console.error);
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_by9uo47', 'template_ynhwx15', form.current, 'XZ_pnDIfsRFsAprpA')
            .then((result) => {
                console.log(result.text);
                alert('Email successfully sent!');
            }, (error) => {
                console.log(error.text);
                alert('Failed to send email. Please try again.');
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
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" gutterBottom>Kontakta Oss</Typography>
                        <form ref={form} onSubmit={sendEmail} noValidate autoComplete="off">
                            <TextField
                                name="from_name"
                                label="Ditt Namn"
                                variant="outlined" 
                                fullWidth 
                                margin="normal"
                            />
                            <TextField 
                                name="user_email"
                                label="Din Email" 
                                variant="outlined" 
                                fullWidth 
                                margin="normal"
                            />
                            <TextField 
                                name="message"
                                label="Meddelande..."
                                variant="outlined" 
                                fullWidth 
                                margin="normal"
                                multiline
                                rows={6}
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
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
