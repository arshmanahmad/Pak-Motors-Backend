import { Router } from "express";
import { authenticate } from "../middleware/authentication";
import { validateBody } from "../utils/validateRequest";
import { CreateSaleSchema } from "../schema/sale.schema";
import { createSale } from "../controllers/sale.controller";

export const saleRouter = Router();

// Sale operations with validation BEFORE authentication
saleRouter.post("/", validateBody(CreateSaleSchema), authenticate, createSale);
