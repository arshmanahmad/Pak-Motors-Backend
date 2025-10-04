import { Request, Response } from "express";
import { ApiResponse } from "../utils/response";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { EmailOtp } from "../models/email-otp.model";
import { requestSignupOtp as requestSignupOtpSvc } from "../services/auth.service";
import { sendWelcomeEmail, sendOtpEmail } from "../services/email.service";

export const register = async (req: Request, res: Response) => {
	try{
		const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
		console.log(name, email, password);
		if(!name || !email || !password){
			return ApiResponse.error(res, 400, "Invalid request", "Name, email and password are required");
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if(existingUser){
			return ApiResponse.error(res, 400, "Invalid request", "User already exists");
		}

		// Validate password strength
		if(password.length < 8){
			return ApiResponse.error(res, 400, "Invalid request", "Password must be at least 8 characters long");
		}

		// Check if there's already a pending OTP for this email
		const existingOtp = await EmailOtp.findOne({ email, purpose: "signup" });
		if(existingOtp && existingOtp.expiresAt > new Date()){
			return ApiResponse.error(res, 400, "Invalid request", "OTP already sent. Please check your email or wait for it to expire");
		}

		// Generate OTP code
		const code = Math.floor(Math.random() * 10**6).toString().padStart(6, "0");
		const codeHash = await bcrypt.hash(code, env.BCRYPT_SALT_ROUNDS);
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		// Store OTP and user data together
		await EmailOtp.findOneAndUpdate(
			{ email, purpose: "signup" },
			{ 
				codeHash,
				expiresAt,
				attempts: 0,
				createdAt: new Date(),
				userData: { name, password: await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS) }
			},
			{ 
				upsert: true, 
				new: true, 
				setDefaultsOnInsert: true 
			}
		);

		// Send OTP email
		const emailResult = await sendOtpEmail(email, code, "signup");
		
		const isDev = env.NODE_ENV !== "production";
		const result = {
			devCode: isDev ? code : undefined,
			emailSent: emailResult.success,
			messageId: emailResult.messageId
		};
		ApiResponse.success(res, 200, "OTP sent to your email. Please verify to complete registration.", {
			devCode: result.devCode,
			emailSent: result.emailSent
		});

	} catch (error) {
		console.error("Register error:", error);
		const errMsg = error instanceof Error ? error.message : String(error);
		ApiResponse.error(res, 500, "Internal server error", errMsg);
	}
}

export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return ApiResponse.error(res, 400, "Invalid request", "Email and password are required");
        }
        const user = await User.findOne({ email });
        if(!user){
            return ApiResponse.error(res, 400, "Invalid request", "User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return ApiResponse.error(res, 400, "Invalid request", "Invalid password");
        }
			const token = jwt.sign({ userId: user._id }, env.JWT_SECRET_KEY as string);
			ApiResponse.success(res, 200, "Login successful", { token });
		}
    catch(error){
        ApiResponse.error(res, 500, "Internal server error", error);
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
	try{
		const { email, otp } = req.body as { email?: string; otp?: string };
		if(!email || !otp){
			return ApiResponse.error(res, 400, "Invalid request", "Email and OTP are required");
		}

		const otpRecord = await EmailOtp.findOne({ email, purpose: "signup" });
		if(!otpRecord){
			return ApiResponse.error(res, 400, "Invalid request", "OTP not found or expired");
		}

		if(otpRecord.expiresAt < new Date()){
			await EmailOtp.deleteOne({ _id: otpRecord._id });
			return ApiResponse.error(res, 400, "Invalid request", "OTP expired");
		}

		const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);
		if(otpRecord.attempts >= maxAttempts){
			await EmailOtp.deleteOne({ _id: otpRecord._id });
			return ApiResponse.error(res, 429, "Too many attempts", "OTP attempt limit reached. Please register again.");
		}

		const otpOk = await bcrypt.compare(otp, otpRecord.codeHash);
		if(!otpOk){
			await EmailOtp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
			return ApiResponse.error(res, 400, "Invalid request", "Invalid OTP");
		}

		// Check if user data exists (from registration step)
		if(!otpRecord.userData){
			return ApiResponse.error(res, 400, "Invalid request", "Registration data not found. Please register again.");
		}

		// Create user with stored data
		const user = await User.create({
			name: otpRecord.userData.name,
			email: email,
			password: otpRecord.userData.password
		});

		// Clean up OTP record
		await EmailOtp.deleteOne({ _id: otpRecord._id });

		// Send welcome email
		await sendWelcomeEmail(email as string, otpRecord.userData.name as string);

		const token = jwt.sign({ userId: user._id }, env.JWT_SECRET_KEY as string);
		ApiResponse.success(res, 201, "Registration completed successfully", { token });

	}catch(error){
		ApiResponse.error(res, 500, "Internal server error", error);
	}
}
