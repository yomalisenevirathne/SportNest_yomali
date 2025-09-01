// src/components/FeedbackItem.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';

const FeedbackItem = ({ feedback, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-5 mb-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800">Player: <span className="font-normal">{feedback.playerName}</span></p>
                    <p className="text-sm text-gray-500 mb-2">Date: {new Date(feedback.date).toLocaleDateString()}</p>
                    <p className="font-semibold text-gray-700">Coach: <span className="font-normal">{feedback.coachName}</span></p>
                    
                    <div className="flex items-center my-2">
                        <p className="font-semibold mr-2 text-gray-700">Rating:</p>
                        <div className="flex space-x-1">
                            {[...Array(feedback.rating)].map((_, i) => <FaStar key={i} color="#ffc107" />)}
                            {[...Array(5 - feedback.rating)].map((_, i) => <FaStar key={i} color="#e4e5e9" />)}
                        </div>
                    </div>
                    
                    <p className="text-gray-700 mt-2"><span className="font-semibold">Comment:</span> {feedback.comment}</p>
                </div>
                <div className="flex flex-col space-y-2">
                    <button onClick={() => onEdit(feedback)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition duration-300">Update</button>
                    <button onClick={() => onDelete(feedback._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition duration-300">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackItem;