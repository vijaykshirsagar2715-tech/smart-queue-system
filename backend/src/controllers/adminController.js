import pool from '../config/db.js';

// 1. CALL NEXT: Moves the oldest 'waiting' person to 'called'
export const callNextToken = async (req, res) => {
    try {
        const [nextInLine] = await pool.query(
            'SELECT id, token_number FROM tokens WHERE status = "waiting" ORDER BY created_at ASC LIMIT 1'
        );

        if (nextInLine.length === 0) {
            return res.status(404).json({ message: "No one is waiting in the queue!" });
        }

        const tokenId = nextInLine[0].id;
        await pool.query('UPDATE tokens SET status = "called" WHERE id = ?', [tokenId]);

        res.status(200).json({
            message: `Now calling ${nextInLine[0].token_number}`,
            tokenId: tokenId
        });
    } catch (error) {
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