// File: frontend/src/services/attendanceService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

const getCoaches = () => axios.get(`${API_URL}/coaches`);
const getAllAttendance = () => axios.get(API_URL);
const markAttendance = (data) => axios.post(API_URL, data);
const deleteAttendance = (id) => axios.delete(`${API_URL}/${id}`);

export default {
    getCoaches,
    getAllAttendance,
    markAttendance,
    deleteAttendance,
};