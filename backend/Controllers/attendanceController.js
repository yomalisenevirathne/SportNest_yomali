// File: backend/Controllers/attendanceController.js
// Description: Contains all the business logic for handling attendance-related API requests.

const Attendance = require('../Model/models/Attendance');

/**
 * @desc    Get all attendance records
 * @route   GET /api/attendance
 */
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find().sort({ date: -1 }); // Sort by date, newest first
        res.status(200).json(records);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Mark or update attendance (Upsert Operation)
 * @route   POST /api/attendance
 */
exports.markAttendance = async (req, res) => {
    try {
        const { coachId, coachName, date, status, notes } = req.body;

        if (!coachId || !coachName || !date || !status) {
            return res.status(400).json({ message: 'Coach ID, name, date, and status are required fields.' });
        }
        
        const attendanceRecord = await Attendance.findOneAndUpdate(
            { coachId, date: new Date(date).setHours(0, 0, 0, 0) },
            { coachName, status, notes },                         
            { new: true, upsert: true, runValidators: true }     
        );

        res.status(201).json(attendanceRecord);

    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * @desc    Delete an attendance record by its ID
 * @route   DELETE /api/attendance/:id
 */
exports.deleteAttendance = async (req, res) => {
    try {
        const record = await Attendance.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Attendance record not found.' });
        }
        res.status(200).json({ message: 'Attendance record deleted successfully.' });
    } catch (error) {
        console.error("Error deleting attendance:", error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// --- THIS FUNCTION HAS BEEN UPDATED ---
/**
 * @desc    Get a list of coaches (for the frontend dropdown)
 * @route   GET /api/attendance/coaches
 */
exports.getCoaches = (req, res) => {
    // FIX: The _id values in this mock data now use the correct MongoDB ObjectId format.
    // This ensures that the ID saved with the attendance record matches the ID used in the salary calculation.
    // In a real application, you would fetch both `_id` and `name` directly from the `coaches` database collection.
    const dummyCoaches = [
        { _id: '6543b5e43a6d71f654f5d1b1', name: 'Mr. Perera' },
        { _id: '6543b5e43a6d71f654f5d1b2', name: 'Ms. Kumari' },
        { _id: '6543b5e43a6d71f654f5d1b3', name: 'Mr. Silva' },
    ];
    res.status(200).json(dummyCoaches);
};