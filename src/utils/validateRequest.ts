import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "./response";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

// Validation options interface
interface ValidationOptions {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

// Main validation middleware factory
export const validateRequest = (schemas: ValidationOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      // Validate query parameters
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query) as any;
      }

      // Validate route parameters
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params) as any;
      }

      next();
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return ApiResponse.error(res, StatusCodes.BAD_REQUEST, "Validation failed", {
          errors: errorMessages,
          message: "Please check your input and try again"
        });
      }

      // Handle other errors
      return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, "Validation error", error.message);
    }
  };
};

// Convenience functions for common validation patterns
export const validateBody = (schema: z.ZodSchema) => {
  return validateRequest({ body: schema });
};

export const validateQuery = (schema: z.ZodSchema) => {
  return validateRequest({ query: schema });
};

export const validateParams = (schema: z.ZodSchema) => {
  return validateRequest({ params: schema });
};

// Legacy function for backward compatibility (deprecated)
export const validateRequestLegacy = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return ApiResponse.error(res, StatusCodes.BAD_REQUEST, "Validation failed", {
          errors: errorMessages,
          message: "Please check your input and try again"
        });
      }

      return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, "Validation error", error.message);
    }
  };
};