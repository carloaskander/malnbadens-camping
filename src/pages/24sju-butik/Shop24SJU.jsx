import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Box, Button, Container, Divider, Grid, Paper, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AnimatedSection from '../../components/animated-section/AnimatedSection';
import shopLogo from '../../assets/images/24sju/24sju-logo.svg';

const SHOP_EMAIL = '24sju@malnbadenscamping.se';
const SUPPORTED_LANGUAGES = ['sv', 'en', 'no', 'de', 'fr', 'fi'];

function Shop24SJU() {
  const { t, i18n } = useTranslation();
  const canonicalUrl = `https://www.malnbadenscamping.se/${i18n.language}/24sju-butik`;
  const isLongTitleLanguage = ['de', 'fr', 'fi'].includes(i18n.language);
  const highlights = [
    { icon: <AccessTimeIcon />, key: 'alwaysOpen' },
    { icon: <LocalGroceryStoreIcon />, key: 'realGroceries' },
    { icon: <FavoriteBorderIcon />, key: 'everyoneWelcome' },
  ];

  return (
    <>
      <Helmet>
        <title>{t('shopPage.meta.title')}</title>
        <meta name="description" content={t('shopPage.meta.description')} />
        <meta property="og:title" content={t('shopPage.meta.title')} />
        <meta property="og:description" content={t('shopPage.meta.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Malnbadens Camping" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('shopPage.meta.title')} />
        <meta name="twitter:description" content={t('shopPage.meta.description')} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        {SUPPORTED_LANGUAGES.map((language) => (
          <link
            key={language}
            rel="alternate"
            hrefLang={language}
            href={`https://www.malnbadenscamping.se/${language}/24sju-butik`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.malnbadenscamping.se/sv/24sju-butik"
        />
      </Helmet>

      <Box
        component="main"
        sx={{
          bgcolor: '#FAF6EE',
          pt: { xs: 'calc(70px + 48px)', md: 'calc(70px + 72px)' },
          pb: { xs: 9, md: 13 },
          backgroundImage: `
            radial-gradient(circle at 12% 20%, rgba(247, 191, 84, 0.12), transparent 30%),
            radial-gradient(circle at 88% 75%, rgba(67, 142, 66, 0.08), transparent 28%)
          `,
        }}
      >
        <Container maxWidth="md">
          <Box>
            <AnimatedSection direction="left">
              <Grid
                container
                spacing={{ xs: 3.5, sm: 5, md: 7 }}
                alignItems="center"
                justifyContent="center"
                sx={{ mb: { xs: 5, md: 6 } }}
              >
                <Grid item xs={3.5} sm={4}>
                  <Box
                    component="img"
                    src={shopLogo}
                    alt={t('shopPage.logoAlt')}
                    sx={{
                      width: '100%',
                      maxWidth: 220,
                      height: 'auto',
                      display: 'block',
                      mx: 'auto',
                      filter: 'drop-shadow(0 10px 18px rgba(35, 31, 32, 0.12))',
                    }}
                  />
                </Grid>
                <Grid item xs={8.5} sm={8}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography
                      variant="h5"
                      component="p"
                      color="secondary.main"
                      sx={{
                        letterSpacing: { xs: 1.4, sm: 2.2 },
                        fontSize: { xs: '1rem', sm: '1.5rem' },
                        mb: 1.25,
                      }}
                    >
                      {t('shopPage.eyebrow')}
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: {
                          xs: isLongTitleLanguage
                            ? 'clamp(2.35rem, 10.5vw, 2.85rem)'
                            : 'clamp(2.75rem, 12vw, 3.15rem)',
                          sm: 'clamp(3.2rem, 5vw, 3.75rem)',
                          md: 'clamp(3.75rem, 4.3vw, 4.5rem)',
                        },
                        lineHeight: { xs: 0.92, sm: 1 },
                        overflowWrap: 'anywhere',
                        hyphens: 'auto',
                      }}
                    >
                      {t('shopPage.title')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: 700,
                      mx: 'auto',
                      textAlign: 'center',
                      lineHeight: 1.75,
                      color: 'rgba(4, 43, 42, 0.82)',
                    }}
                  >
                    {t('shopPage.description')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {highlights.map((highlight) => (
                      <Grid item xs={12} sm={4} key={highlight.key}>
                        <Box
                          sx={{
                            height: '100%',
                            p: 2.5,
                            textAlign: 'center',
                            border: '1px solid rgba(4, 43, 42, 0.1)',
                            bgcolor: 'rgba(255, 255, 255, 0.48)',
                          }}
                        >
                          <Box sx={{ color: 'secondary.main', mb: 1 }}>
                            {highlight.icon}
                          </Box>
                          <Typography variant="h5" sx={{ mb: 0.75 }}>
                            {t(`shopPage.highlights.${highlight.key}.title`)}
                          </Typography>
                          <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                            {t(`shopPage.highlights.${highlight.key}.description`)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.15} noDelayOnMobile>
              <Paper
                sx={{
                  width: '100%',
                  mx: 'auto',
                  overflow: 'hidden',
                  borderTop: '5px solid',
                  borderColor: 'secondary.main',
                  boxShadow: '0 16px 40px rgba(4, 43, 42, 0.12)',
                }}
              >
                <Box sx={{ p: { xs: 3, sm: 4.5, md: 5 }, textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ letterSpacing: 1.5, mb: 0.5 }}
                  >
                    {t('shopPage.openingLabel')}
                  </Typography>
                  <Typography
                    variant="h2"
                    color="secondary.main"
                    sx={{ fontSize: { xs: '2.75rem', sm: '3.6rem' }, mb: 2.5 }}
                  >
                    {t('shopPage.openingDate')}
                  </Typography>
                  <Divider sx={{ maxWidth: 80, mx: 'auto', mb: 2.5, borderColor: 'rgba(4, 43, 42, 0.18)' }} />
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 520, mx: 'auto', mb: 3.5, lineHeight: 1.7 }}
                  >
                    {t('shopPage.openingNote')}
                  </Typography>
                  <Button
                    component="a"
                    href={`mailto:${SHOP_EMAIL}`}
                    variant="contained"
                    startIcon={<EmailIcon />}
                    sx={{ px: 3.5 }}
                  >
                    {t('shopPage.contactButton')}
                  </Button>
                </Box>
              </Paper>
            </AnimatedSection>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Shop24SJU;
