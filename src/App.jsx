import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import NotFound from './pages/not-found/NotFound';
import Footer from './components/footer/Footer';
import ScrollTopButton from './components/scroll-top-button/ScrollTopButton.jsx';
import ChatButton from './components/chat-button/ChatButton.jsx';

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
            
            {/* Catch-all redirects for URLs without language prefix */}
            <Route path="/accommodation/camping" element={<Navigate replace to={`/${i18n.language}/accommodation/camping`} />} />
            <Route path="/accommodation/cottages" element={<Navigate replace to={`/${i18n.language}/accommodation/cottages`} />} />
            <Route path="/accommodation/hostel" element={<Navigate replace to={`/${i18n.language}/accommodation/hostel`} />} />
            <Route path="/activities" element={<Navigate replace to={`/${i18n.language}/activities`} />} />
            <Route path="/restaurant" element={<Navigate replace to={`/${i18n.language}/restaurant`} />} />
            <Route path="/opening-hours" element={<Navigate replace to={`/${i18n.language}/opening-hours`} />} />
            
            <Route path="*" element={<NotFound />} />
            {/* Other routes */}
          </Routes>
          <Footer />
          <ScrollTopButton />
          <ChatButton />
        </Router>
      </ThemeProvider>
    </>
  );
}

function TranslatedComponent({ Component }) {
  const { lng } = useParams();

  React.useEffect(() => {
    if (lng && lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
  }, [lng]);

  return <Component />;
}

export default App;
