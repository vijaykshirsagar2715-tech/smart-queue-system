import express from 'express';
import { generateToken, getQueueStatus } from '../controllers/queueController.js';

const router = express.Router();

// Route to book a new token
router.post('/book', generateToken);

// Route to see the live queue
router.get('/status', getQueueStatus);

export default router;