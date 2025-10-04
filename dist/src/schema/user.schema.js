"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSchema = exports.VerifyOtpSchema = exports.LoginSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters")
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required")
});
exports.VerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits")
});
exports.EmailSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format")
});
