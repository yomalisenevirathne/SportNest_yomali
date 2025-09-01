// File: frontend/src/main.jsx
// Description: This is the entry point of the React application where the routing is configured.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import the main layout component
import App from './App.jsx';

// Import all the page components that will be used in the routes
import FeedbackManagementPage from './pages/FeedbackManagementPage.jsx';
import AttendanceManagementPage from './pages/AttendanceManagementPage.jsx';
import SalaryReportPage from './pages/SalaryReportPage.jsx'; // <-- 1. Import the new Salary page

// Import global styles
import './index.css';

// 1. Define the routes "map" for the entire application
const router = createBrowserRouter([
  {
    path: '/',          // The root path of the application
    element: <App />, // This renders the main layout (App component with Navbar and Outlet)
    
    // The components for the child routes below will be rendered inside the App's <Outlet />
    children: [
      {
        index: true, // This marks the default child route for the path '/'
        element: <AttendanceManagementPage />, // Show Attendance page by default
      },
      {
        path: 'attendance', // Renders at localhost:5173/attendance
        element: <AttendanceManagementPage />,
      },
      {
        path: 'feedback', // Renders at localhost:5173/feedback
        element: <FeedbackManagementPage />,
      },
      // --- 2. THIS IS THE NEW ROUTE WE ADDED ---
      {
        path: 'salaries', // Renders at localhost:5173/salaries
        element: <SalaryReportPage />,
      },
    ],
  },
]);

// 2. Render the application by providing the router configuration
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);