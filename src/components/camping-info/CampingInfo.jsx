import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import contentfulClient from "../../contentfulClient";
import { Box, Typography, Button, Icon } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function CampingInfo() {
    const { i18n, t } = useTranslation();
    const [campingInfoData, setCampingInfoData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentLanguage = i18n.language;
                const locale = currentLanguage === 'sv' || currentLanguage === 'no' ? 'sv' : 'en';

                const response = await contentfulClient.getEntries({
                    content_type: 'dokument',
                    'fields.entryTitle': 'Camping Important Information',
                    locale: locale
                });

                if (response.items.length > 0) {
                    setCampingInfoData(response.items[0].fields);
                } else {
                    console.log("No entries found for the specified content type.");
                }
            } catch (error) {
                console.error("Error fetching data from Contentful:", error);
            }
        };

        fetchData();
    }, [i18n.language]);

    if (!campingInfoData) return <Typography>{t('loading')}</Typography>;

    return (
        <Box sx={{ borderLeft: '5px solid rgba(11, 110, 73)', py: 1, paddingLeft: 2 }}>
            <Typography variant="h4" gutterBottom>
                {campingInfoData.documentTitle}
            </Typography>
            <Typography variant="body2" paragraph>
                {campingInfoData.documentDescription}
            </Typography>
            {campingInfoData.documentFiles && Array.isArray(campingInfoData.documentFiles) ? (
                campingInfoData.documentFiles.map((file, index) => (
                    <Button
                        key={index}
                        href={file.fields.file.url}
                        target="_blank"
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        endIcon={<OpenInNewIcon />}
                    >
                        {t('accommodation.campsiteMap.button')}
                    </Button>
                ))
            ) : (
                <Typography>{t('noFiles')}</Typography>
            )}
        </Box>
    );
}

export default CampingInfo;
