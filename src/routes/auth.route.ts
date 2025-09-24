import { Router } from "express";
import { register, login, verifyOtp } from "../controllers/auth.controller";
import { sendOtpEmail } from "../services/email.service";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/login", login);

// Test email endpoint
authRouter.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendOtpEmail(email || "test@example.com", "123456", "signup");
    res.json({ success: true, result });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});