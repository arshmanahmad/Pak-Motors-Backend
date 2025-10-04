"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
// Create transporter for sending emails
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        service: 'hotmail', // Using Outlook/Hotmail instead of Gmail
        auth: {
            user: env_1.env.EMAIL_USER,
            pass: env_1.env.EMAIL_PASSWORD
        }
    });
};
// Email templates
const getOtpEmailTemplate = (code, purpose) => {
    const subject = purpose === 'signup'
        ? 'Verify Your Email - Pak Motors'
        : 'Reset Your Password - Pak Motors';
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
        <h2 style="color: #333; margin-top: 0;">${purpose === 'signup' ? 'Welcome to Pak Motors!' : 'Password Reset Request'}</h2>
        <p style="font-size: 16px; margin-bottom: 25px;">
          ${purpose === 'signup'
        ? 'Thank you for signing up with Pak Motors. To complete your registration, please verify your email address using the OTP below:'
        : 'You have requested to reset your password. Use the OTP below to proceed:'}
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px dashed #667eea;">
          <h3 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px; font-weight: bold;">${code}</h3>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          This OTP is valid for <strong>10 minutes</strong> and can only be used once.
        </p>
      </div>
      
      <div style="text-align: center; color: #666; font-size: 14px;">
        <p>If you didn't request this ${purpose === 'signup' ? 'verification' : 'password reset'}, please ignore this email.</p>
        <p style="margin-top: 20px;">
          <strong>Pak Motors Team</strong><br>
          Your trusted automotive partner
        </p>
      </div>
    </body>
    </html>
  `;
    const text = `
    ${purpose === 'signup' ? 'Welcome to Pak Motors!' : 'Password Reset Request'}
    
    ${purpose === 'signup'
        ? 'Thank you for signing up with Pak Motors. To complete your registration, please verify your email address using the OTP below:'
        : 'You have requested to reset your password. Use the OTP below to proceed:'}
    
    Your OTP: ${code}
    
    This OTP is valid for 10 minutes and can only be used once.
    
    If you didn't request this ${purpose === 'signup' ? 'verification' : 'password reset'}, please ignore this email.
    
    Pak Motors Team
  `;
    return { subject, html, text };
};
const sendOtpEmail = async (email, code, purpose = 'signup') => {
    try {
        // In development mode, skip actual email sending
        const isDev = env_1.env.NODE_ENV !== 'production';
        if (isDev) {
            console.log('🔧 DEVELOPMENT MODE: Email sending disabled');
            console.log(`📧 Would send OTP ${code} to ${email}`);
            console.log('📝 Email content:', {
                subject: purpose === 'signup' ? 'Verify Your Email - Pak Motors' : 'Reset Your Password - Pak Motors',
                code: code,
                recipient: email
            });
            return {
                success: true,
                messageId: 'dev-mode-' + Date.now(),
                devMode: true
            };
        }
        console.log('Email config:', {
            user: env_1.env.EMAIL_USER,
            hasPassword: !!env_1.env.EMAIL_PASSWORD,
            email: email
        });
        const transporter = createTransporter();
        const { subject, html, text } = getOtpEmailTemplate(code, purpose);
        const mailOptions = {
            from: `"Pak Motors" <${env_1.env.EMAIL_USER}>`,
            to: email,
            subject,
            text,
            html
        };
        console.log('Sending email with options:', { to: email, subject });
        const result = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};
exports.sendOtpEmail = sendOtpEmail;
const sendWelcomeEmail = async (email, name) => {
    try {
        // In development mode, skip actual email sending
        const isDev = env_1.env.NODE_ENV !== 'production';
        if (isDev) {
            console.log('🔧 DEVELOPMENT MODE: Welcome email sending disabled');
            console.log(`📧 Would send welcome email to ${name} (${email})`);
            return {
                success: true,
                messageId: 'dev-mode-welcome-' + Date.now(),
                devMode: true
            };
        }
        const transporter = createTransporter();
        const subject = 'Welcome to Pak Motors!';
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
            from: `"Pak Motors" <${env_1.env.EMAIL_USER}>`,
            to: email,
            subject,
            text,
            html
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}:`, result.messageId);
        return { success: true, messageId: result.messageId };
    }
    catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
