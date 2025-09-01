import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <FaStar
                        key={ratingValue}
                        className="cursor-pointer"
                        color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                        size={25}
                        onClick={() => onRatingChange(ratingValue)}
                    />
                );
            })}
        </div>
    );
};

const FeedbackForm = ({ players, onFormSubmit, feedbackToEdit, setFeedbackToEdit }) => {
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (feedbackToEdit) {
            setSelectedPlayer(feedbackToEdit.playerId);
            setRating(feedbackToEdit.rating);
            setComment(feedbackToEdit.comment);
        } else {
            setSelectedPlayer('');
            setRating(0);
            setComment('');
        }
    }, [feedbackToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPlayer || rating === 0) {
            alert("Please select a player and provide a rating.");
            return;
        }
        
        const selectedPlayerObj = players.find(p => p._id === selectedPlayer);
        
        if (!selectedPlayerObj) {
            alert("Could not find player details. Please try again.");
            return;
        }

        const feedbackData = {
            playerId: selectedPlayer,
            playerName: selectedPlayerObj.name,
            coachId: 'coach001', 
            coachName: 'Mr. Perera',
            rating,
            comment,
            playerEmail: selectedPlayerObj.email // Add the player's email to the data object
        };
        
        onFormSubmit(feedbackData); 
        
        if (!feedbackToEdit) {
            setSelectedPlayer('');
            setRating(0);
            setComment('');
        }
    };
    
    const handleCancelEdit = () => {
      setFeedbackToEdit(null); 
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200 w-full mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {feedbackToEdit ? 'Update Feedback' : 'Submit Feedback (Coach View)'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2">Select Player</label>
                    <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={!!feedbackToEdit}>
                        <option value="" disabled>Select a player...</option>
                        {players.map((player) => (
                            <option key={player._id} value={player._id}>{player.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2">Performance Rating</label>
                    <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-800 font-semibold mb-2">Coach Comments</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Enter specific feedback, observations..." className="w-full p-3 border rounded-lg bg-gray-50 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="flex-grow bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition duration-300">
                      {feedbackToEdit ? 'Save Changes' : 'Send Feedback & Notify Player'}
                  </button>
                  {feedbackToEdit && (
                    <button type="button" onClick={handleCancelEdit} className="flex-grow bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300">
                        Cancel Edit
                    </button>
                  )}
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;