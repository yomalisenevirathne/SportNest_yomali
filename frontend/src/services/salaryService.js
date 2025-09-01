// File: frontend/src/services/salaryService.js

import axios from 'axios';
const API_URL = 'http://localhost:5000/api/salaries';

const calculateSalaries = (year, month) => {
    return axios.post(`${API_URL}/calculate`, { year, month });
};

export default {
    calculateSalaries,
};