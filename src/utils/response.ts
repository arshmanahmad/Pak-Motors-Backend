import { Response } from "express";

export const ApiResponse ={
    success: (res: Response, statusCode = 200, message: string, data: any) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },
    error: (res: Response, statusCode = 400, message: string, data: any) => {
        return res.status(statusCode).json({
            success: false,
            message,
            data
        });
    }
}