// File: frontend/src/pages/SalaryReportPage.jsx

import React, { useState } from 'react';
import salaryService from '../services/salaryService';
// <-- 1. Import our new PDF utility function
import { exportSalaryReportAsPDF } from '../utils/pdfGenerator'; 

const SalaryReportPage = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [report, setReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = () => {
        setIsLoading(true);
        setError('');
        setReport([]);

        salaryService.calculateSalaries(year, month)
            .then(res => setReport(res.data))
            .catch(err => setError('Could not generate report. ' + (err.response?.data?.message || '')))
            .finally(() => setIsLoading(false));
    };
    
    // --- 2. ADD THIS NEW FUNCTION TO HANDLE THE PDF DOWNLOAD ---
    const handleDownloadPDF = () => {
        // Prevent download if there is no data
        if (report.length === 0) {
            alert('Please generate a report first before downloading.');
            return;
        }
        
        // Get the full month name (e.g., "September") to use in the PDF title
        const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
        
        // Call the exporter utility function with the current report data
        exportSalaryReportAsPDF(report, year, monthName);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <main className="container mx-auto p-4 md:p-8 max-w-6xl">
                
                {/* --- Page Header now includes the Download Button --- */}
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                    <h1 className="text-4xl font-bold tracking-wide text-slate-800 mb-4 md:mb-0">
                        Salary Report
                    </h1>
                    {/* --- 3. THE BUTTON IS UPDATED AND WIRED UP --- */}
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={report.length === 0 || isLoading} 
                        className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700 transition duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download as PDF
                    </button>
                </div>

                {/* Report Generator Form (no changes here) */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block font-semibold text-gray-700">Year</label>
                            <select value={year} onChange={e => setYear(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1">
                                {[...Array(5)].map((_, i) => <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">Month</label>
                            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1">
                                {Array.from({length: 12}, (_, i) => new Date(0, i)).map(date => 
                                    <option key={date.getMonth()} value={date.getMonth() + 1}>
                                        {date.toLocaleString('default', { month: 'long' })}
                                    </option>
                                )}
                            </select>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading} className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition duration-300 w-full h-10 font-semibold disabled:bg-slate-400">
                            {isLoading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>

                 {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</p>}
                
                {/* Report Display Table (no changes here) */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="border-b bg-slate-100">
                                <tr>
                                    {['Coach Name', 'Basic Salary', 'Full Days', 'Half Days', 'Net Salary (LKR)'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {report.map(rec => (
                                    <tr key={rec.coachId} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold">{rec.coachName}</td>
                                        <td className="px-4 py-3">{Number(rec.basicSalary).toLocaleString()}</td>
                                        <td className="px-4 py-3">{rec.fullDays}</td>
                                        <td className="px-4 py-3">{rec.halfDays}</td>
                                        <td className="px-4 py-3 font-bold text-slate-700">{Number(rec.netSalary).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {report.length === 0 && !isLoading && <p className="text-center py-8 text-gray-500">Please generate a report to see salary data.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SalaryReportPage;