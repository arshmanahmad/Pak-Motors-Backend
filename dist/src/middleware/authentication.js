"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../config/env");
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized", "No token provided");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET_KEY);
        // Attach userId to request object
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized", "Invalid or expired token");
    }
};
exports.authenticate = authenticate;
