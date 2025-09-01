// File: backend/Controllers/salaryController.js

const Coach = require('../Model/models/Coach');
const Attendance = require('../Model/models/Attendance');

/**
 * @desc    Calculate salaries for all coaches for a given month and year.
 * @route   POST /api/salaries/calculate
 */
exports.calculateSalaries = async (req, res) => {
    try {
        const { year, month } = req.body;

        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required fields.' });
        }

        // --- ROBUST DATE RANGE CALCULATION ---
        // This is the corrected logic to avoid timezone and boundary issues.
        // It queries for records >= the start of the month and < the start of the NEXT month.
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));
        const daysInMonth = new Date(year, month, 0).getDate();

        // 1. Get all coaches
        const coaches = await Coach.find();
        if (coaches.length === 0) {
            return res.status(404).json({ message: 'No coaches were found in the database.' });
        }
        
        // 2. Process salary calculation for each coach
        const salaryReport = await Promise.all(coaches.map(async (coach) => {
            
            // Find attendance records using the robust date query
            const records = await Attendance.find({
                coachId: coach._id,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            });

            // Calculate counts for each relevant status type
            let fullDays = 0;
            let halfDays = 0;
            records.forEach(rec => {
                // IMPORTANT: Ensure these strings EXACTLY match the options in your frontend dropdown and backend enum
                if (rec.status === 'Work Full-Day') fullDays++;
                if (rec.status === 'Work Half-Day') halfDays++;
                // Note: 'Duty-Leave' is considered paid, so we don't need to count it for deductions here.
                // 'Absent' days are also not counted, resulting in a lower salary.
            });

            // Perform salary calculation
            const salaryPerDay = coach.basicSalary > 0 && daysInMonth > 0 ? coach.basicSalary / daysInMonth : 0;
            const attendedDaysValue = (fullDays * 1) + (halfDays * 0.5);
            const netSalary = salaryPerDay * attendedDaysValue;
            
            // Structure the report for this coach
            return {
                coachId: coach._id,
                coachName: coach.name,
                basicSalary: coach.basicSalary,
                year,
                month,
                fullDays,
                halfDays,
                netSalary: netSalary.toFixed(2),
            };
        }));
        
        // 3. Send the final report back
        res.status(200).json(salaryReport);

    } catch (error) {
        console.error("Error during salary calculation:", error);
        res.status(500).json({ message: 'An unexpected server error occurred.', error: error.message });
    }
};

/**
 * @desc    Seeds the database with initial coach data for testing.
 * @route   POST /api/salaries/seed
 */
exports.seedCoaches = async (req, res) => {
    try {
        // Clear existing coaches to prevent duplicates when re-seeding
        await Coach.deleteMany();
        
        const testCoaches = [
            // Using predefined, valid MongoDB ObjectIds for consistency
            { _id: '6543b5e43a6d71f654f5d1b1', name: 'Mr. Perera', basicSalary: 100000 },
            { _id: '6543b5e43a6d71f654f5d1b2', name: 'Ms. Kumari', basicSalary: 95000 },
            { _id: '6543b5e43a6d71f654f5d1b3', name: 'Mr. Silva', basicSalary: 110000 },
        ];

        await Coach.insertMany(testCoaches);
        res.status(201).send('Test coaches seeded successfully!');
    } catch(error) {
        console.error("Error seeding coaches:", error);
        res.status(500).json({ message: 'Seeding failed.', error: error.message });
    }
};