// src/models/email-otp.model.ts
import { model, Schema } from "mongoose";

const EmailOtpSchema = new Schema({
	email: { type: String, index: true, required: true },
	purpose: { type: String, enum: ["signup", "reset"], required: true },
	codeHash: { type: String, required: true },
	expiresAt: { type: Date, required: true, expires: 0 }, // TTL: auto-delete at this time
	attempts: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

EmailOtpSchema.index({ email: 1, purpose: 1 }, { unique: true });

export const EmailOtp = model("EmailOtp", EmailOtpSchema);