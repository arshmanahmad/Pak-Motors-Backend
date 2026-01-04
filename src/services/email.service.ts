import nodemailer from "nodemailer";
import { env } from "../config/env";

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Using Outlook/Hotmail instead of Gmail
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
  });
};

// Email templates
const getOtpEmailTemplate = (
  code: string,
  purpose: "signup" | "login" | "reset"
) => {
  const subject =
    purpose === "signup"
      ? "Verify Your Email - Pak Motors"
      : purpose === "login"
      ? "Login Verification Code - Pak Motors"
      : "Reset Your Password - Pak Motors";

  const heading =
    purpose === "signup"
      ? "Welcome to Pak Motors!"
      : purpose === "login"
      ? "Login Verification"
      : "Password Reset Request";

  const intro =
    purpose === "signup"
      ? "Thank you for signing up with Pak Motors. To complete your registration, please verify your email address using the OTP below:"
      : purpose === "login"
      ? "Use the OTP below to verify your login and continue securely:"
      : "You have requested to reset your password. Use the OTP below to proceed:";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Pak Motors</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Your trusted automotive partner</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #333; margin-top: 0;">${heading}</h2>
        <p style="font-size: 16px; margin-bottom: 25px;">
          ${intro}
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px dashed #667eea;">
          <h3 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px; font-weight: bold;">${code}</h3>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          This OTP is valid for <strong>10 minutes</strong> and can only be used once.
        </p>
      </div>
      
      <div style="text-align: center; color: #666; font-size: 14px;">
        <p>If you didn't request this ${
          purpose === "signup"
            ? "verification"
            : purpose === "login"
            ? "login verification"
            : "password reset"
        }, please ignore this email.</p>
        <p style="margin-top: 20px;">
          <strong>Pak Motors Team</strong><br>
          Your trusted automotive partner
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
${heading}

${intro}

Your OTP: ${code}

This OTP is valid for 10 minutes and can only be used once.

If you didn't request this ${
    purpose === "signup"
      ? "verification"
      : purpose === "login"
      ? "login verification"
      : "password reset"
  }, please ignore this email.

Pak Motors Team
  `;

  return { subject, html, text };
};

export const sendOtpEmail = async (
  email: string,
  code: string,
  purpose: "signup" | "login" | "reset" = "signup"
) => {
  try {
    // ALWAYS send email now (no dev short-circuit)
    console.log("Email config:", {
      user: env.EMAIL_USER,
      hasPassword: !!env.EMAIL_PASSWORD,
      email: email,
      purpose,
    });

    const transporter = createTransporter();
    const { subject, html, text } = getOtpEmailTemplate(code, purpose);

    const mailOptions = {
      from: `"Pak Motors" <${env.EMAIL_USER}>`,
      to: email,
      subject,
      text,
      html,
    };

    console.log("Sending email with options:", { to: email, subject, purpose });
    const result = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const transporter = createTransporter();

    const subject = "Welcome to Pak Motors!";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Pak Motors</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Pak Motors!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for joining Pak Motors! Your account has been successfully created and verified.
          </p>
          <p style="font-size: 16px;">
            You can now access all our services and start your automotive journey with us.
          </p>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
          <p><strong>Pak Motors Team</strong><br>Your trusted automotive partner</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to Pak Motors!

Hello ${name}!

Thank you for joining Pak Motors! Your account has been successfully created and verified.

You can now access all our services and start your automotive journey with us.

Pak Motors Team
    `;

    const mailOptions = {
      from: `"Pak Motors" <${env.EMAIL_USER}>`,
      to: email,
      subject,
      text,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};
