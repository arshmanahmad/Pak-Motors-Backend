import { Request, Response } from "express";
import { ApiResponse } from "../utils/response";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { EmailOtp } from "../models/email-otp.model";
import { sendWelcomeEmail, sendOtpEmail } from "../services/email.service";

/**
 * SIGNUP (OTP required)
 * 1) User submits name/email/password
 * 2) Generate OTP, store hash with userData
 * 3) Send OTP email
 * 4) Response DOES NOT include devCode (frontend pe OTP show na ho)
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!name || !email || !password) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "Name, email and password are required"
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "User already exists"
      );
    }

    if (password.length < 8) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "Password must be at least 8 characters long"
      );
    }

    const existingOtp = await EmailOtp.findOne({ email, purpose: "signup" });
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "OTP already sent. Please check your email or wait for it to expire"
      );
    }

    const code = Math.floor(Math.random() * 10 ** 6)
      .toString()
      .padStart(6, "0");
    const codeHash = await bcrypt.hash(code, env.BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await EmailOtp.findOneAndUpdate(
      { email, purpose: "signup" },
      {
        codeHash,
        expiresAt,
        attempts: 0,
        createdAt: new Date(),
        userData: {
          name,
          password: await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const emailResult = await sendOtpEmail(email, code, "signup");

    // NOTE: No devCode in response so OTP UI par show na ho
    return ApiResponse.success(
      res,
      200,
      "OTP sent to your email. Please verify to complete registration.",
      {
        emailSent: emailResult.success,
      }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return ApiResponse.error(res, 500, "Internal server error", errMsg);
  }
};

/**
 * VERIFY SIGNUP OTP
 * - creates user, sends welcome email, returns JWT
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string };
    if (!email || !otp) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "Email and OTP are required"
      );
    }

    const otpRecord = await EmailOtp.findOne({ email, purpose: "signup" });
    if (!otpRecord) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "OTP not found or expired"
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await EmailOtp.deleteOne({ _id: otpRecord._id });
      return ApiResponse.error(res, 400, "Invalid request", "OTP expired");
    }

    const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);
    if (otpRecord.attempts >= maxAttempts) {
      await EmailOtp.deleteOne({ _id: otpRecord._id });
      return ApiResponse.error(
        res,
        429,
        "Too many attempts",
        "OTP attempt limit reached. Please register again."
      );
    }

    const otpOk = await bcrypt.compare(otp, otpRecord.codeHash);
    if (!otpOk) {
      await EmailOtp.updateOne(
        { _id: otpRecord._id },
        { $inc: { attempts: 1 } }
      );
      return ApiResponse.error(res, 400, "Invalid request", "Invalid OTP");
    }

    if (!otpRecord.userData) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "Registration data not found. Please register again."
      );
    }

    // Check if user already exists (in case of duplicate verification attempts)
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        name: otpRecord.userData.name,
        email,
        password: otpRecord.userData.password,
      });

      await EmailOtp.deleteOne({ _id: otpRecord._id });
      await sendWelcomeEmail(
        email as string,
        otpRecord.userData.name as string
      );

      const token = jwt.sign(
        { userId: user._id },
        env.JWT_SECRET_KEY as string
      );
      return ApiResponse.success(
        res,
        201,
        "Registration completed successfully",
        { token }
      );
    } else {
      // User already exists, just log them in
      await EmailOtp.deleteOne({ _id: otpRecord._id });

      const token = jwt.sign(
        { userId: user._id },
        env.JWT_SECRET_KEY as string
      );
      return ApiResponse.success(
        res,
        200,
        "User already registered. Login successful",
        { token }
      );
    }
  } catch (error) {
    return ApiResponse.error(res, 500, "Internal server error", error);
  }
};

/**
 * SIGNIN (NO OTP)
 * - If user exists & password valid -> return JWT directly
 * - If user not found -> ask to sign up
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    if (!email || !password) {
      return ApiResponse.error(
        res,
        400,
        "Invalid request",
        "Email and password are required"
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.error(res, 400, "Invalid request", "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.error(res, 400, "Invalid request", "Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET_KEY as string);
    return ApiResponse.success(res, 200, "Login successful", { token });
  } catch (error) {
    return ApiResponse.error(res, 500, "Internal server error", error);
  }
};
