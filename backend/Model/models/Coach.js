// File: backend/Model/models/Coach.js

const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    basicSalary: {
        type: Number,
        required: [true, 'Basic salary is required.'],
        default: 0,
    },
});

module.exports = mongoose.model('Coach', coachSchema);
