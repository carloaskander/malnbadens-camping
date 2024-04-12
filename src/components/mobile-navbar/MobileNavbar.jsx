import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// MATERIAL-UI IMPORTS
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


// IMAGE IMPORTS
import logo from '../../assets/images/logo/mbclogo-orange-transparent-horizontal-2.png';

function MobileNavbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);

const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setDrawerOpen(open);
};

const [openAccommodation, setOpenAccommodation] = useState(true);

const handleClickAccommodation = (event) => {
    event.stopPropagation(); // This prevents the click from propagating.
    setOpenAccommodation(!openAccommodation);
};

const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{ pt: 6 }}
    >
        <List>
            {/* Replace these with your actual navigation links */}
            <ListItem sx={{ pr: 6 }} button component={Link} to="/home" key="Home">
                <ListItemText primary="Hem"  primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
            }} />
            </ListItem>
            <ListItem sx={{ pr: 6 }} button onClick={handleClickAccommodation} key="Accommodation">
                <ListItemText primary="Boende"  primaryTypographyProps={{
                    style: { 
                        fontFamily: 'Bebas Neue', 
                        fontSize: '1.25rem',
                        letterSpacing: '1px'
                    }
                }}/>
            {openAccommodation ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openAccommodation} timeout="auto" unmountOnExit>
            <List sx={{ bgcolor: 'rgba(2 , 25, 25, 0.85)' }} component="div" disablePadding>
                <ListItem sx={{ pr: 6 }} button component={Link} to="/accommodation/camping" key="Camping">
                <ListItemText sx={{ pl: 2 }} primary="Camping" primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
                }}/>
                </ListItem>
                <ListItem sx={{ pr: 6 }} button component={Link} to="/accommodation/cottages" key="Cottages">
                <ListItemText sx={{ pl: 2 }} primary="Stugor" primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
                }}/>
                </ListItem>
                <ListItem sx={{ pr: 6 }} button component={Link} to="/accommodation/hostel" key="Hostel">
                <ListItemText sx={{ pl: 2 }} primary="Vandrarhem" primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
                }}/>
                </ListItem>
            </List>
            </Collapse>
            <ListItem sx={{ pr: 6 }} button component={Link} to="/activities" key="Activities">
                <ListItemText primary="Aktiviteter"  primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
            }} />
            </ListItem>
            <ListItem sx={{ pr: 6 }} button component={Link} to="/restaurant" key="Restaurant">
                <ListItemText primary="Restaurang"  primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
            }} />
            </ListItem>
            <ListItem sx={{ pr: 6 }} button component={Link} to="/opening-hours" key="Opening Hours">
                <ListItemText primary="Öppettider"  primaryTypographyProps={{
                style: { 
                    fontFamily: 'Bebas Neue', 
                    fontSize: '1.25rem',
                    letterSpacing: '1px'
                }
            }} />
            </ListItem>
            {/* Add more ListItem components as needed */}
        </List>
    </Box>
);

    return (
        <AppBar position="fixed">
            <Toolbar style={{ justifyContent: 'space-between', minHeight: 'var(--navbar-min-height)' }}>
                <img src={logo} alt="Logo" style={{ height: 'var(--navbar-logo-height)' }} />
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', }} // Position the close button
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