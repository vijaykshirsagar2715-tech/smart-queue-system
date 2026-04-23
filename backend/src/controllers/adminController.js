import pool from '../config/db.js';

// 1. CALL NEXT: Moves the oldest 'waiting' person to 'called'
// Add this to your backend controller file
export const callNextToken = async (req, res) => {
    try {
        // 1. Take whoever is currently "called" and mark them as "completed"
        await pool.query('UPDATE tokens SET status = "completed" WHERE status = "called"');

        // 2. Find the person who has been "waiting" the longest (the front of the line)
       // New Query for Segregation
const [nextInLine] = await pool.query(
    'SELECT * FROM tokens WHERE status = "waiting" AND department = ? ORDER BY created_at ASC LIMIT 1',
    [adminDepartment]
);

        // 3. If the queue is empty, tell the frontend
        if (nextInLine.length === 0) {
            return res.status(404).json({ message: "Queue is empty! No one is waiting." });
        }

        // 4. Mark the next person in line as "called"
        const nextTokenId = nextInLine[0].id;
        await pool.query('UPDATE tokens SET status = "called" WHERE id = ?', [nextTokenId]);

        // 5. Send success back to the admin dashboard
        res.status(200).json({ 
            message: "Next token called successfully!", 
            token: nextInLine[0].token_number 
        });

    } catch (error) {
        console.error("Error calling next token:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. COMPLETE: Moves the 'called' person to 'completed'
// This is what actually triggers the "Wait Time" to drop for others
export const completeService = async (req, res) => {
    const { tokenId } = req.body; // You pass the ID of the token being served

    try {
        const [result] = await pool.query(
            'UPDATE tokens SET status = "completed" WHERE id = ? AND status = "called"',
            [tokenId]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Token not found or not currently being called." });
        }

        res.status(200).json({ message: "Service completed. Queue updated!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};