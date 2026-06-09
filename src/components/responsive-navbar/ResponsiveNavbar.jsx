import useMediaQuery from '@mui/material/useMediaQuery';
import DesktopNavbar from '../desktop-navbar/DesktopNavbar';
import MobileNavbar from '../mobile-navbar/MobileNavbar';

function ResponsiveNavbar() {
  const isCustomDesktopBreakpoint = useMediaQuery('(min-width:1180px)');

  return isCustomDesktopBreakpoint ? <DesktopNavbar /> : <MobileNavbar />;
}

export default ResponsiveNavbar;
