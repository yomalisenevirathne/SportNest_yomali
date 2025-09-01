// File: frontend/src/components/Navbar.jsx
// Description: Defines the main navigation bar for the application.

import React from 'react';
// Link and NavLink are special components from react-router-dom for navigation.
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  // This is a style object that will be applied to the NavLink of the currently active page.
  // This gives the user a visual cue of which page they are on.
  const activeLinkStyle = {
    color: '#ffffff', // Change text to bright white for the active link
    fontWeight: '600', // Make the text semi-bold
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex justify-between items-center py-4">
          
          {/* --- Website Logo/Title --- */}
          {/* This Link component will navigate to the default attendance page when clicked. */}
          <Link to="/attendance" className="text-xl font-bold tracking-wider hover:text-slate-200">
            SportNest
          </Link>
          
          {/* --- Navigation Links --- */}
          <ul className="flex items-center space-x-6 text-slate-300">
            <li>
              <NavLink 
                to="/attendance" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="hover:text-white transition duration-300"
              >
                Attendance
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/feedback" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="hover:text-white transition duration-300"
              >
                Feedback
              </NavLink>
            </li>
            {/* --- THIS IS THE NEW LINK WE ADDED --- */}
            <li>
              <NavLink 
                to="/salaries" 
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className="hover:text-white transition duration-300"
              >
                Salaries
              </NavLink>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;