import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Navbar from './components/navbar/Navbar.jsx';
import Home from './pages/home/Home.jsx'; // Assuming 'Home' includes Hero and BookNow
import Accommodation from './pages/accommodation/Accommodation.jsx';
import Activities from './pages/activities/Activities.jsx';
import Hudiksvall from './pages/hudiksvall/Hudiksvall.jsx';
import Restaurant from './pages/restaurant/Restaurant.jsx';
import Openinghours from './pages/opening-hours/Openinghours.jsx';

function App() {

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/hudiksvall" element={<Hudiksvall />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/opening-hours" element={<Openinghours />} />
        </Routes>
      </Router>
    </>
  )
}

export default App