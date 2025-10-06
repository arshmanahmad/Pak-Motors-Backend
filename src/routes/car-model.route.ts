import { Router } from "express";
import { authenticate } from "../middleware/authentication";
import { validateBody, validateParams, validateQuery, validateRequest } from "../utils/validateRequest";
import { CreateCarModelSchema, UpdateCarModelSchema, CarModelQuerySchema } from "../schema/car-model.schema";
import { IdParamsSchema } from "../schema/common.schema";
import { createCarModel, listCarModels, getCarModel, updateCarModel, deleteCarModel } from "../controllers/car-model.controller";

export const carModelRouter = Router();

// Validation BEFORE authentication
carModelRouter.post("/", validateBody(CreateCarModelSchema), authenticate, createCarModel);
carModelRouter.get("/", validateQuery(CarModelQuerySchema), authenticate, listCarModels);
carModelRouter.get("/:id", validateParams(IdParamsSchema), authenticate, getCarModel);
carModelRouter.put("/:id", validateRequest({ params: IdParamsSchema, body: UpdateCarModelSchema }), authenticate, updateCarModel);
carModelRouter.delete("/:id", validateParams(IdParamsSchema), authenticate, deleteCarModel);


