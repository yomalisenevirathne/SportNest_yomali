//Oju5w6liX1d7sxW7
// app.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const feedbackRoutes = require('./Routes/feedback');
const attendanceRoutes = require('./Routes/attendance');
const salaryRoutes = require('./Routes/salaryRoutes');

const app = express();

// Middleware


app.use(cors());
app.use(express.json());

//API Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salaries', salaryRoutes);

// MongoDB Connection
mongoose.connect('mongodb+srv://coach:Oju5w6liX1d7sxW7@cluster0.z3pvqqh.mongodb.net/', {

}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error:", err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server run in port ${PORT}`);
});