import { Request, Response } from "express";
import { CarModel } from "../models/car-model.model";
import { Company } from "../models/company.model";
import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";

export const createCarModel = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const company = await Company.findOne({ _id: data.companyId, userId: data.userId });
        if (!company) return ApiResponse.error(res, StatusCodes.BAD_REQUEST, "Invalid company for this user", null);
        const exists = await CarModel.findOne({ userId: data.userId, companyId: data.companyId, name: data.name });
        if (exists) return ApiResponse.error(res, StatusCodes.CONFLICT, "Model already exists for this company", null);
        const carModel = await CarModel.create(data);
        return ApiResponse.success(res, StatusCodes.CREATED, "Model created", carModel);
    } catch (error: any) {
        return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
}

export const listCarModels = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, companyId, userId } = req.query as any;
        const skip = (Number(page) - 1) * Number(limit);
        const filter: any = {};
        if (userId) filter.userId = userId;
        if (companyId) filter.companyId = companyId;
        if (search) filter.name = { $regex: search, $options: 'i' };
        const models = await CarModel.find(filter).populate('companyId', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        const total = await CarModel.countDocuments(filter);
        return ApiResponse.success(res, StatusCodes.OK, "Models fetched", {
            models,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error: any) {
        return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
}

export const getCarModel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const carModel = await CarModel.findById(id).populate('companyId', 'name');
        if (!carModel) return ApiResponse.error(res, StatusCodes.NOT_FOUND, "Model not found", null);
        return ApiResponse.success(res, StatusCodes.OK, "Model fetched", carModel);
    } catch (error: any) {
        return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
}

export const updateCarModel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.name || data.companyId) {
            const exists = await CarModel.findOne({ _id: { $ne: id }, userId: data.userId, companyId: data.companyId, name: data.name });
            if (exists) return ApiResponse.error(res, StatusCodes.CONFLICT, "Model already exists for this company", null);
        }
        const carModel = await CarModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!carModel) return ApiResponse.error(res, StatusCodes.NOT_FOUND, "Model not found", null);
        return ApiResponse.success(res, StatusCodes.OK, "Model updated", carModel);
    } catch (error: any) {
        return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
}

export const deleteCarModel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const carModel = await CarModel.findByIdAndDelete(id);
        if (!carModel) return ApiResponse.error(res, StatusCodes.NOT_FOUND, "Model not found", null);
        return ApiResponse.success(res, StatusCodes.OK, "Model deleted", null);
    } catch (error: any) {
        return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
}


