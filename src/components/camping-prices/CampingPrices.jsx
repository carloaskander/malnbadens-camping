import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import contentfulClient from '../../contentfulClient';
import { Box, Typography, Paper, List, ListItem, Grid } from '@mui/material';

function CampingPrices() {
    const { i18n } = useTranslation();
    const [pricesData, setPricesData] = useState(null);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const currentLanguage = i18n.language;

        // Use Swedish locale for both Swedish and Norwegian languages
        const locale = currentLanguage === 'sv' || currentLanguage === 'no' ? 'sv' : 'en';

        contentfulClient.getEntries({
            content_type: 'prices', // Make sure this matches your Contentful Content Model ID
            'fields.entryTitle': 'Camping Prices',
            locale: locale
        })
        .then((response) => {
            if (response.items.length > 0) {
                const entry = response.items[0].fields;
                setPricesData(entry.pricingDetails); // Assuming 'pricingDetails' is the field ID for your JSON
                setTitle(entry.Title); // Here we use 'Title' as per your field ID
            } else {
        
            }
        })
        .catch((error) => {
            console.error("Error fetching prices from Contentful:", error);
        });
    }, [i18n.language]);

    if (!pricesData) return <Typography>Loading prices...</Typography>;
    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>{title}</Typography>
            <Grid container spacing={2} justifyContent="flex-start"> {/* Create a grid container */}
                {pricesData.seasons.map((season, index) => (
                <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 325 }} key={index}> {/* Define how each item behaves on different screen sizes */}
                    <Paper elevation={2} sx={{ mb: 2, p: 2, height: '100%' }}>
                        <Typography variant="h5" gutterBottom>{season.name} <br/> {season.dateRange}</Typography>
                        <List>
                            {season.prices.map((price, priceIndex) => (
                                <ListItem key={priceIndex} divider sx={{ flexDirection: 'column', alignItems: 'flex-start'}}>
                                    {/* <ListItemText primaryTypographyProps={{ color: 'secondary.main' }} secondaryTypographyProps={{ color: 'primary.main' }} primary={`${price.description}`} secondary={`${price.price}`} /> */}
                                    <Typography color="secondary.main" variant="h6">
                                        {price.description}
                                    </Typography>
                                    <Typography color="secondary.main" fontStyle="italic" variant="body2">
                                        {price.additionalInfo}
                                    </Typography>
                                    <Typography color="primary.main" variant="h6" component="body2">
                                        {price.price}
                                    </Typography>
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
