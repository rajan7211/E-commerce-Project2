import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware";
import { authValidation } from "../validations/auth.validation";

// Import Auth Controllers 

import {
  register,
  login,
  verifyOtp,
  resendOtp,
} from "../controllers/AuthController";

// Import Forgot Password Controllers 
import {
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../controllers/ForgotPasswordController";

const router = Router();

// ==================== REGISTRATION & LOGIN ====================

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Pass@123"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "Pass@123"
 *               role:
 *                 type: string
 *                 enum: [customer, seller, admin]
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registration successful. Please check your email for OTP verification."
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  "/register",
  validateRequest(authValidation.register),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Pass@123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *                 data:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
router.post(
  "/login",
  validateRequest(authValidation.login),
  login
);

// ==================== EMAIL VERIFICATION OTP ====================

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP code during registration
 *     tags: [Email Verification]
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
 *                 format: email
 *                 example: "john@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully. You can now login."
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post(
  "/verify-otp",
  validateRequest(authValidation.verifyOtp),
  verifyOtp
);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to email
 *     tags: [Email Verification]
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
 *                 format: email
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully to your email."
 *       400:
 *         description: Email already verified
 *       404:
 *         description: User not found
 */
router.post(
  "/resend-otp",
  validateRequest(authValidation.resendOtp),
  resendOtp
);

// ==================== FORGOT PASSWORD ====================

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Forgot Password]
 *     description: Send password reset OTP to user email
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
 *                 format: email
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset OTP has been sent to your email."
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/forgot-password",
  validateRequest(authValidation.forgotPassword),
  forgotPassword
);

/**
 * @swagger
 * /auth/verify-forgot-password-otp:
 *   post:
 *     summary: Verify password reset OTP
 *     tags: [Forgot Password]
 *     description: Verify the OTP sent for password reset
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
 *                 format: email
 *                 example: "john@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     email:
 *                       type: string
 *                     verified:
 *                       type: boolean
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post(
  "/verify-forgot-password-otp",
  validateRequest(authValidation.verifyForgotPasswordOtp),
  verifyForgotPasswordOtp
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with verified OTP
 *     tags: [Forgot Password]
 *     description: Update user password after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - new_password
 *               - confirm_password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               new_password:
 *                 type: string
 *                 format: password
 *                 example: "NewPass@123"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "NewPass@123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password has been reset successfully. You can now login."
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or OTP not verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/reset-password",
  validateRequest(authValidation.resetPassword),
  resetPassword
);

export default router;







