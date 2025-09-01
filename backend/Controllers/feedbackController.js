/*
  File: backend/Controllers/feedbackController.js
  Description: Contains the business logic for handling feedback-related API requests.
*/

const Feedback = require('../Model/models/Feedback'); // Import the Feedback model
const sendEmail = require('../utils/emailService');    // Import our email service

/**
 * @desc    Create a new feedback entry AND send an email notification
 * @route   POST /api/feedback
 * @access  Private (e.g., Coach/Admin)
 */
exports.createFeedback = async (req, res) => {
    try {
        // Destructure all required data from the request body
        const { playerId, playerName, coachId, coachName, rating, comment, playerEmail } = req.body;

        // Basic validation
        if (!playerId || !playerName || !coachId || !coachName || !rating || !playerEmail) {
            return res.status(400).json({ message: 'Please provide all required fields, including player email.' });
        }

        // Create a new feedback instance, INCLUDING playerEmail to be saved
        const newFeedback = new Feedback({
            playerId,
            playerName,
            coachId,
            coachName,
            rating,
            comment,
            playerEmail // <--- THIS IS THE FIX. Now we add the email to the object that will be saved.
        });

        // 1. Save the new feedback object (with email) to the database
        const savedFeedback = await newFeedback.save();

        // --- EMAIL SENDING LOGIC ---
        try {
            const emailHtml = `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #333;">Hello ${playerName},</h2>
                        <p>You have received new feedback from your coach, <strong>${coachName}</strong>.</p>
                        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Feedback Details:</h3>
                        <ul>
                            <li><strong>Rating:</strong> ${rating} out of 5</li>
                            <li><strong>Comment:</strong> ${comment || 'No comment provided.'}</li>
                        </ul>
                        <p>Keep up the great work!</p>
                        <p style="color: #777; font-size: 0.9em;"><em>- The SportNest Team</em></p>
                    </body>
                </html>
            `;
            
            // 2. Call our email service to send the notification
            await sendEmail({
                email: playerEmail,
                subject: 'New Feedback from Your Coach!',
                html: emailHtml,
            });
            console.log('Notification email sent successfully to:', playerEmail);
        } catch (emailError) {
            console.error('CRITICAL: Feedback was saved, but email notification failed.', emailError);
        }
        // --- END OF EMAIL LOGIC ---


        // Respond to the client with the successfully saved feedback data
        res.status(201).json(savedFeedback);


    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Get all feedback entries
 * @route   GET /api/feedback
 * @access  Private
 */
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Update a feedback entry by its ID
 * @route   PUT /api/feedback/:id
 * @access  Private
 */
exports.updateFeedback = async (req, res) => {
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found with this ID.' });
        }
        res.status(200).json(updatedFeedback);
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Delete a feedback entry by its ID
 * @route   DELETE /api/feedback/:id
 * @access  Private
 */
exports.deleteFeedback = async (req, res) => {
    try {
        const feedbackToDelete = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedbackToDelete) {
            return res.status(404).json({ message: 'Feedback not found with this ID.' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully.' });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Get a list of players (for the frontend dropdown)
 * @route   GET /api/feedback/players
 * @access  Private
 */
exports.getPlayers = (req, res) => {
    const dummyPlayers = [
        { _id: '653a1a3b1a8f6e1a4c8d5b1a', name: 'John Doe', email: 'johndoe.testplayer@example.com' },
        { _id: '653a1a3b1a8f6e1a4c8d5b1b', name: 'Alice Silva', email: 'alicesilva.testplayer@example.com' },
        { _id: '653a1a3b1a8f6e1a4c8d5b1c', name: 'Peter Perera', email: 'peterp.testplayer@example.com' },
    ];
    res.status(200).json(dummyPlayers);
};