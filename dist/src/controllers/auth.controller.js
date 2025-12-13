"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyOtp = exports.register = void 0;
const response_1 = require("../utils/response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const email_otp_model_1 = require("../models/email-otp.model");
const email_service_1 = require("../services/email.service");
/**
 * SIGNUP (OTP required)
 * 1) User submits name/email/password
 * 2) Generate OTP, store hash with userData
 * 3) Send OTP email
 * 4) Response DOES NOT include devCode (frontend pe OTP show na ho)
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Name, email and password are required");
        }
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "User already exists");
        }
        if (password.length < 8) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Password must be at least 8 characters long");
        }
        const existingOtp = await email_otp_model_1.EmailOtp.findOne({ email, purpose: "signup" });
        if (existingOtp && existingOtp.expiresAt > new Date()) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "OTP already sent. Please check your email or wait for it to expire");
        }
        const code = Math.floor(Math.random() * 10 ** 6)
            .toString()
            .padStart(6, "0");
        const codeHash = await bcrypt_1.default.hash(code, env_1.env.BCRYPT_SALT_ROUNDS);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await email_otp_model_1.EmailOtp.findOneAndUpdate({ email, purpose: "signup" }, {
            codeHash,
            expiresAt,
            attempts: 0,
            createdAt: new Date(),
            userData: {
                name,
                password: await bcrypt_1.default.hash(password, env_1.env.BCRYPT_SALT_ROUNDS),
            },
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        const emailResult = await (0, email_service_1.sendOtpEmail)(email, code, "signup");
        // NOTE: No devCode in response so OTP UI par show na ho
        return response_1.ApiResponse.success(res, 200, "OTP sent to your email. Please verify to complete registration.", {
            emailSent: emailResult.success,
        });
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return response_1.ApiResponse.error(res, 500, "Internal server error", errMsg);
    }
};
exports.register = register;
/**
 * VERIFY SIGNUP OTP
 * - creates user, sends welcome email, returns JWT
 */
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
        if (!otpRecord.userData) {
            return response_1.ApiResponse.error(res, 400, "Invalid request", "Registration data not found. Please register again.");
        }
        // Check if user already exists (in case of duplicate verification attempts)
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            // Create new user
            user = await user_model_1.User.create({
                name: otpRecord.userData.name,
                email,
                password: otpRecord.userData.password,
            });
            await email_otp_model_1.EmailOtp.deleteOne({ _id: otpRecord._id });
            await (0, email_service_1.sendWelcomeEmail)(email, otpRecord.userData.name);
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.env.JWT_SECRET_KEY);
            return response_1.ApiResponse.success(res, 201, "Registration completed successfully", { token });
        }
        else {
            // User already exists, just log them in
            await email_otp_model_1.EmailOtp.deleteOne({ _id: otpRecord._id });
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.env.JWT_SECRET_KEY);
            return response_1.ApiResponse.success(res, 200, "User already registered. Login successful", { token });
        }
    }
    catch (error) {
        return response_1.ApiResponse.error(res, 500, "Internal server error", error);
    }
};
exports.verifyOtp = verifyOtp;
/**
 * SIGNIN (NO OTP)
 * - If user exists & password valid -> return JWT directly
 * - If user not found -> ask to sign up
 */
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
        return response_1.ApiResponse.success(res, 200, "Login successful", { token });
    }
    catch (error) {
        return response_1.ApiResponse.error(res, 500, "Internal server error", error);
    }
};
exports.login = login;
