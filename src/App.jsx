import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './App.css';
import i18n from '../i18n'; // Importera i18next-konfiguration

import ResponsiveNavbar from './components/responsive-navbar/ResponsiveNavbar';
import Home from './pages/home/Home';
import Camping from './pages/camping/Camping';
import Cottages from './pages/cottages/Cottages';
import Hostel from './pages/hostel/Hostel';
import Activities from './pages/activities/Activities';
import Restaurant from './pages/restaurant/Restaurant';
import Openinghours from './pages/opening-hours/Openinghours';
import Shop24SJU from './pages/24sju-butik/Shop24SJU';
import NotFound from './pages/not-found/NotFound';
import Footer from './components/footer/Footer';
import ScrollTopButton from './components/scroll-top-button/ScrollTopButton.jsx';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <ResponsiveNavbar />
          <Routes>
            <Route path="/" element={<Navigate replace to={`/${i18n.language}/home`} />} />
            <Route path="/:lng/home" element={<TranslatedComponent Component={Home} />} />
            <Route path="/:lng/accommodation/camping" element={<TranslatedComponent Component={Camping} />} />
            <Route path="/:lng/accommodation/cottages" element={<TranslatedComponent Component={Cottages} />} />
            <Route path="/:lng/accommodation/hostel" element={<TranslatedComponent Component={Hostel} />} />
            <Route path="/:lng/activities" element={<TranslatedComponent Component={Activities} />} />
            <Route path="/:lng/restaurant" element={<TranslatedComponent Component={Restaurant} />} />
            <Route path="/:lng/opening-hours" element={<TranslatedComponent Component={Openinghours} />} />
            <Route path="/:lng/24sju-butik" element={<TranslatedComponent Component={Shop24SJU} />} />
            <Route path="*" element={<NotFound />} />
            {/* Other routes */}
          </Routes>
          <Footer />
          <ScrollTopButton />
        </Router>
      </ThemeProvider>
    </>
  );
}

// eslint-disable-next-line react/prop-types
function TranslatedComponent({ Component }) {
  const { lng } = useParams();
  const { i18n: translationI18n } = useTranslation();

  React.useEffect(() => {
    if (lng && lng !== translationI18n.resolvedLanguage) {
      translationI18n.changeLanguage(lng);
    }
    if (lng) {
      document.documentElement.lang = lng;
    }
  }, [lng, translationI18n]);

  return <Component />;
}

TranslatedComponent.displayName = 'TranslatedComponent';

export default App;
