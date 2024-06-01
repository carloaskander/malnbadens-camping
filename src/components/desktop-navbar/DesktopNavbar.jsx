import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logo from '../../assets/images/logo/mbclogo-orange-transparent-horizontal-2.png';
import { useTheme } from '@mui/material/styles';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';

function DesktopNavbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
            <img src={logo} alt="Logo" style={{ height: '70px', width: 'auto' }} />
            <Box display="flex" alignItems="center">
              <LanguageSwitcher />
              <Typography component={Link} to={generateLink('/home')} sx={{ fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica', margin: '20px', textDecoration: 'none', color: 'inherit' }}>{t('navbar.home')}</Typography>
              <IconButton
                aria-describedby={id}
                onMouseEnter={handleAccommodationHover}
                sx={{ justifyContent: 'flex-start', minWidth: '150px', marginRight: 2, color: 'text.secondary', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}
              >
                {t('navbar.accommodation.title')}
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
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
              <Typography component={Link} to={generateLink('/activities')} sx={{ marginRight: '20px', textDecoration: 'none', color: 'inherit', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}>{t('navbar.activities')}</Typography>
              <Typography component={Link} to={generateLink('/restaurant')} sx={{ marginRight: '20px', textDecoration: 'none', color: 'inherit', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}>{t('navbar.restaurant')}</Typography>
              <Typography component={Link} to={generateLink('/opening-hours')} sx={{ textDecoration: 'none', color: 'inherit', fontSize: '1.25rem', letterSpacing: '1px', fontFamily: 'Bebas Neue, Arial, Helvetica' }}>{t('navbar.openingHours')}</Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default DesktopNavbar;
