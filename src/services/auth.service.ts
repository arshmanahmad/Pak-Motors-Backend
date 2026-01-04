import bcrypt from "bcrypt";
import { EmailOtp } from "../models/email-otp.model";
import { User } from "../models/user.model";
import { env } from "../config/env";
import { sendOtpEmail } from "./email.service";

const genCode = (len: number) =>
  Math.floor(Math.random() * 10 ** len)
    .toString()
    .padStart(len, "0");

export async function requestSignupOtp(email: string) {
  const code = genCode(Number(process.env.OTP_LENGTH || 6));
  const codeHash = await bcrypt.hash(code, env.BCRYPT_SALT_ROUNDS);
  const expiresAt = new Date(
    Date.now() + Number(process.env.OTP_EXP_MIN || 10) * 60 * 1000
  );

  await EmailOtp.findOneAndUpdate(
    { email, purpose: "signup" },
    { codeHash, expiresAt, attempts: 0, createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Send OTP email
  const emailResult = await sendOtpEmail(email, code, "signup");

  return {
    emailSent: emailResult.success,
    messageId: emailResult.messageId,
  };
}

export async function verifySignupOtp(email: string, code: string) {
  const rec = await EmailOtp.findOne({ email, purpose: "signup" });
  if (
    !rec ||
    rec.expiresAt < new Date() ||
    rec.attempts >= Number(process.env.OTP_MAX_ATTEMPTS || 5)
  ) {
    return { ok: false };
  }
  const ok = await bcrypt.compare(code, rec.codeHash);
  if (!ok) {
    await EmailOtp.updateOne({ _id: rec._id }, { $inc: { attempts: 1 } });
    return { ok: false };
  }
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name: "",
      password: "",
      isEmailVerified: true,
    });
  } else {
    await user.updateOne({ isEmailVerified: true });
  }
  await EmailOtp.deleteOne({ _id: rec._id });
  return { ok: true, userId: user._id };
}
