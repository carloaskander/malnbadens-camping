import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// MATERIAL-UI IMPORTS
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// IMAGE IMPORTS
import logo from '../../assets/images/logo/mbclogo-light-transparent-horizontal.png';


function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);

const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    setDrawerOpen(open);
};

const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
        <List>
            {/* Replace these with your actual navigation links */}
            <ListItem button component={Link} to="/home" key="Home">
                <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/accommodation" key="Accommodation">
                <ListItemText primary="Accommodation" />
            </ListItem>
            <ListItem button component={Link} to="/activities" key="Activities">
                <ListItemText primary="Activities" />
            </ListItem>
            <ListItem button component={Link} to="/hudiksvall" key="Hudiksvall">
                <ListItemText primary="Hudiksvall" />
            </ListItem>
            <ListItem button component={Link} to="/restaurant" key="Restaurant">
                <ListItemText primary="Restaurant" />
            </ListItem>
            <ListItem button component={Link} to="/opening-hours" key="Opening Hours">
                <ListItemText primary="Opening Hours" />
            </ListItem>
            {/* Add more ListItem components as needed */}
        </List>
    </div>
);


    return (
        <AppBar position="fixed">
            <Toolbar style={{ justifyContent: 'space-between', minHeight: '70px' }}>
                <img src={logo} alt="Logo" style={{ height: '70px' }} />
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
                    {list()}
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;