"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseQuerySchema = exports.UpdatePurchaseSchema = exports.PurchaseSchema = void 0;
const zod_1 = require("zod");
exports.PurchaseSchema = zod_1.z.object({
    serialNo: zod_1.z.string().min(1, "Serial number is required"),
    company: zod_1.z.string().min(1, "Company is required"),
    carModel: zod_1.z.string().min(1, "Model is required"),
    engineNumber: zod_1.z.string().min(1, "Engine number is required"),
    chasisNumber: zod_1.z.string().min(1, "Chasis number is required"),
    registration: zod_1.z.string().min(1, "Registration number is required"),
    isNew: zod_1.z.boolean().default(true),
    horsePower: zod_1.z.string().min(1, "Horse power is required"),
    color: zod_1.z.string().min(1, "Color is required"),
    // New car specific fields
    invoiceName: zod_1.z.string().optional(),
    invoiceDate: zod_1.z.string().optional(),
    receiveDate: zod_1.z.string().optional(),
    // Checkboxes
    invoiceReceived: zod_1.z.boolean().default(false),
    invoiceDelivered: zod_1.z.boolean().default(false),
    warrantyBook: zod_1.z.boolean().default(false),
    warrantyBookDelivered: zod_1.z.boolean().default(false),
    sphereKey: zod_1.z.boolean().default(false),
    document: zod_1.z.boolean().default(false),
    // Purchase details
    purchaseAmount: zod_1.z.number().min(0, "Purchase amount must be positive"),
    attachedDocuments: zod_1.z.array(zod_1.z.string()).optional(), // Array of file paths/URLs
    purchaseFrom: zod_1.z.string().min(1, "Purchase from is required"),
    witness: zod_1.z.string().min(1, "Witness is required"),
    note: zod_1.z.string().optional(),
    // System fields
    userId: zod_1.z.string().min(1, "User ID is required")
});
exports.UpdatePurchaseSchema = exports.PurchaseSchema.partial().omit({ userId: true });
exports.PurchaseQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val) : 10),
    search: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
    carModel: zod_1.z.string().optional(),
    isNew: zod_1.z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
});
