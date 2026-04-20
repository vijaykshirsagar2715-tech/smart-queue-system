import pool from '../config/db.js';

/**
 * Calculates the estimated wait time for a new user.
 * Formula: (Number of people already waiting) * (Average service time)
 */
export const calculateWaitTime = async (department) => {
    try {
        // 1. Count how many people are currently 'waiting' or 'called' (being served)
        // We exclude 'completed' because they are already done.
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM tokens WHERE department = ? AND (status = "waiting" OR status = "called")',
            [department]
        );

        const peopleInQueue = rows[0].count;

        // 2. Define average time per person (e.g., 5 minutes)
        const AVERAGE_SERVICE_TIME = 5; 

        // 3. Simple Prediction Logic
        const waitTimeMinutes = peopleInQueue * AVERAGE_SERVICE_TIME;

        return {
            peopleAhead: peopleInQueue,
            estimatedWaitTime: waitTimeMinutes,
            formattedTime: `${waitTimeMinutes} mins`
        };
    } catch (error) {
        console.error("Error in Prediction Service:", error);
        throw error;
    }
};