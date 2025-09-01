// File: backend/Routes/salaryRoutes.js

const express = require('express');
const router = express.Router();
const salaryController = require('../Controllers/salaryController');

// Route to calculate salaries for a given month/year
router.post('/calculate', salaryController.calculateSalaries);

// Route to seed initial coach data (for testing purposes)
router.post('/seed', salaryController.seedCoaches);

module.exports = router;