import pool from '../config/db.js';
import { calculateWaitTime } from '../services/predictionService.js';

export const generateToken = async (req, res) => {
    const { userId, department } = req.body;

    try {
        // 1. Get the Smart Wait Time & Position directly from the service
        // We pass 'department' so it counts people in the right line
        const waitData = await calculateWaitTime(department);
        
        const position = waitData.peopleAhead + 1;
        const waitTimeMinutes = waitData.estimatedWaitTime;

        // 2. Generate a random Token Number
        const tokenNum = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Insert into the database
        // NOTE: Ensure your table has a column named 'position_in_queue' 
        // or just use 'status' to track them.
        const [result] = await pool.query(
            'INSERT INTO tokens (token_number, user_id, department, status) VALUES (?, ?, ?, "waiting")',
            [tokenNum, userId, department]
        );

        // 4. Send the full response back to Postman
        res.status(201).json({
            message: "Token generated successfully!",
            tokenData: {
                id: result.insertId,
                tokenNumber: tokenNum,
                position: position,
                department: department,
                estimatedWaitTime: `${waitTimeMinutes} mins`
            }
        });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getQueueStatus = async (req, res) => {
    try {
        // We select more details so the frontend can show a nice list
        const [tokens] = await pool.query(
            'SELECT token_number, department, status, created_at FROM tokens WHERE status = "waiting" OR status = "called" ORDER BY created_at ASC'
        );
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};