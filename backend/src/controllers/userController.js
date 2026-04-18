import pool from '../config/db.js';

export const registerUser = async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
            [full_name, email, password]
        );
        res.status(201).json({ message: "User created!", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length === 0) return res.status(401).json({ message: "Invalid credentials" });
        res.json({ message: "Welcome back!", user: users[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};