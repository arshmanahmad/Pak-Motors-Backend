import { Request, Response } from "express";
import { Company } from "../models/company.model";
import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = (req as any).userId; // Get userId from token (set by authenticate middleware)

    const exists = await Company.findOne({
      userId: userId,
      name: data.name,
    });
    if (exists)
      return ApiResponse.error(
        res,
        StatusCodes.CONFLICT,
        "Company already exists",
        null
      );
    const company = await Company.create({ ...data, userId });
    return ApiResponse.success(
      res,
      StatusCodes.CREATED,
      "Company created",
      company
    );
  } catch (error: any) {
    return ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

export const listCompanies = async (req: Request, res: Response) => {
  try {
    // Use validatedQuery if available (from validation middleware), merge with req.query for other params
    const validatedQuery = (req as any).validatedQuery || {};
    const query = { ...req.query, ...validatedQuery };
    const { page = 1, limit = 10, search } = query as any;
    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (query.userId) filter.userId = query.userId;
    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Company.countDocuments(filter);
    return ApiResponse.success(res, StatusCodes.OK, "Companies fetched", {
      companies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company)
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Company not found",
        null
      );
    return ApiResponse.success(res, StatusCodes.OK, "Company fetched", company);
  } catch (error: any) {
    return ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = (req as any).userId; // Get userId from token (set by authenticate middleware)

    if (data.name) {
      const exists = await Company.findOne({
        _id: { $ne: id },
        userId: userId,
        name: data.name,
      });
      if (exists)
        return ApiResponse.error(
          res,
          StatusCodes.CONFLICT,
          "Company already exists",
          null
        );
    }
    const company = await Company.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!company)
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Company not found",
        null
      );
    return ApiResponse.success(res, StatusCodes.OK, "Company updated", company);
  } catch (error: any) {
    return ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company)
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Company not found",
        null
      );
    return ApiResponse.success(res, StatusCodes.OK, "Company deleted", null);
  } catch (error: any) {
    return ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};
