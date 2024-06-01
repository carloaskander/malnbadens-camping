// LanguageSwitcher.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Menu, MenuItem, IconButton, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import styled from '@emotion/styled';

const languages = [
  { code: 'sv', name: 'Svenska', flag: '../../../flags/sv.png' },
  { code: 'en', name: 'English', flag: '../../../flags/en.png' },
  { code: 'no', name: 'Norsk', flag: '../../../flags/no.png' },
  { code: 'fi', name: 'Suomi', flag: '../../../flags/fi.png' },
  { code: 'de', name: 'Deutsch', flag: '../../../flags/de.png' },
  { code: 'fr', name: 'Français', flag: '../../../flags/fr.png' },
];

const IconWrapper = styled.div`
  position: relative;
  width: 24px; /* Adjust size as needed */
  height: 24px;
`;

const AnimatedIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 1s ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [iconType, setIconType] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIconType((prev) => !prev);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    navigate(`/${code}${location.pathname.substring(3)}`);
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <IconWrapper>
          <AnimatedIcon visible={iconType}>
            <PublicIcon sx={{ color: 'white' }} />
          </AnimatedIcon>
          <AnimatedIcon visible={!iconType}>
            <TranslateIcon sx={{ color: 'white' }} />
          </AnimatedIcon>
        </IconWrapper>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          mt: '15px',
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            selected={i18n.language === language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            <img src={language.flag} alt="" style={{ marginRight: 8, width: 20, height: 20 }} />
            <Typography variant="h6">
              {language.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
