import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js'; // Import the new routes

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); 

// Home route
app.get('/', (req, res) => res.send('Smart Queue API is live!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));