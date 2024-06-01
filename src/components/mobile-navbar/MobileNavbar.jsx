import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../assets/images/logo/mbclogo-orange-transparent-horizontal-2.png';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';

function MobileNavbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const currentLanguage = i18n.language;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAccommodation, setOpenAccommodation] = useState(true);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleClickAccommodation = (event) => {
    event.stopPropagation(); // This prevents the click from propagating.
    setOpenAccommodation(!openAccommodation);
  };

  const generateLink = (path) => `/${currentLanguage}${path}`;

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{ pt: 6 }}
    >
      <List>
        <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/home')} key="Home">
          <ListItemText primary={t('navbar.home')} primaryTypographyProps={{
            style: {
              fontFamily: 'Bebas Neue',
              fontSize: '1.25rem',
              letterSpacing: '1px'
            }
          }} />
        </ListItem>
        <ListItem sx={{ pr: 6 }} button onClick={handleClickAccommodation} key="Accommodation">
          <ListItemText primary={t('navbar.accommodation.title')} primaryTypographyProps={{
            style: {
              fontFamily: 'Bebas Neue',
              fontSize: '1.25rem',
              letterSpacing: '1px'
            }
          }} />
          {openAccommodation ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openAccommodation} timeout="auto" unmountOnExit>
          <List sx={{ bgcolor: 'rgba(2 , 25, 25, 0.85)' }} component="div" disablePadding>
            <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/accommodation/camping')} key="Camping">
              <ListItemText sx={{ pl: 2 }} primary={t('navbar.accommodation.camping')} primaryTypographyProps={{
                style: {
                  fontFamily: 'Bebas Neue',
                  fontSize: '1.25rem',
                  letterSpacing: '1px'
                }
              }} />
            </ListItem>
            <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/accommodation/cottages')} key="Cottages">
              <ListItemText sx={{ pl: 2 }} primary={t('navbar.accommodation.cottages')} primaryTypographyProps={{
                style: {
                  fontFamily: 'Bebas Neue',
                  fontSize: '1.25rem',
                  letterSpacing: '1px'
                }
              }} />
            </ListItem>
            <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/accommodation/hostel')} key="Hostel">
              <ListItemText sx={{ pl: 2 }} primary={t('navbar.accommodation.hostel')} primaryTypographyProps={{
                style: {
                  fontFamily: 'Bebas Neue',
                  fontSize: '1.25rem',
                  letterSpacing: '1px'
                }
              }} />
            </ListItem>
          </List>
        </Collapse>
        <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/activities')} key="Activities">
          <ListItemText primary={t('navbar.activities')} primaryTypographyProps={{
            style: {
              fontFamily: 'Bebas Neue',
              fontSize: '1.25rem',
              letterSpacing: '1px'
            }
          }} />
        </ListItem>
        <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/restaurant')} key="Restaurant">
          <ListItemText primary={t('navbar.restaurant')} primaryTypographyProps={{
            style: {
              fontFamily: 'Bebas Neue',
              fontSize: '1.25rem',
              letterSpacing: '1px'
            }
          }} />
        </ListItem>
        <ListItem sx={{ pr: 6 }} button component={Link} to={generateLink('/opening-hours')} key="Opening Hours">
          <ListItemText primary={t('navbar.openingHours')} primaryTypographyProps={{
            style: {
              fontFamily: 'Bebas Neue',
              fontSize: '1.25rem',
              letterSpacing: '1px'
            }
          }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed">
      <Toolbar style={{ justifyContent: 'space-between', minHeight: '70px' }}>
        <img src={logo} alt="Logo" style={{ height: '70px', width: 'auto' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LanguageSwitcher />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }} // Position the close button
          >
            <CloseIcon />
          </IconButton>
          {list()}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default MobileNavbar;
