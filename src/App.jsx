import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero'
import Home from './pages/home/Home';
import Accommodation from './pages/accommodation/Accommodation';
import Activities from './pages/activities/Activities';
import Hudiksvall from './pages/hudiksvall/Hudiksvall';
import Restaurant from './pages/restaurant/Restaurant';
import Openinghours from './pages/opening-hours/Openinghours';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';


function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/hudiksvall" element={<Hudiksvall />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/opening-hours" element={<Openinghours />} />
          </Routes>
        </Router>
        {/* <Footer/> */}
      </ThemeProvider>
    </>
  )
}

export default App