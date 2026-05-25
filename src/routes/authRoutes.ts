import express from 'express';
import { authUser, registerUser, getUserProfile, getAllUsers } from '../controllers/authController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile);
router.get('/users', protect, admin, getAllUsers);

export default router;
