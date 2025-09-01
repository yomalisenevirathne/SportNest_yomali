// src/pages/FeedbackManagementPage.jsx
import React, { useState, useEffect } from 'react';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import feedbackService from '../services/feedbackService'; // Import our service

const FeedbackManagementPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [players, setPlayers] = useState([]);
    const [feedbackToEdit, setFeedbackToEdit] = useState(null); // State for the feedback being edited
    const [error, setError] = useState('');

    // Function to fetch all data from the backend
    const loadData = () => {
        feedbackService.getPlayers()
            .then(response => setPlayers(response.data))
            .catch(error => setError('Failed to load players.'));
        
        feedbackService.getAllFeedback()
            .then(response => setFeedbacks(response.data))
            .catch(error => setError('Failed to load feedbacks.'));
    };

    // useEffect to load data when the component first mounts
    useEffect(() => {
        loadData();
    }, []);

    // Function to handle form submission (for both creating and updating)
    const handleFormSubmit = (feedbackData) => {
        const apiCall = feedbackToEdit
            ? feedbackService.updateFeedback(feedbackToEdit._id, feedbackData)
            : feedbackService.createFeedback(feedbackData);
        
        apiCall
            .then(() => {
                setFeedbackToEdit(null); // Reset the editing state
                loadData(); // Reload all data to show changes
            })
            .catch(error => setError('An error occurred while saving the feedback.'));
    };
    
    // Function to handle the delete action
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            feedbackService.deleteFeedback(id)
                .then(() => loadData())
                .catch(error => setError('Failed to delete the feedback.'));
        }
    };
    
    // Function to set which feedback to edit
    const handleEdit = (feedback) => {
        setFeedbackToEdit(feedback);
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <header className="bg-slate-800 text-white text-center py-5 shadow-lg">
                <h1 className="text-4xl font-bold tracking-wide">Feedback & Review Management</h1>
            </header>
            <main className="container mx-auto p-4 md:p-8 max-w-4xl">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                
                <FeedbackForm
                    players={players}
                    onFormSubmit={handleFormSubmit}
                    feedbackToEdit={feedbackToEdit}
                    setFeedbackToEdit={setFeedbackToEdit}
                />

                <FeedbackList
                    feedbacks={feedbacks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>
        </div>
    );
};

export default FeedbackManagementPage;