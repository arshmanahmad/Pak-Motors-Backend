import { Router } from "express";
import { register, login, verifyOtp } from "../controllers/auth.controller";
import { sendOtpEmail } from "../services/email.service";
import { validateBody } from "../utils/validateRequest";
import { UserSchema, LoginSchema, VerifyOtpSchema, EmailSchema } from "../schema/user.schema";

export const authRouter = Router();

// SIGNUP (OTP)
authRouter.post("/register",
  validateBody(UserSchema),
  register
);

authRouter.post("/verify-otp",
  validateBody(VerifyOtpSchema),
  verifyOtp
);

// SIGNIN (NO OTP)
authRouter.post("/login",
  validateBody(LoginSchema),
  login
);

// Test email endpoint (unchanged)
authRouter.post("/test-email",
  validateBody(EmailSchema),
  async (req, res) => {
    try {
      const { email } = req.body;
      const result = await sendOtpEmail(email, "123456", "signup");
      res.json({ success: true, result });
    } catch (error: any) {
      res.json({ success: false, error: error.message });
    }
  }
);
