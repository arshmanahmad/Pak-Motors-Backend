"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.login = exports.register = void 0;
const response_1 = require("../utils/response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const email_otp_model_1 = require("../models/email-otp.model");
const email_service_1 = require("../services/email.service");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        if (!name || !email || !password) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Name, email and password are required");
        }
        // Check if user already exists
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "User already exists");
        }
        // Validate password strength
        if (password.length < 8) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Password must be at least 8 characters long");
        }
        // Check if there's already a pending OTP for this email
        const existingOtp = await email_otp_model_1.EmailOtp.findOne({ email, purpose: "signup" });
        if (existingOtp && existingOtp.expiresAt > new Date()) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "OTP already sent. Please check your email or wait for it to expire");
        }
        // Generate OTP code
        const code = Math.floor(Math.random() * 10 ** 6).toString().padStart(6, "0");
        const codeHash = await bcrypt_1.default.hash(code, env_1.env.BCRYPT_SALT_ROUNDS);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Store OTP and user data together
        await email_otp_model_1.EmailOtp.findOneAndUpdate({ email, purpose: "signup" }, {
            codeHash,
            expiresAt,
            attempts: 0,
            createdAt: new Date(),
            userData: { name, password: await bcrypt_1.default.hash(password, env_1.env.BCRYPT_SALT_ROUNDS) }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        // Send OTP email
        const emailResult = await (0, email_service_1.sendOtpEmail)(email, code, "signup");
        const isDev = env_1.env.NODE_ENV !== "production";
        const result = {
            devCode: isDev ? code : undefined,
            emailSent: emailResult.success,
            messageId: emailResult.messageId
        };
        response_1.ApiResponse.success(res, 200, "OTP sent to your email. Please verify to complete registration.", {
            devCode: result.devCode,
            emailSent: result.emailSent
        });
    }
    catch (error) {
        console.error("Register error:", error);
        const errMsg = error instanceof Error ? error.message : String(error);
        response_1.ApiResponse.error(res, 500, "Internal server error", errMsg);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Email and password are required");
        }
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "User not found");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Invalid password");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.env.JWT_SECRET_KEY);
        response_1.ApiResponse.success(res, 200, "Login successful", { token });
    }
    catch (error) {
        response_1.ApiResponse.error(res, 500, "Internal server error", error);
    }
};
exports.login = login;
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Email and OTP are required");
        }
        const otpRecord = await email_otp_model_1.EmailOtp.findOne({ email, purpose: "signup" });
        if (!otpRecord) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "OTP not found or expired");
        }
        if (otpRecord.expiresAt < new Date()) {
            await email_otp_model_1.EmailOtp.deleteOne({ _id: otpRecord._id });
            return response_1.ApiResponse.error(res, 400, "Invalid request", "OTP expired");
        }
        const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);
        if (otpRecord.attempts >= maxAttempts) {
            await email_otp_model_1.EmailOtp.deleteOne({ _id: otpRecord._id });
            return response_1.ApiResponse.error(res, 429, "Too many attempts", "OTP attempt limit reached. Please register again.");
        }
        const otpOk = await bcrypt_1.default.compare(otp, otpRecord.codeHash);
        if (!otpOk) {
            await email_otp_model_1.EmailOtp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Invalid OTP");
        }
        // Check if user data exists (from registration step)
        if (!otpRecord.userData) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Registration data not found. Please register again.");
        }
        // Create user with stored data
        const user = await user_model_1.User.create({
            name: otpRecord.userData.name,
            email: email,
            password: otpRecord.userData.password
        });
        // Clean up OTP record
        await email_otp_model_1.EmailOtp.deleteOne({ _id: otpRecord._id });
        // Send welcome email
        await (0, email_service_1.sendWelcomeEmail)(email, otpRecord.userData.name);
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.env.JWT_SECRET_KEY);
        response_1.ApiResponse.success(res, 201, "Registration completed successfully", { token });
    }
    catch (error) {
        response_1.ApiResponse.error(res, 500, "Internal server error", error);
    }
};
exports.verifyOtp = verifyOtp;
