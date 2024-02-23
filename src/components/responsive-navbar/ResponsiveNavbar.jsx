import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DesktopNavbar from '../desktop-navbar/DesktopNavbar';
import MobileNavbar from '../navbar/MobileNavbar';

function ResponsiveNavbar() {
  const theme = useTheme();
  const isCustomDesktopBreakpoint = useMediaQuery('(min-width:1000px)');

  return isCustomDesktopBreakpoint ? <DesktopNavbar /> : <MobileNavbar />;
}

export default ResponsiveNavbar;