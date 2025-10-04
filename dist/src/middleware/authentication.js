"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
// import  jwt  from "jsonwebtoken";
// const {JWT_SECRET_KEY} = env;
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized", "No token provided");
    }
    // jwt.verify(token,JWT_SECRET_KEY as string)
    next();
};
exports.authenticate = authenticate;
