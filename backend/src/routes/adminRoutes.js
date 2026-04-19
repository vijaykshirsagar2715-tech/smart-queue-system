import express from 'express';
import { callNextToken, completeService } from '../controllers/adminController.js';

const router = express.Router();

// This handles: POST http://localhost:5000/api/admin/next
router.post('/next', callNextToken);

// This handles: POST http://localhost:5000/api/admin/complete
router.post('/complete', completeService);

export default router;