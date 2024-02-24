import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu'; // Assuming you want to use this icon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logo from '../../assets/images/logo/mbclogo-light-transparent-horizontal.png';
import { useTheme } from '@mui/material/styles';

function DesktopNavbar() {
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 'var(--navbar-min-height)' }}>
            <img src={logo} alt="Logo" style={{ height: 'var(--navbar-logo-height)' }} />
            <Box display="flex" alignItems="center">
              <Typography component={Link} to="/home" sx={{ marginRight: '20px', textDecoration: 'none', color: 'inherit' }}>Home</Typography>
              <IconButton
                aria-describedby={id}
                onMouseEnter={handleAccommodationHover}
                sx={{ marginRight: '20px', color: 'text.secondary', fontSize: '1rem', fontWeight: '500', fontFamily: 'Roboto' }}
              >
                Accommodation
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
                        width: '150px',
                    }
                }}
            >
                <MenuItem onClick={handleClose} component={Link} to="/accommodation/camping" sx={{ color: 'text.secondary' }}>Camping</MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/accommodation/cottages" sx={{ color: 'text.secondary' }}>Cottages</MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/accommodation/hostel" sx={{ color: 'text.secondary' }}>Hostel</MenuItem>
              </Menu>
              <Typography component={Link} to="/activities" sx={{ marginRight: '20px', textDecoration: 'none', color: 'inherit' }}>Activities</Typography>
              <Typography component={Link} to="/hudiksvall" sx={{ marginRight: '20px', textDecoration: 'none', color: 'inherit' }}>Hudiksvall</Typography>
              <Typography component={Link} to="/restaurant" sx={{ marginRight: '20px', textDecoration: 'none', color: 'inherit' }}>Restaurant</Typography>
              <Typography component={Link} to="/opening-hours" sx={{ textDecoration: 'none', color: 'inherit' }}>Opening Hours</Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default DesktopNavbar;
