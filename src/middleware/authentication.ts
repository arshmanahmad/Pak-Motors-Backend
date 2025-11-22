import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return ApiResponse.error(
      res,
      StatusCodes.UNAUTHORIZED,
      "Unauthorized",
      "No token provided"
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY as string) as {
      userId: string;
    };
    // Attach userId to request object
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    return ApiResponse.error(
      res,
      StatusCodes.UNAUTHORIZED,
      "Unauthorized",
      "Invalid or expired token"
    );
  }
};
