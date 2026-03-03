// routes/passwordResetRoutes.js
import express from 'express';
import {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
  resendResetOTP
} from '../controllers/PasswordReset.js';

const router = express.Router();

router.post('/request', requestPasswordReset);
router.post('/verify-otp', verifyResetOTP);
router.post('/reset', resetPassword);
router.post('/resend-otp', resendResetOTP);

export default router;