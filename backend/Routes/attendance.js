// File: backend/Routes/attendance.js
// Description: Defines the API endpoints for attendance and maps them to controller functions.

const express = require('express');
const router = express.Router();

// --- THE FIX IS HERE ---
// Ensure the filename in the require() statement EXACTLY matches the actual filename
// in your 'Controllers' folder. It is case-sensitive!
const attendanceController = require('../Controllers/attendanceController');

// Route for getting the list of coaches
router.get('/coaches', attendanceController.getCoaches);

// Route for getting all attendance records
router.get('/', attendanceController.getAllAttendance);

// Route for marking/updating an attendance record
router.post('/', attendanceController.markAttendance);

// Route for deleting a specific attendance record by its ID
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;