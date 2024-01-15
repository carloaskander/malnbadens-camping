import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className='navbar'>
            <div className='navbar-brand'>Malnbadens Camping</div>
            <ul className='navbar-nav'>
                <li className='nav-item no-bullets'>
                    <Link to="/" className='no-decoration'>Home</Link>
                </li>
                <li className='nav-item no-bullets'>
                    <Link to="/accommodation" className='no-decoration'>Accommodation</Link>
                </li>
                <li className='nav-item no-bullets'>
                    <Link to="/activities" className='no-decoration'>Activities</Link>
                </li>
                <li className='nav-item no-bullets'>
                    <Link to="/hudiksvall" className='no-decoration'>Hudiksvall</Link>
                </li>
                <li className='nav-item no-bullets'>
                    <Link to="/restaurant" className='no-decoration'>Restaurant</Link>
                </li>
                <li className='nav-item no-bullets'>
                    <Link to="/opening-hours" className='no-decoration'>Opening Hours</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;