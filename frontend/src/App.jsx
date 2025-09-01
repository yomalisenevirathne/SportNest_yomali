// File: frontend/src/App.jsx
// Description: This component acts as the main layout for the entire application.

import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet from the router library
import Navbar from './components/Navbar';    // Import our newly created Navbar component
import './index.css';                       // Import global styles

function App() {
  return (
    // This div is the main container for the whole app
    <div>
      {/* The Navbar will be displayed permanently at the top of every page */}
      <Navbar />
      
      {/* The <main> tag is a good semantic element for the primary content */}
      <main>
        {/*
          The <Outlet> is a special component from react-router-dom.
          It acts as a placeholder where the router will render the correct
          page component (like FeedbackManagementPage or AttendanceManagementPage)
          based on the current URL path.
        */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;