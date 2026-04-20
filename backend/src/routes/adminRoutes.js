import express from 'express';
import { callNextToken, completeService } from '../controllers/adminController.js';

const router = express.Router();

// Moves someone from 'waiting' -> 'called'
router.post('/next', callNextToken);

// Moves someone from 'called' -> 'completed'
router.post('/complete', completeService);

export default router;