import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  getPurchaseStats,
  getDropdownOptions,
  getNextSerialNumber
} from "../controllers/purchase.controller";
import { authenticate } from "../middleware/authentication";
import { validateRequest, validateBody, validateQuery, validateParams } from "../utils/validateRequest";
import { PurchaseSchema, UpdatePurchaseSchema, PurchaseQuerySchema } from "../schema/purchase.schema";
import { IdParamsSchema } from "../schema/common.schema";

export const purchaseRouter = Router();

// All purchase routes require authentication
purchaseRouter.use(authenticate);

// Purchase CRUD operations with validation
purchaseRouter.post("/", 
  validateBody(PurchaseSchema),
  createPurchase
);

purchaseRouter.get("/", 
  validateQuery(PurchaseQuerySchema),
  getPurchases
);

purchaseRouter.get("/stats", getPurchaseStats);

purchaseRouter.get("/dropdown-options", getDropdownOptions);

purchaseRouter.get("/next-serial", getNextSerialNumber);

purchaseRouter.get("/:id", 
  validateParams(IdParamsSchema),
  getPurchaseById
);

purchaseRouter.put("/:id", 
  validateRequest({
    params: IdParamsSchema,
    body: UpdatePurchaseSchema
  }),
  updatePurchase
);

purchaseRouter.delete("/:id", 
  validateParams(IdParamsSchema),
  deletePurchase
);
