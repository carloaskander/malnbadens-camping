import React, { useState, useEffect } from 'react';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Button, Icon } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Import för PDF-ikonen
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Import för öppna i ny flik-ikonen

function CampingInfo() {
    const [campingInfoData, setCampingInfoData] = useState(null);

    useEffect(() => {
        contentfulClient.getEntries({
            content_type: 'dokument',
            'fields.entryTitle': 'Camping Important Information'
        })
        .then((response) => {
            if (response.items.length > 0) {
                setCampingInfoData(response.items[0].fields);
            }
        })
        .catch(console.error);
    }, []);

    if (!campingInfoData) return <p>Loading...</p>;

    return (
        <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', py: 1, paddingLeft: 2, }}>
            <Typography variant="h4" gutterBottom>
                {campingInfoData.documentTitle}
            </Typography>
            <Typography variant="body2" paragraph>
                {campingInfoData.documentDescription}
            </Typography>
            {campingInfoData.documentFiles && campingInfoData.documentFiles.map((file, index) => (
                <Button
                    key={index}
                    href={file.fields.file.url}
                    target="_blank"
                    variant="outlined"
                    startIcon={<PictureAsPdfIcon />}
                    endIcon={<OpenInNewIcon />}
                >
                    Öppna Områdeskarta
                </Button>
            ))}
        </Box>
    );
}

export default CampingInfo;
