import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import PageMissing from '../../assets/images/page-missing/page-missing.png';

function Restaurant() {
    return(
        <>
            <Box sx={{ bgcolor: '#FAF6EE', minHeight: 'calc(100vh - 250px)', pt: 'calc(70px + 75px)'}}>
                <Container maxWidth='lg' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Typography variant='h2'>Arbete pågår! Vi målar om digitalt.</Typography>
                    <Box
                        component="img"
                        sx={{
                            maxWidth: '75%',
                            height: 'auto',
                        }}
                        src={PageMissing}
                        alt="Page is under construction, coming soon."
                    />
                </Container>
            </Box>
        </>
    )
}

export default Restaurant;