// src/components/FeedbackList.jsx
import React from 'react';
import FeedbackItem from './FeedbackItem';

const FeedbackList = ({ feedbacks, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Player Feedback History</h2>
            <div>
                {feedbacks.length > 0 ? (
                    feedbacks.map(fb => <FeedbackItem key={fb._id} feedback={fb} onEdit={onEdit} onDelete={onDelete} />)
                ) : (
                    <p className="text-center text-gray-500">No feedback entries found.</p>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;