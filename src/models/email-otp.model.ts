// src/models/email-otp.model.ts
import { model, Schema } from "mongoose";

const EmailOtpSchema = new Schema(
  {
    email: { type: String, required: true },
    purpose: { type: String, enum: ["signup", "reset"], required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 }, // TTL: auto-delete at this time
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    userData: {
      name: { type: String },
      password: { type: String },
    },
  },
  { timestamps: false }
);

export const EmailOtp = model("EmailOtp", EmailOtpSchema);
