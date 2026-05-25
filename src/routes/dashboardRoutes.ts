import express from 'express';
import { getDashboardStats, getOverdueTasks } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/overdue', protect, getOverdueTasks);

export default router;
