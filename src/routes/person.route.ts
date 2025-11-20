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

// All person routes require authentication
personRouter.use(authenticate);

// Person CRUD operations with validation
personRouter.post("/", validateBody(PersonSchema), createPerson);

personRouter.get("/", validateQuery(PersonQuerySchema), getAllPersons);

personRouter.get("/:id", validateParams(IdParamsSchema), getPersonById);
