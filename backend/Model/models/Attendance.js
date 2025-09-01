// File: backend/Model/models/Attendance.js
// Description: Defines the Mongoose schema and model for the Attendance collection.

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    // It's best practice to link to the actual Coach document using its ObjectId
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach', // This should match the name of your Coach model when you create it
        required: [true, 'Coach ID is required.'],
    },
    // Storing the name separately makes it easier to display on the frontend
    // without needing to populate from the Coach collection every time.
    coachName: {
        type: String,
        required: [true, 'Coach name is required.'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required.'],
    },
    status: {
        type: String,
        required: [true, 'Status is required.'],
        // 'enum' ensures that the 'status' field can only contain one of these specified values.
        enum: ['Work Full-Day', 'Work Half-Day','Absent','Duty-Leave'],
    },
    // An optional field for adding reasons, e.g., "Sick leave", "Personal appointment"
    notes: {
        type: String,
        required: false,
    },
});

// CRITICAL: This database index prevents creating duplicate records
// for the same coach on the same day, ensuring data integrity.
attendanceSchema.index({ coachId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);