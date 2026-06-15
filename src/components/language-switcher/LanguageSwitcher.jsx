import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  replaceRouteLanguage,
  saveLanguagePreference,
} from '../../utils/language';

const languages = [
  { code: 'sv', name: 'Svenska', flag: '/flags/sv.png' },
  { code: 'en', name: 'English', flag: '/flags/en.png' },
  { code: 'no', name: 'Norsk', flag: '/flags/no.png' },
  { code: 'fi', name: 'Suomi', flag: '/flags/fi.png' },
  { code: 'de', name: 'Deutsch', flag: '/flags/de.png' },
  { code: 'fr', name: 'Français', flag: '/flags/fr.png' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguageCode = normalizeLanguage(i18n.resolvedLanguage || i18n.language)
    || DEFAULT_LANGUAGE;
  const currentLanguage = languages.find(({ code }) => code === currentLanguageCode)
    || languages[0];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (code) => {
    saveLanguagePreference(code);
    i18n.changeLanguage(code);
    navigate({
      pathname: replaceRouteLanguage(location.pathname, code),
      search: location.search,
      hash: location.hash,
    });
    handleClose();
  };

  return (
    <Box
      sx={{
        pr: 1.5,
        mr: 0.5,
        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={handleOpen}
        aria-label={`Change language. Current language: ${currentLanguage.name}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          minWidth: 58,
          px: 1,
          py: 0.75,
          border: 0,
          bgcolor: 'transparent',
          color: '#fff',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Box
          component="img"
          src={currentLanguage.flag}
          alt=""
          sx={{ width: 22, height: 16, objectFit: 'cover' }}
        />
        <Typography
          component="span"
          sx={{
            color: 'inherit',
            fontFamily: 'Bebas Neue, Arial, sans-serif',
            fontSize: '1rem',
            lineHeight: 1,
            letterSpacing: '1px',
          }}
        >
          {currentLanguage.code.toUpperCase()}
        </Typography>
      </Box>
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
            selected={currentLanguageCode === language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            <img src={language.flag} alt="" style={{ marginRight: 8, width: 22, height: 16, objectFit: 'cover' }} />
            <Typography variant="h6">
              {language.name} ({language.code.toUpperCase()})
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
