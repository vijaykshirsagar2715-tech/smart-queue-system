import pool from '../config/db.js';
import { calculateWaitTime } from '../services/predictionService.js';

export const generateToken = async (req, res) => {
    const { userId, department } = req.body;

    try {
        // 1. Calculate the current position (Count everyone with 'waiting' status)
        const [rows] = await pool.query(
            'SELECT COUNT(*) as count FROM tokens WHERE status = "waiting"'
        );
        const position = rows[0].count + 1;

        // 2. Calculate the Smart Wait Time using our service
        const waitTimeMinutes = calculateWaitTime(position);

        // 3. Generate a random Token Number
        const tokenNum = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;

        // 4. Insert into the database
        const [result] = await pool.query(
            'INSERT INTO tokens (token_number, user_id, department, position_in_queue) VALUES (?, ?, ?, ?)',
            [tokenNum, userId, department, position]
        );

        // 5. Send the full response back to Postman
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
        res.status(500).json({ error: error.message });
    }
};

export const getQueueStatus = async (req, res) => {
    try {
        const [tokens] = await pool.query(
            'SELECT token_number, position_in_queue, status FROM tokens WHERE status = "waiting" ORDER BY created_at ASC'
        );
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};