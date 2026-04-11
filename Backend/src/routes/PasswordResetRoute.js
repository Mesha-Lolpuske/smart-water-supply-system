// routes/passwordResetRoutes.js
import express from 'express';
import {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
  resendResetOTP
} from '../controllers/PasswordReset.js';

const router = express.Router();

/**
 * @swagger
 * /api/password-reset/request:
 *   post:
 *     summary: Request password reset (send OTP)
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */
router.post('/request', requestPasswordReset);

/**
 * @swagger
 * /api/password-reset/verify-otp:
 *   post:
 *     summary: Verify reset OTP
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post('/verify-otp', verifyResetOTP);

/**
 * @swagger
 * /api/password-reset/reset:
 *   post:
 *     summary: Reset password
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input or OTP
 *       404:
 *         description: User not found
 */
router.post('/reset', resetPassword);

/**
 * @swagger
 * /api/password-reset/resend-otp:
 *   post:
 *     summary: Resend password reset OTP
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset code resent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.post('/resend-otp', resendResetOTP);

export default router;