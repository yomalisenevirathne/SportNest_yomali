// File: frontend/src/utils/pdfGenerator.js

import jsPDF from 'jspdf';
import 'jspdf-autotable'; // This is a plugin, so we just need to import it

// This function will generate the PDF
export const exportSalaryReportAsPDF = (reportData, year, monthName) => {
    // 1. Initialize a new jsPDF document
    const doc = new jsPDF('landscape', 'pt', 'a4'); // orientation, unit, format

    // 2. Define the columns for our table
    const tableColumns = ["Coach Name", "Basic Salary (LKR)", "Full Days", "Half Days", "Net Salary (LKR)"];
    
    // 3. Map the report data to the format the table needs (an array of arrays)
    const tableRows = reportData.map(item => [
        item.coachName,
        Number(item.basicSalary).toLocaleString(),
        item.fullDays,
        item.halfDays,
        Number(item.netSalary).toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })
    ]);

    // 4. Use the autoTable plugin to draw the table
    doc.autoTable({
        head: [tableColumns], // The header row
        body: tableRows,       // The data rows
        startY: 80,           // Where the table starts on the page (from the top)
        headStyles: {
            fillColor: [44, 62, 80], // slate-800 color for the header
            fontSize: 10,
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        // --- Add a header to the document ---
        didDrawPage: function(data) {
            // Header
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.text('SportNest - Monthly Salary Report', data.settings.margin.left, 50);
            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.text(`Report for: ${monthName} ${year}`, data.settings.margin.left, 70);
            
            // Footer (optional)
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    // 5. Save the PDF with a dynamic filename
    doc.save(`salary-report-${monthName.toLowerCase()}-${year}.pdf`);
};