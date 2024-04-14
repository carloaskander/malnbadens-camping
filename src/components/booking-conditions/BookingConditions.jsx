import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Button, Container, Icon } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Import för PDF-ikonen
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Import för öppna i ny flik-ikonen

function BookingConditions() {
    const [documentData, setDocumentData] = useState(null);

    useEffect(() => {
    contentfulClient.getEntries({
        content_type: 'dokument',
        'fields.entryTitle': 'Booking Conditions'
    })
    .then((response) => {
        if (response.items.length > 0) {
            setDocumentData(response.items[0].fields);
        }
    })
    .catch(console.error);
    }, []);

    if (!documentData) return <p>Loading...</p>;

    return (
        <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', py: 1, paddingLeft: 2, }}>
            <Typography variant="h4" gutterBottom>
                {documentData.documentTitle}
            </Typography>
            <Typography variant="body2" paragraph>
                {documentData.documentDescription}
            </Typography>
            {documentData.documentFiles && documentData.documentFiles.map((file, index) => (
                <Button
                    key={index}
                    href={file.fields.file.url}
                    target="_blank"
                    variant="outlined"
                    startIcon={<PictureAsPdfIcon />} // PDF-ikonen
                    endIcon={<OpenInNewIcon />} // Öppna i ny flik-ikonen
                >
                    Öppna Bokningsvillkor
                </Button>
            ))}
        </Box>
    );
}

export default BookingConditions;
