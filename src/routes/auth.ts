import { Router } from "express";
import { validateRequest } from "../middlewares/validation.middleware";
import { authValidation } from "../validations/auth.validation";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.register),
  AuthController.register
);


router.post(
  "/verify-otp",
  validateRequest(authValidation.verifyOtp),
  AuthController.verifyOtp
);


router.post(
  "/resend-otp",
  validateRequest(authValidation.resendOtp),
  AuthController.resendOtp
);


router.post(
  "/login",
  validateRequest(authValidation.login),
  AuthController.login
);

export default router;
















