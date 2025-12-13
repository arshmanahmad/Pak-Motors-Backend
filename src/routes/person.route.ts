import { Router } from "express";
import {
  createPerson,
  getAllPersons,
  getPersonById,
} from "../controllers/person.controller";
import { authenticate } from "../middleware/authentication";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../utils/validateRequest";
import { PersonSchema, PersonQuerySchema } from "../schema/person.schema";
import { IdParamsSchema } from "../schema/common.schema";

export const personRouter = Router();

// Person CRUD operations with validation BEFORE authentication
personRouter.post("/", validateBody(PersonSchema), authenticate, createPerson);

personRouter.get(
  "/",
  validateQuery(PersonQuerySchema),
  authenticate,
  getAllPersons
);

personRouter.get(
  "/:id",
  validateParams(IdParamsSchema),
  authenticate,
  getPersonById
);
