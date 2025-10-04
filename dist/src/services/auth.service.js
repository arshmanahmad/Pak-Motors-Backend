"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSignupOtp = requestSignupOtp;
exports.verifySignupOtp = verifySignupOtp;
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_otp_model_1 = require("../models/email-otp.model");
const user_model_1 = require("../models/user.model");
const env_1 = require("../config/env");
const email_service_1 = require("./email.service");
const genCode = (len) => Math.floor(Math.random() * 10 ** len).toString().padStart(len, "0");
async function requestSignupOtp(email) {
    const code = genCode(Number(process.env.OTP_LENGTH || 6));
    const codeHash = await bcrypt_1.default.hash(code, env_1.env.BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXP_MIN || 10) * 60 * 1000);
    await email_otp_model_1.EmailOtp.findOneAndUpdate({ email, purpose: "signup" }, { codeHash, expiresAt, attempts: 0, createdAt: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true });
    // Send OTP email
    const emailResult = await (0, email_service_1.sendOtpEmail)(email, code, "signup");
    // In development, also return the code for testing
    const isDev = env_1.env.NODE_ENV !== "production";
    return {
        devCode: isDev ? code : undefined,
        emailSent: emailResult.success,
        messageId: emailResult.messageId
    };
}
async function verifySignupOtp(email, code) {
    const rec = await email_otp_model_1.EmailOtp.findOne({ email, purpose: "signup" });
    if (!rec || rec.expiresAt < new Date() || rec.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)) {
        return { ok: false };
    }
    const ok = await bcrypt_1.default.compare(code, rec.codeHash);
    if (!ok) {
        await email_otp_model_1.EmailOtp.updateOne({ _id: rec._id }, { $inc: { attempts: 1 } });
        return { ok: false };
    }
    let user = await user_model_1.User.findOne({ email });
    if (!user) {
        user = await user_model_1.User.create({ email, name: "", password: "", isEmailVerified: true });
    }
    else {
        await user.updateOne({ isEmailVerified: true });
    }
    await email_otp_model_1.EmailOtp.deleteOne({ _id: rec._id });
    return { ok: true, userId: user._id };
}
