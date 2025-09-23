import { Request, Response } from "express";
import { ApiResponse } from "../utils/response";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { EmailOtp } from "../models/email-otp";
import { requestSignupOtp as requestSignupOtpSvc } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
	try{
		const { name, email, password, otp } = req.body as { name?: string; email?: string; password?: string; otp?: string };
		if(!name || !email || !password || !otp){
			return ApiResponse.error(res, 400, "Invalid request", "Name, email, password and otp are required");
		}
		const existingUser = await User.findOne({ email });
		if(existingUser){
			return ApiResponse.error(res, 400, "Invalid request", "User already exists");
		}

		const otpRecord = await EmailOtp.findOne({ email, purpose: "signup" });
		if(!otpRecord){
			return ApiResponse.error(res, 400, "Invalid request", "OTP not requested or expired");
		}
		if(otpRecord.expiresAt < new Date()){
			await EmailOtp.deleteOne({ _id: otpRecord._id });
			return ApiResponse.error(res, 400, "Invalid request", "OTP expired");
		}
		const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);
		if(otpRecord.attempts >= maxAttempts){
			return ApiResponse.error(res, 429, "Too many attempts", "OTP attempt limit reached");
		}
		const otpOk = await bcrypt.compare(otp, otpRecord.codeHash);
		if(!otpOk){
			await EmailOtp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
			return ApiResponse.error(res, 400, "Invalid request", "Invalid OTP");
		}

		const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
		const user = await User.create({ name, email, password: hashedPassword });
		await EmailOtp.deleteOne({ _id: otpRecord._id });

		const token = jwt.sign({ userId: user._id }, env.JWT_SECRET_KEY as string);
		ApiResponse.success(res, 201, "User registered successfully", { token });

	}catch(error){
		ApiResponse.error(res, 500, "Internal server error", error);
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

	export const requestSignupOtp = async (req: Request, res: Response) => {
		try{
			const { email } = req.body as { email?: string };
			if(!email){
				return ApiResponse.error(res, 400, "Invalid request", "Email is required");
			}
			const existingUser = await User.findOne({ email });
			if(existingUser){
				return ApiResponse.error(res, 400, "Invalid request", "User already exists");
			}
			const result = await requestSignupOtpSvc(email);
			ApiResponse.success(res, 200, "OTP sent to email", result);
		}catch(error){
			ApiResponse.error(res, 500, "Internal server error", error);
		}
	}
