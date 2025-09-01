// File: frontend/src/pages/AttendanceManagementPage.jsx
// Description: The main UI component for managing coach attendance.

import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';

const AttendanceManagementPage = () => {
    // State variables to hold data and manage UI
    const [coaches, setCoaches] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    // Default status now matches the updated dropdown options
    const [status, setStatus] = useState('Work Full-Day');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to fetch initial data from the backend
    const fetchData = () => {
        Promise.all([
            attendanceService.getCoaches(),
            attendanceService.getAllAttendance()
        ])
        .then(([coachesRes, attendanceRes]) => {
            setCoaches(coachesRes.data);
            setAttendance(attendanceRes.data);
        })
        .catch(err => setError('Failed to load data. Please ensure the backend server is running.'));
    };

    // useEffect hook to run fetchData() once when the component first loads
    useEffect(() => {
        fetchData();
    }, []);

    // Handles the form submission to mark or update attendance
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedCoach || !date || !status) {
            setError('Please select a coach, date, and status.');
            return;
        }

        const selectedCoachObj = coaches.find(c => c._id === selectedCoach);
        if (!selectedCoachObj) return;

        const dataToSubmit = { coachId: selectedCoach, coachName: selectedCoachObj.name, date, status };

        attendanceService.markAttendance(dataToSubmit)
            .then(() => {
                setSuccess(`Attendance successfully marked for ${selectedCoachObj.name}.`);
                fetchData(); // Refresh the attendance list
            })
            .catch(err => setError('Failed to mark attendance. An entry for this day may already exist.'));
    };
    
    // Handles the deletion of an attendance record
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this record?')) {
            attendanceService.deleteAttendance(id)
            .then(() => {
                setSuccess('Record deleted successfully.');
                fetchData();
            })
            .catch(err => setError('Failed to delete the record.'));
        }
    };
    
    // --- HELPER FUNCTION FOR STYLING ---
    // This function takes a status string and returns the correct Tailwind CSS classes.
    // This is much cleaner and more maintainable than a complex ternary operator.
    const getStatusStyles = (statusValue) => {
        switch (statusValue) {
            case 'Work Full-Day':
                return 'bg-green-100 text-green-800';
            case 'Work Half-Day':
                return 'bg-yellow-100 text-yellow-800';
            case 'Duty-Leave':
                return 'bg-blue-100 text-blue-800';
            case 'Absent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800'; // Fallback style
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <header className="bg-slate-800 text-white text-center py-5 shadow-lg">
                <h1 className="text-4xl font-bold tracking-wide">Coach Attendance Management</h1>
            </header>
            <main className="container mx-auto p-4 md:p-8 max-w-5xl">
                {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-6 border border-red-200">{error}</p>}
                {success && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-6 border border-green-200">{success}</p>}

                {/* --- Attendance Form Section --- */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Mark / Update Attendance...</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block font-semibold text-gray-700">Coach</label>
                            <select value={selectedCoach} onChange={e => setSelectedCoach(e.target.value)} className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-slate-500">
                                <option value="" disabled>Select Coach</option>
                                {coaches.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-slate-500"/>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-slate-500">
                                <option>Work Full-Day</option>
                                <option>Work Half-Day</option>
                                <option>Absent</option>
                                <option>Duty-Leave</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition duration-300 w-full h-10 font-semibold">Mark</button>
                    </form>
                </div>

                {/* --- Attendance History Table --- */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Attendance History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="border-b bg-slate-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Coach</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(rec => (
                                    <tr key={rec._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-800">{rec.coachName}</td>
                                        <td className="px-4 py-3 text-gray-800">{new Date(rec.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            {/* Using the helper function for clean and maintainable styling */}
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusStyles(rec.status)}`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleDelete(rec._id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AttendanceManagementPage;