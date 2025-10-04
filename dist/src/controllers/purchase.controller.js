"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSerialNumber = exports.getDropdownOptions = exports.getPurchaseStats = exports.deletePurchase = exports.updatePurchase = exports.getPurchaseById = exports.getPurchases = exports.createPurchase = void 0;
const purchase_model_1 = require("../models/purchase.model");
const response_1 = require("../utils/response");
const http_status_codes_1 = require("http-status-codes");
const purchase_types_1 = require("../types/purchase.types");
// Create a new purchase
const createPurchase = async (req, res) => {
    try {
        const validatedData = req.body; // Data is already validated by middleware
        // Check if serial number already exists
        const existingSerial = await purchase_model_1.Purchase.findOne({ serialNo: validatedData.serialNo });
        if (existingSerial) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Serial number already exists", null);
        }
        // Check if engine number already exists
        const existingEngine = await purchase_model_1.Purchase.findOne({ engineNumber: validatedData.engineNumber });
        if (existingEngine) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Engine number already exists", null);
        }
        // Check if chasis number already exists
        const existingChasis = await purchase_model_1.Purchase.findOne({ chasisNumber: validatedData.chasisNumber });
        if (existingChasis) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Chasis number already exists", null);
        }
        // Check if registration number already exists
        const existingRegistration = await purchase_model_1.Purchase.findOne({ registration: validatedData.registration });
        if (existingRegistration) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Registration number already exists", null);
        }
        const purchase = new purchase_model_1.Purchase(validatedData);
        await purchase.save();
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.CREATED, "Purchase created successfully", purchase);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.createPurchase = createPurchase;
// Get all purchases with pagination and filtering
const getPurchases = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, company, carModel, isNew } = req.query; // Data is already validated by middleware
        const skip = (Number(page) - 1) * Number(limit);
        const filter = {};
        // Apply filters
        if (search) {
            filter.$or = [
                { serialNo: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { carModel: { $regex: search, $options: 'i' } },
                { engineNumber: { $regex: search, $options: 'i' } },
                { chasisNumber: { $regex: search, $options: 'i' } },
                { registration: { $regex: search, $options: 'i' } }
            ];
        }
        if (company)
            filter.company = company;
        if (carModel)
            filter.carModel = carModel;
        if (isNew !== undefined)
            filter.isNew = isNew;
        const purchases = await purchase_model_1.Purchase.find(filter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await purchase_model_1.Purchase.countDocuments(filter);
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Purchases retrieved successfully", {
            purchases,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.getPurchases = getPurchases;
// Get purchase by ID
const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params; // ID is already validated by middleware
        const purchase = await purchase_model_1.Purchase.findById(id).populate('userId', 'name email');
        if (!purchase) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.NOT_FOUND, "Purchase not found", null);
        }
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Purchase retrieved successfully", purchase);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.getPurchaseById = getPurchaseById;
// Update purchase
const updatePurchase = async (req, res) => {
    try {
        const { id } = req.params; // ID is already validated by middleware
        const validatedData = req.body; // Data is already validated by middleware
        // Check for duplicate values if they're being updated
        if (validatedData.serialNo) {
            const existingSerial = await purchase_model_1.Purchase.findOne({
                serialNo: validatedData.serialNo,
                _id: { $ne: id }
            });
            if (existingSerial) {
                return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Serial number already exists", null);
            }
        }
        if (validatedData.engineNumber) {
            const existingEngine = await purchase_model_1.Purchase.findOne({
                engineNumber: validatedData.engineNumber,
                _id: { $ne: id }
            });
            if (existingEngine) {
                return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Engine number already exists", null);
            }
        }
        if (validatedData.chasisNumber) {
            const existingChasis = await purchase_model_1.Purchase.findOne({
                chasisNumber: validatedData.chasisNumber,
                _id: { $ne: id }
            });
            if (existingChasis) {
                return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Chasis number already exists", null);
            }
        }
        if (validatedData.registration) {
            const existingRegistration = await purchase_model_1.Purchase.findOne({
                registration: validatedData.registration,
                _id: { $ne: id }
            });
            if (existingRegistration) {
                return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.CONFLICT, "Registration number already exists", null);
            }
        }
        const purchase = await purchase_model_1.Purchase.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true }).populate('userId', 'name email');
        if (!purchase) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.NOT_FOUND, "Purchase not found", null);
        }
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Purchase updated successfully", purchase);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.updatePurchase = updatePurchase;
// Delete purchase
const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params; // ID is already validated by middleware
        const purchase = await purchase_model_1.Purchase.findByIdAndDelete(id);
        if (!purchase) {
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.NOT_FOUND, "Purchase not found", null);
        }
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Purchase deleted successfully", null);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.deletePurchase = deletePurchase;
// Get purchase statistics
const getPurchaseStats = async (req, res) => {
    try {
        const stats = await purchase_model_1.Purchase.aggregate([
            {
                $group: {
                    _id: null,
                    totalPurchases: { $sum: 1 },
                    newCars: { $sum: { $cond: ['$isNew', 1, 0] } },
                    usedCars: { $sum: { $cond: ['$isNew', 0, 1] } },
                    totalAmount: { $sum: '$purchaseAmount' },
                    averageAmount: { $avg: '$purchaseAmount' }
                }
            }
        ]);
        const result = stats[0] || {
            totalPurchases: 0,
            newCars: 0,
            usedCars: 0,
            totalAmount: 0,
            averageAmount: 0
        };
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Purchase statistics retrieved successfully", result);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.getPurchaseStats = getPurchaseStats;
// Get dropdown options
const getDropdownOptions = async (req, res) => {
    try {
        const options = {
            horsePower: purchase_types_1.HORSE_POWER_OPTIONS,
            colors: purchase_types_1.COLOR_OPTIONS,
            companies: purchase_types_1.CAR_COMPANIES
        };
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Dropdown options retrieved successfully", options);
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.getDropdownOptions = getDropdownOptions;
// Get next serial number
const getNextSerialNumber = async (req, res) => {
    try {
        const lastPurchase = await purchase_model_1.Purchase.findOne()
            .sort({ serialNo: -1 })
            .select('serialNo');
        let nextSerial = 1;
        if (lastPurchase && lastPurchase.serialNo) {
            const lastSerial = parseInt(lastPurchase.serialNo);
            if (!isNaN(lastSerial)) {
                nextSerial = lastSerial + 1;
            }
        }
        response_1.ApiResponse.success(res, http_status_codes_1.StatusCodes.OK, "Next serial number retrieved successfully", {
            nextSerialNumber: nextSerial.toString()
        });
    }
    catch (error) {
        response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message, null);
    }
};
exports.getNextSerialNumber = getNextSerialNumber;
