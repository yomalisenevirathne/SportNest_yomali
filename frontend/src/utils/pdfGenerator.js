// File: frontend/src/utils/pdfGenerator.js
// Description: Utility function to generate a PDF salary report.

// --- FIX #1: Change the import style for the autotable plugin ---
// Instead of importing for side-effects, we import it as a function.
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

// This function will generate and trigger the download of the PDF
export const exportSalaryReportAsPDF = (reportData, year, monthName) => {
    // 1. Initialize a new jsPDF document
    const doc = new jsPDF({
        orientation: 'landscape', // Page orientation
        unit: 'pt',              // Measurement unit
        format: 'a4'             // Page size
    });

    // 2. Define the columns for our table header
    const tableColumns = ["Coach Name", "Basic Salary (LKR)", "Full Days", "Half Days", "Net Salary (LKR)"];
    
    // 3. Map our report data into a simple array of arrays format required by jspdf-autotable
    const tableRows = reportData.map(item => [
        item.coachName,
        Number(item.basicSalary).toLocaleString(),
        item.fullDays,
        item.halfDays,
        Number(item.netSalary).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
    ]);

    // --- FIX #2: Call autoTable as a function, passing the 'doc' object as the first argument ---
    // This is the correct way to use the plugin with the new import style.
    autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 85, // Give a little more space from the header text
        theme: 'grid', // 'striped', 'grid', or 'plain'
        headStyles: {
            fillColor: [44, 62, 80], // Corresponds to a dark slate color
            textColor: 255, // White text
            fontSize: 10,
            halign: 'center',
        },
        styles: {
            fontSize: 9,
            cellPadding: 5,
            valign: 'middle',
        },
        // This function is called for every page to add custom headers and footers
        didDrawPage: function(data) {
            // Document Header
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(40);
            doc.text('SportNest - Monthly Salary Report', data.settings.margin.left, 50);

            // Sub-header for the specific report period
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(`Report for: ${monthName} ${year}`, data.settings.margin.left, 70);
            
            // Document Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            const footerText = `Page ${data.pageNumber} of ${pageCount}`;
            const textWidth = doc.getStringUnitWidth(footerText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2; // Center the footer text
            doc.text(footerText, textX, doc.internal.pageSize.height - 20);
        }
    });

    // 5. Generate a dynamic filename and save the PDF, which triggers the browser download
    doc.save(`salary-report-${monthName.toLowerCase()}-${year}.pdf`);
};