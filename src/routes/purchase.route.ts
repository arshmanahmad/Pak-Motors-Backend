import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  getPurchaseStats,
  getDropdownOptions,
  getNextSerialNumber,
} from "../controllers/purchase.controller";
import { authenticate } from "../middleware/authentication";
import {
  validateRequest,
  validateBody,
  validateQuery,
  validateParams,
} from "../utils/validateRequest";
import {
  PurchaseSchema,
  UpdatePurchaseSchema,
  PurchaseQuerySchema,
} from "../schema/purchase.schema";
import { IdParamsSchema } from "../schema/common.schema";

export const purchaseRouter = Router();

// Purchase CRUD operations with validation BEFORE authentication
purchaseRouter.post(
  "/",
  validateBody(PurchaseSchema),
  authenticate,
  createPurchase
);

purchaseRouter.get(
  "/",
  validateQuery(PurchaseQuerySchema),
  authenticate,
  getPurchases
);

purchaseRouter.get("/stats", authenticate, getPurchaseStats);

purchaseRouter.get("/dropdown-options", authenticate, getDropdownOptions);

purchaseRouter.get("/next-serial", authenticate, getNextSerialNumber);

purchaseRouter.get(
  "/:id",
  validateParams(IdParamsSchema),
  authenticate,
  getPurchaseById
);

purchaseRouter.put(
  "/:id",
  validateRequest({
    params: IdParamsSchema,
    body: UpdatePurchaseSchema,
  }),
  authenticate,
  updatePurchase
);

purchaseRouter.delete(
  "/:id",
  validateParams(IdParamsSchema),
  authenticate,
  deletePurchase
);
