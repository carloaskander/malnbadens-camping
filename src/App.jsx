import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './App.css'

import ResponsiveNavbar from './components/responsive-navbar/ResponsiveNavbar';
import Home from './pages/home/Home';
import Camping from './pages/camping/Camping';
import Cottages from './pages/cottages/Cottages';
import Hostel from './pages/hostel/Hostel';
import Activities from './pages/activities/Activities';
import Restaurant from './pages/restaurant/Restaurant';
import Openinghours from './pages/opening-hours/Openinghours';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <ResponsiveNavbar/>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/accommodation/camping" element={<Camping />} />
            <Route path="/accommodation/cottages" element={<Cottages />} />
            <Route path="/accommodation/hostel" element={<Hostel />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/opening-hours" element={<Openinghours />} />
            {/* Other routes */}
          </Routes>
          <Footer/>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App