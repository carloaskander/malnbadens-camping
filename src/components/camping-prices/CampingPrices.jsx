import React, { useState, useEffect } from 'react';
import contentfulClient from '../../contentfulClient';
import { Box, Typography, Paper, List, ListItem, ListItemText, Grid } from '@mui/material';

function CampingPrices() {
    const [pricesData, setPricesData] = useState(null);
    const [title, setTitle] = useState("");


    useEffect(() => {
        contentfulClient.getEntries({
            content_type: 'prices', // Make sure this matches your Contentful Content Model ID
            'fields.entryTitle': 'Camping Prices',
        })
        .then((response) => {
        if (response.items.length > 0) {
            const entry = response.items[0].fields;
            setPricesData(entry.pricingDetails); // Assuming 'pricingDetails' is the field ID for your JSON
            setTitle(entry.Title); // Here we use 'Title' as per your field ID
        } else {
            console.log("No entries found for the specified content type.");
        }
        })
        .catch((error) => {
        console.error("Error fetching prices from Contentful:", error);
        });
    }, []);

    if (!pricesData) return <Typography>Loading prices...</Typography>;
    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>{title}</Typography>
            <Grid container spacing={2} justifyContent="center"> {/* Create a grid container */}
                {pricesData.seasons.map((season, index) => (
                <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 325 }} key={index}> {/* Define how each item behaves on different screen sizes */}
                    <Paper elevation={2} sx={{ mb: 2, p: 2, height: '100%' }}>
                        <Typography variant="h5" gutterBottom>{season.name} <br/> {season.dateRange}</Typography>
                        <List>
                            {season.prices.map((price, priceIndex) => (
                                <ListItem key={priceIndex} divider>
                                    <ListItemText primaryTypographyProps={{ color: 'secondary.main' }} secondaryTypographyProps={{ color: 'primary.main' }} primary={`${price.description}`} secondary={`${price.price}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default CampingPrices;
