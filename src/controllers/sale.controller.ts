import { Request, Response } from "express";
import { Sale } from "../models/sale.model";
import { ApiResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";

// Create a new sale
export const createSale = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body; // Data is already validated by middleware
    const userId = (req as any).userId; // Get userId from token (set by authenticate middleware)

    // Convert date string to Date object
    const saleData = {
      ...validatedData,
      date: new Date(validatedData.date),
      userId,
    };

    const sale = new Sale(saleData);
    await sale.save();

    // Populate references for response
    const populatedSale = await Sale.findById(sale._id)
      .populate("buyer.id", "name phone1 address")
      .populate("witness.id", "name phone1 address")
      .populate("car.id", "serialNo company carModel registration");

    ApiResponse.success(
      res,
      StatusCodes.CREATED,
      "Sale created successfully",
      populatedSale
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
