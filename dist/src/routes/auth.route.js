"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const email_service_1 = require("../services/email.service");
const validateRequest_1 = require("../utils/validateRequest");
const user_schema_1 = require("../schema/user.schema");
exports.authRouter = (0, express_1.Router)();
// Auth routes with validation
exports.authRouter.post("/register", (0, validateRequest_1.validateBody)(user_schema_1.UserSchema), auth_controller_1.register);
exports.authRouter.post("/verify-otp", (0, validateRequest_1.validateBody)(user_schema_1.VerifyOtpSchema), auth_controller_1.verifyOtp);
exports.authRouter.post("/login", (0, validateRequest_1.validateBody)(user_schema_1.LoginSchema), auth_controller_1.login);
// Test email endpoint with validation
exports.authRouter.post("/test-email", (0, validateRequest_1.validateBody)(user_schema_1.EmailSchema), async (req, res) => {
    try {
        const { email } = req.body; // Data is already validated by middleware
        const result = await (0, email_service_1.sendOtpEmail)(email, "123456", "signup");
        res.json({ success: true, result });
    }
    catch (error) {
        res.json({ success: false, error: error.message });
    }
});
