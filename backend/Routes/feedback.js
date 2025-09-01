/*
  File: backend/Routes/feedback.js
  Description: Defines the API endpoints (routes) for feedback-related operations.
*/

const express = require('express');
const router = express.Router(); // Initialize the express router

// Import controller functions that contain the logic
const feedbackController = require('../Controllers/feedbackController');


// --- Define API Routes and connect them to controller functions ---

// Route to create new feedback
router.post('/', feedbackController.createFeedback);

// Route to get all feedback
router.get('/', feedbackController.getAllFeedback);

// Route to update a specific feedback by ID
router.put('/:id', feedbackController.updateFeedback);

// Route to delete a specific feedback by ID
router.delete('/:id', feedbackController.deleteFeedback);

// Route to get the list of players
router.get('/players', feedbackController.getPlayers);


// Export the router to be used in the main app.js file
module.exports = router;