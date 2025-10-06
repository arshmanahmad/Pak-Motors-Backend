import { Router } from "express";
import { authenticate } from "../middleware/authentication";
import { validateBody, validateParams, validateQuery, validateRequest } from "../utils/validateRequest";
import { CreateCompanySchema, UpdateCompanySchema, CompanyQuerySchema } from "../schema/company.schema";
import { IdParamsSchema } from "../schema/common.schema";
import { createCompany, listCompanies, getCompany, updateCompany, deleteCompany } from "../controllers/company.controller";

export const companyRouter = Router();

// Validation BEFORE authentication
companyRouter.post("/", validateBody(CreateCompanySchema), authenticate, createCompany);
companyRouter.get("/", validateQuery(CompanyQuerySchema), authenticate, listCompanies);
companyRouter.get("/:id", validateParams(IdParamsSchema), authenticate, getCompany);
companyRouter.put("/:id", validateRequest({ params: IdParamsSchema, body: UpdateCompanySchema }), authenticate, updateCompany);
companyRouter.delete("/:id", validateParams(IdParamsSchema), authenticate, deleteCompany);


