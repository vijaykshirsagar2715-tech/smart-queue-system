import pool from '../config/db.js';
import { calculateWaitTime } from '../services/predictionService.js';

// 1. FOR THE USER: Generate a new token
export const generateToken = async (req, res) => {
    const { user_id, department } = req.body;

    if (!user_id || !department) {
        return res.status(400).json({ message: "Missing user_id or department from frontend" });
    }

    try {
        const waitData = await calculateWaitTime(department);
        
        const position = waitData.peopleAhead + 1;
        const waitTimeMinutes = waitData.estimatedWaitTime;

        const tokenNum = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;

        const [result] = await pool.query(
            'INSERT INTO tokens (token_number, user_id, department, status) VALUES (?, ?, ?, "waiting")',
            [tokenNum, user_id, department]
        );

        // 🛠️ THE FIX: Safety check before emitting the WebSocket!
        const io = req.app.get('socketio');
        if (io) {
            io.emit('queueUpdated');
        } else {
            console.warn("Socket.io is not initialized yet, skipping real-time update.");
        }

        res.status(201).json({
            message: "Token generated successfully!",
            tokenData: {
                id: result.insertId,
                token_number: tokenNum, 
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

// 2. FOR BOTH: Get the live list of people waiting
export const getQueueStatus = async (req, res) => {
    try {
        const [tokens] = await pool.query(
            'SELECT token_number, department, status, created_at FROM tokens WHERE status = "waiting" OR status = "called" ORDER BY created_at ASC'
        );
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. FOR THE ADMIN: Call the next person in line
export const callNextToken = async (req, res) => {
    // 🛠️ THE FIX: Extract the specific department the Admin is managing
    const { department } = req.body; 

    if (!department) {
        return res.status(400).json({ message: "Missing department from admin request" });
    }

    try {
        // Step A: Mark the currently 'called' person in THIS department as 'completed'
        await pool.query('UPDATE tokens SET status = "completed" WHERE status = "called" AND department = ?', [department]);

        // Step B: Find the person who has been waiting the longest in THIS department
        const [nextInLine] = await pool.query(
            'SELECT * FROM tokens WHERE status = "waiting" AND department = ? ORDER BY created_at ASC LIMIT 1',
            [department]
        );

        if (nextInLine.length === 0) {
            return res.status(404).json({ message: "Queue is empty! No one is waiting in this department." });
        }

        // Step C: Mark the new person as 'called'
        const nextTokenNumber = nextInLine[0].token_number;
        await pool.query('UPDATE tokens SET status = "called" WHERE token_number = ?', [nextTokenNumber]);

        // Step D: Safely update WebSockets so the User Dashboard sees the change instantly
        const io = req.app.get('socketio');
        if (io) {
            io.emit('queueUpdated');
        }

        res.status(200).json({ 
            message: "Next token called successfully!", 
            token: nextTokenNumber 
        });

    } catch (error) {
        console.error("Error calling next token:", error);
        res.status(500).json({ error: error.message });
    }
};