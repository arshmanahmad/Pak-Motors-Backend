import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
// import  jwt  from "jsonwebtoken";

// const {JWT_SECRET_KEY} = env;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token =  authHeader && authHeader.split(' ')[1];

    if(!token){
        return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, "Unauthorized", "No token provided");
    }
        // jwt.verify(token,JWT_SECRET_KEY as string)
    next();
}