import { Request, Response } from "express";
import { ApiResponse } from "../utils/response";
import User from "../models/user.model";

export const register = async (req: Request, res: Response) => {
    try{
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return ApiResponse.error(res, 400, "Invalid request", "Name, email and password are required");
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return ApiResponse.error(res, 400, "Invalid request", "User already exists");
        }
        const user = await User.create({ name, email, password });
        // const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY as string);

        ApiResponse.success(res, 201, "User registered successfully", req.body);
    }catch(error){
        ApiResponse.error(res, 500, "Internal server error", error);
    }
}