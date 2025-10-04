"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailOtp = void 0;
// src/models/email-otp.model.ts
const mongoose_1 = require("mongoose");
const EmailOtpSchema = new mongoose_1.Schema({
    email: { type: String, index: true, required: true },
    purpose: { type: String, enum: ["signup", "reset"], required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 }, // TTL: auto-delete at this time
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    userData: {
        name: { type: String },
        password: { type: String }
    }
}, { timestamps: false });
EmailOtpSchema.index({ email: 1, purpose: 1 }, { unique: true });
exports.EmailOtp = (0, mongoose_1.model)("EmailOtp", EmailOtpSchema);
