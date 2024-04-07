import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

import ResponsiveNavbar from './components/responsive-navbar/ResponsiveNavbar';
import Hero from './components/hero/Hero'
import Home from './pages/home/Home';
import Accommodation from './pages/accommodation/Accommodation';
import Camping from './pages/camping/Camping';
import Cottages from './pages/cottages/Cottages';
import Hostel from './pages/hostel/Hostel';
import Activities from './pages/activities/Activities';
import Hudiksvall from './pages/hudiksvall/Hudiksvall';
import Restaurant from './pages/restaurant/Restaurant';
import Openinghours from './pages/opening-hours/Openinghours';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
// Using Web Font Loader for more control



function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <ResponsiveNavbar/>
          <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          {/* Potentially there might be added a accommodation page with camping, cottages and hostel as nested routes here. */}
          <Route path="/accommodation/camping" element={<Camping />} />
          <Route path="/accommodation/cottages" element={<Cottages />} />
          <Route path="/accommodation/hostel" element={<Hostel />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/hudiksvall" element={<Hudiksvall />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/opening-hours" element={<Openinghours />} />
          {/* Other routes */}
        </Routes>

        </Router>
        {/* <Footer/> */}
      </ThemeProvider>
    </>
  )
}

export default App