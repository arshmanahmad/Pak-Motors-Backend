"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSale = void 0;
const sale_model_1 = require("../models/sale.model");
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
// Create a new sale
const createSale = async (req, res) => {
    try {
        const validatedData = req.body; // Data is already validated by middleware
        const userId = req.userId; // Get userId from token (set by authenticate middleware)
        // Convert date string to Date object
        const saleData = {
            ...validatedData,
            date: new Date(validatedData.date),
            userId,
        };
        const sale = new sale_model_1.Sale(saleData);
        await sale.save();
        // Populate references for response
        const populatedSale = await sale_model_1.Sale.findById(sale._id)
            .populate("buyer.id", "name phone1 address")
            .populate("witness.id", "name phone1 address")
            .populate("car.id", "serialNo company carModel registration");
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.CREATED, "Sale created successfully", populatedSale);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.createSale = createSale;
