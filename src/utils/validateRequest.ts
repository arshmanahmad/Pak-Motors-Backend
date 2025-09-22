import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "./response";
import { z } from "zod";


export const validateRequest = (req: Request, res: Response, schema: z.ZodSchema) => {
    return async (next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            ApiResponse.error(res, 400, "Invalid request", error);
        }
    }
}