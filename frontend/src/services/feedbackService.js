// src/services/feedbackService.js
import axios from 'axios';

// Define the base URL of our backend API
const API_URL = 'http://localhost:5000/api/feedback';

// Function to get all feedback entries
const getAllFeedback = () => {
    return axios.get(API_URL);
};

// Function to get the list of players
const getPlayers = () => {
    return axios.get(`${API_URL}/players`);
};

// Function to create a new feedback entry
const createFeedback = (feedbackData) => {
    return axios.post(API_URL, feedbackData);
};

// Function to update a feedback entry by its ID
const updateFeedback = (id, feedbackData) => {
    return axios.put(`${API_URL}/${id}`, feedbackData);
};

// Function to delete a feedback entry by its ID
const deleteFeedback = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Export all functions to be used in our components
export default {
    getAllFeedback,
    getPlayers,
    createFeedback,
    updateFeedback,
    deleteFeedback,
};