import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js'; // Import the new routes
import queueRoutes from './routes/queueRoutes.js'; // 1. Import it
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/queue', queueRoutes); // 2. Use it
app.use('/api/admin', adminRoutes);


// Home route
app.get('/', (req, res) => res.send('Smart Queue API is live!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));