const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
// ⚠️ UPDATE 'password' to your actual MySQL root password!
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vijay@2005', // <-- UPDATE THIS
    database: 'smartq_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// 2. SIGNUP ROUTE
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    console.log("Signup attempt for:", email); // Add this line to debug!
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Signup failed: " + err.message });
        }
        res.status(201).json({ message: "User created successfully!" });
    });
});

// 3. LOGIN ROUTE
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, data) => {
        if (err) return res.status(500).json({ message: "Database error" });
        
        if (data.length > 0) {
            // Send back user info (but not the password!)
            res.json({ 
                id: data[0].id, 
                name: data[0].name, 
                email: data[0].email 
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});

// 4. QUEUE BOOKING ROUTE
app.post('/api/queue/book', (req, res) => {
    const { department } = req.body;
    // Generate a random token like EM-482
    const tokenNumber = `${department.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`;
    
    res.json({ 
        message: 'Token generated successfully!', 
        tokenData: { token_number: tokenNumber } 
    });
});

app.get('/test', (req, res) => {
    res.send("Server is alive and reaching this path!");
});

app.listen(5000, () => {
    console.log("Backend server running on http://localhost:5000");
});