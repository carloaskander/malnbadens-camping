import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material';

function OpeningHours() {
    const form = useRef();

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
                        <Typography variant="h3" gutterBottom>Öppettider</Typography>
                        <Typography variant="h5">Monday - Friday: 9am to 5pm</Typography>
                        <Typography variant="h5">Saturday: 10am to 4pm</Typography>
                        <Typography variant="h5">Sunday: Closed</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" gutterBottom>Kontakta Oss</Typography>
                        <form ref={form} onSubmit={sendEmail} noValidate autoComplete="off">
                            <TextField
                                name="from_name" // Match to your email template variable
                                label="Ditt Namn"
                                variant="outlined" 
                                fullWidth 
                                margin="normal"
                            />
                            <TextField 
                                name="user_email" // For consistency with standard email variable names
                                label="Din Email" 
                                variant="outlined" 
                                fullWidth 
                                margin="normal"
                            />
                            <TextField 
                                name="message" // Match to your email template variable
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
