import { Request, Response } from "express";
import { Purchase } from "../models/purchase.model";
import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import {
  HORSE_POWER_OPTIONS,
  COLOR_OPTIONS,
  CAR_COMPANIES,
} from "../types/purchase.types";

// Create a new purchase
export const createPurchase = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body; // Data is already validated by middleware
    const userId = (req as any).userId; // Get userId from token (set by authenticate middleware)

    // Check if serial number already exists
    const existingSerial = await Purchase.findOne({
      serialNo: validatedData.serialNo,
    });
    if (existingSerial) {
      return ApiResponse.error(
        res,
        StatusCodes.CONFLICT,
        "Serial number already exists",
        null
      );
    }

    // Check if engine number already exists
    const existingEngine = await Purchase.findOne({
      engineNumber: validatedData.engineNumber,
    });
    if (existingEngine) {
      return ApiResponse.error(
        res,
        StatusCodes.CONFLICT,
        "Engine number already exists",
        null
      );
    }

    // Check if chasis number already exists
    const existingChasis = await Purchase.findOne({
      chasisNumber: validatedData.chasisNumber,
    });
    if (existingChasis) {
      return ApiResponse.error(
        res,
        StatusCodes.CONFLICT,
        "Chasis number already exists",
        null
      );
    }

    // Check if registration number already exists
    const existingRegistration = await Purchase.findOne({
      registration: validatedData.registration,
    });
    if (existingRegistration) {
      return ApiResponse.error(
        res,
        StatusCodes.CONFLICT,
        "Registration number already exists",
        null
      );
    }

    const purchase = new Purchase({ ...validatedData, userId });
    await purchase.save();

    ApiResponse.success(
      res,
      StatusCodes.CREATED,
      "Purchase created successfully",
      purchase
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get all purchases with pagination and filtering
export const getPurchases = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      company,
      carModel,
      isNew,
    } = req.query; // Data is already validated by middleware

    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // Apply filters
    if (search) {
      filter.$or = [
        { serialNo: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { carModel: { $regex: search, $options: "i" } },
        { engineNumber: { $regex: search, $options: "i" } },
        { chasisNumber: { $regex: search, $options: "i" } },
        { registration: { $regex: search, $options: "i" } },
      ];
    }

    if (company) filter.company = company;
    if (carModel) filter.carModel = carModel;
    if (isNew !== undefined) filter.isNew = isNew;

    const purchases = await Purchase.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Purchase.countDocuments(filter);

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Purchases retrieved successfully",
      {
        purchases,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      }
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get purchase by ID
export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID is already validated by middleware

    const purchase = await Purchase.findById(id).populate(
      "userId",
      "name email"
    );

    if (!purchase) {
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Purchase not found",
        null
      );
    }

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Purchase retrieved successfully",
      purchase
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Update purchase
export const updatePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID is already validated by middleware
    const validatedData = req.body; // Data is already validated by middleware

    // Check for duplicate values if they're being updated
    if (validatedData.serialNo) {
      const existingSerial = await Purchase.findOne({
        serialNo: validatedData.serialNo,
        _id: { $ne: id },
      });
      if (existingSerial) {
        return ApiResponse.error(
          res,
          StatusCodes.CONFLICT,
          "Serial number already exists",
          null
        );
      }
    }

    if (validatedData.engineNumber) {
      const existingEngine = await Purchase.findOne({
        engineNumber: validatedData.engineNumber,
        _id: { $ne: id },
      });
      if (existingEngine) {
        return ApiResponse.error(
          res,
          StatusCodes.CONFLICT,
          "Engine number already exists",
          null
        );
      }
    }

    if (validatedData.chasisNumber) {
      const existingChasis = await Purchase.findOne({
        chasisNumber: validatedData.chasisNumber,
        _id: { $ne: id },
      });
      if (existingChasis) {
        return ApiResponse.error(
          res,
          StatusCodes.CONFLICT,
          "Chasis number already exists",
          null
        );
      }
    }

    if (validatedData.registration) {
      const existingRegistration = await Purchase.findOne({
        registration: validatedData.registration,
        _id: { $ne: id },
      });
      if (existingRegistration) {
        return ApiResponse.error(
          res,
          StatusCodes.CONFLICT,
          "Registration number already exists",
          null
        );
      }
    }

    const purchase = await Purchase.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email");

    if (!purchase) {
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Purchase not found",
        null
      );
    }

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Purchase updated successfully",
      purchase
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Delete purchase
export const deletePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID is already validated by middleware

    const purchase = await Purchase.findByIdAndDelete(id);

    if (!purchase) {
      return ApiResponse.error(
        res,
        StatusCodes.NOT_FOUND,
        "Purchase not found",
        null
      );
    }

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Purchase deleted successfully",
      null
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get purchase statistics
export const getPurchaseStats = async (req: Request, res: Response) => {
  try {
    const stats = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          newCars: { $sum: { $cond: ["$isNew", 1, 0] } },
          usedCars: { $sum: { $cond: ["$isNew", 0, 1] } },
          totalAmount: { $sum: "$purchaseAmount" },
          averageAmount: { $avg: "$purchaseAmount" },
        },
      },
    ]);

    const result = stats[0] || {
      totalPurchases: 0,
      newCars: 0,
      usedCars: 0,
      totalAmount: 0,
      averageAmount: 0,
    };

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Purchase statistics retrieved successfully",
      result
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get dropdown options
export const getDropdownOptions = async (req: Request, res: Response) => {
  try {
    const options = {
      horsePower: HORSE_POWER_OPTIONS,
      colors: COLOR_OPTIONS,
      companies: CAR_COMPANIES,
    };

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Dropdown options retrieved successfully",
      options
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};

// Get next serial number
export const getNextSerialNumber = async (req: Request, res: Response) => {
  try {
    const lastPurchase = await Purchase.findOne()
      .sort({ serialNo: -1 })
      .select("serialNo");

    let nextSerial = 1;
    if (lastPurchase && lastPurchase.serialNo) {
      const lastSerial = parseInt(lastPurchase.serialNo);
      if (!isNaN(lastSerial)) {
        nextSerial = lastSerial + 1;
      }
    }

    ApiResponse.success(
      res,
      StatusCodes.OK,
      "Next serial number retrieved successfully",
      {
        nextSerialNumber: nextSerial.toString(),
      }
    );
  } catch (error: any) {
    ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      null
    );
  }
};
