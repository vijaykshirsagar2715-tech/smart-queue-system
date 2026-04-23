import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2';

// Import the routing file we fixed earlier!
import queueRoutes from './routes/queueRoutes.js'; // Adjust the path if your routes folder is somewhere else

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// 1. WEBSOCKET SETUP (Must happen after app is created)
// ==========================================
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// This makes the socket available to your queueController!
app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('A user connected to the live queue: ', socket.id);
});

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vijay@2005',
    database: 'smart_queue' // I changed this back to smart_queue based on your .env!
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// ==========================================
// 3. AUTH ROUTES (From your snippet)
// ==========================================
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    console.log("Signup attempt for:", email); 
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Signup failed: " + err.message });
        }
        res.status(201).json({ message: "User created successfully!" });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, data) => {
        if (err) return res.status(500).json({ message: "Database error" });
        
        if (data.length > 0) {
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

// ==========================================
// 4. QUEUE ROUTES (Using the modular files we built)
// ==========================================
// This connects the logic we wrote in queueRoutes.js to the main server
app.use('/api/queue', queueRoutes); 
app.use('/api', queueRoutes); // Added to catch the /api/admin/next route

app.get('/test', (req, res) => {
    res.send("Server is alive and reaching this path!");
});

// ==========================================
// 5. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

// CRITICAL: We use server.listen instead of app.listen to enable WebSockets
server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT} with WebSockets enabled!`);
});