"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
exports.ApiResponse = {
    success: (res, statusCode = 200, message, data) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },
    error: (res, statusCode = 400, message, data) => {
        return res.status(statusCode).json({
            success: false,
            message,
            data
        });
    }
};
