import express from 'express';
import { register, verifyOTP, resendOTP, login, logout} from '../controllers/authcontroller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);


export default router