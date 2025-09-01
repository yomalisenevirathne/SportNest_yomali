/*
  File: backend/Model/models/Feedback.js
  Description: Defines the Mongoose schema and model for the Feedback collection.
*/

const mongoose = require('mongoose');

// 1. Define the Schema (the structure of the feedback document)
const feedbackSchema = new mongoose.Schema({
  playerId: {
    type: String, // For now, we use String. This can be changed to ObjectId later.
    required: [true, 'Player ID is required.'],
  },
  playerName: {
    type: String,
    required: [true, 'Player name is required.'],
  },
  coachId: {
    type: String,
    required: [true, 'Coach ID is required.'],
  },
  coachName: {
    type: String,
    required: [true, 'Coach name is required.'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required.'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: false, // The comment is not mandatory.
  },
  // --- THIS IS THE NEW FIELD ---
  // Added to store the player's email address along with the feedback.
  playerEmail: {
    type: String,
    required: false, // Not making it mandatory for the feedback to exist.
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date to the current time on creation.
  },
});

// 2. Create the Model from the Schema and export it.
//    This model is a "constructor" that we can use to create new documents.
module.exports = mongoose.model('Feedback', feedbackSchema);