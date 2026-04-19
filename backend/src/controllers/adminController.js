import pool from '../config/db.js';

export const callNextToken = async (req, res) => {
    try {
        const [nextInLine] = await pool.query(
            'SELECT * FROM tokens WHERE status = "waiting" ORDER BY created_at ASC LIMIT 1'
        );

        if (nextInLine.length === 0) {
            return res.status(404).json({ message: "No one is waiting in the queue." });
        }

        const tokenId = nextInLine[0].id;

        await pool.query(
            'UPDATE tokens SET status = "in-service", position_in_queue = 0 WHERE id = ?',
            [tokenId]
        );

        res.json({
            message: "Next customer called!",
            token: nextInLine[0].token_number
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const completeService = async (req, res) => {
    const { tokenId } = req.body;
    try {
        await pool.query(
            'UPDATE tokens SET status = "completed" WHERE id = ?',
            [tokenId]
        );
        res.json({ message: "Service marked as completed." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};