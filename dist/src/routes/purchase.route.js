"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseRouter = void 0;
const express_1 = require("express");
const purchase_controller_1 = require("../controllers/purchase.controller");
const authentication_1 = require("../middleware/authentication");
const validateRequest_1 = require("../utils/validateRequest");
const purchase_schema_1 = require("../schema/purchase.schema");
const common_schema_1 = require("../schema/common.schema");
exports.purchaseRouter = (0, express_1.Router)();
// All purchase routes require authentication
exports.purchaseRouter.use(authentication_1.authenticate);
// Purchase CRUD operations with validation
exports.purchaseRouter.post("/", (0, validateRequest_1.validateBody)(purchase_schema_1.PurchaseSchema), purchase_controller_1.createPurchase);
exports.purchaseRouter.get("/", (0, validateRequest_1.validateQuery)(purchase_schema_1.PurchaseQuerySchema), purchase_controller_1.getPurchases);
exports.purchaseRouter.get("/stats", purchase_controller_1.getPurchaseStats);
exports.purchaseRouter.get("/dropdown-options", purchase_controller_1.getDropdownOptions);
exports.purchaseRouter.get("/next-serial", purchase_controller_1.getNextSerialNumber);
exports.purchaseRouter.get("/:id", (0, validateRequest_1.validateParams)(common_schema_1.IdParamsSchema), purchase_controller_1.getPurchaseById);
exports.purchaseRouter.put("/:id", (0, validateRequest_1.validateRequest)({
    params: common_schema_1.IdParamsSchema,
    body: purchase_schema_1.UpdatePurchaseSchema
}), purchase_controller_1.updatePurchase);
exports.purchaseRouter.delete("/:id", (0, validateRequest_1.validateParams)(common_schema_1.IdParamsSchema), purchase_controller_1.deletePurchase);
