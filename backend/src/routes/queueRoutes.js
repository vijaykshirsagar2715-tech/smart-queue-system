import express from 'express';
import { generateToken, getQueueStatus } from '../controllers/queueController.js';

const router = express.Router();

// This is what the frontend will call
router.post('/book', generateToken);

// This is what the Admin Dashboard calls
router.get('/status', getQueueStatus);

export default router;