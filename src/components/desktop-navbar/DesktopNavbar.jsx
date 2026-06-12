import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logo from '../../assets/images/logo/mbc-logo-navbar-web.svg';
import { useTheme } from '@mui/material/styles';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import AnimatedSection from '../animated-section/AnimatedSection.jsx';

function DesktopNavbar() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme(); // Use the useTheme hook here
  const id = open ? 'simple-popover' : undefined;

  const handleAccommodationHover = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const generateLink = (path) => `/${currentLanguage}${path}`;
  const navLinkSx = {
    mx: 1.25,
    textDecoration: 'none',
    color: 'inherit',
    whiteSpace: 'nowrap',
    fontSize: '1.12rem',
    letterSpacing: '1px',
    fontFamily: 'Bebas Neue, Arial, Helvetica',
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
            <AnimatedSection direction="left">
              <Box
                component={Link}
                to={generateLink('/home')}
                aria-label="Malnbadens Camping"
                sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
              >
                <Box
                  component="img"
                  src={logo}
                  alt=""
                  sx={{ width: '180px', height: '60px', objectFit: 'contain' }}
                />
              </Box>
            </AnimatedSection>
            <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
              <AnimatedSection direction="right">
                <LanguageSwitcher />
              </AnimatedSection>
              <AnimatedSection direction="right" delay={0.2}>
                <Typography component={Link} to={generateLink('/home')} sx={navLinkSx}>{t('navbar.home')}</Typography>
              </AnimatedSection>
              <AnimatedSection direction="right" delay={0.4}>
                <IconButton
                  aria-describedby={id}
                  onMouseEnter={handleAccommodationHover}
                  sx={{ justifyContent: 'flex-start', mx: 0.5, color: 'text.secondary', fontSize: '1.12rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica', whiteSpace: 'nowrap' }}
                >
                  {t('navbar.accommodation.title')}
                  {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </AnimatedSection>
              <Menu
                id="accommodation-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onMouseLeave={handleClose} // Close menu on mouse leave
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.primary.main, // Use theme here
                        borderTop: `4px solid ${theme.palette.secondary.main}`, // Border top with secondary color
                        minWidth: '150px',
                    }
                }}
            >
                <MenuItem onClick={handleClose} component={Link} to={generateLink('/accommodation/camping')} sx={{ color: 'text.secondary', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}>{t('navbar.accommodation.camping')}</MenuItem>
                <MenuItem onClick={handleClose} component={Link} to={generateLink('/accommodation/cottages')} sx={{ color: 'text.secondary', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}>{t('navbar.accommodation.cottages')}</MenuItem>
                <MenuItem onClick={handleClose} component={Link} to={generateLink('/accommodation/hostel')} sx={{ color: 'text.secondary', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}>{t('navbar.accommodation.hostel')}</MenuItem>
              </Menu>
              <AnimatedSection direction="right" delay={0.6}>
                <Typography component={Link} to={generateLink('/24sju-butik')} sx={{ ...navLinkSx, color: '#F28A3C' }}>{t('navbar.shop')}</Typography>
              </AnimatedSection>
              <AnimatedSection direction="right" delay={0.6}>
                <Typography component={Link} to={generateLink('/activities')} sx={navLinkSx}>{t('navbar.activities')}</Typography>
              </AnimatedSection>
              <AnimatedSection direction="right" delay={0.8}>
                <Typography component={Link} to={generateLink('/restaurant')} sx={navLinkSx}>{t('navbar.restaurant')}</Typography>
              </AnimatedSection>
              <AnimatedSection direction="right" delay={1.0}>
                <Typography component={Link} to={generateLink('/opening-hours')} sx={navLinkSx}>{t('navbar.openingHours')}</Typography>
              </AnimatedSection>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default DesktopNavbar;
