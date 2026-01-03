"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestLegacy = exports.validateParams = exports.validateQuery = exports.validateBody = exports.validateRequest = void 0;
const response_1 = require("./response");
const http_status_codes_1 = require("http-status-codes");
// Main validation middleware factory
const validateRequest = (schemas) => {
    return async (req, res, next) => {
        try {
            // Validate request body
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            // Validate query parameters
            if (schemas.query) {
                const validatedQuery = await schemas.query.parseAsync(req.query);
                // Store validated query in a custom property since req.query is read-only
                // Controllers should use req.validatedQuery when available, otherwise fall back to req.query
                req.validatedQuery = validatedQuery;
            }
            // Validate route parameters
            if (schemas.params) {
                req.params = (await schemas.params.parseAsync(req.params));
            }
            next();
        }
        catch (error) {
            // Handle Zod validation errors
            if (error.name === "ZodError") {
                const errorMessages = (error.issues ?? error.errors ?? []).map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                    code: err.code,
                }));
                return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "Validation failed", {
                    errors: errorMessages,
                    message: "Please check your input and try again",
                });
            }
            // Handle other errors
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Validation error", error.message);
        }
    };
};
exports.validateRequest = validateRequest;
// Convenience functions for common validation patterns
const validateBody = (schema) => {
    return (0, exports.validateRequest)({ body: schema });
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (0, exports.validateRequest)({ query: schema });
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (0, exports.validateRequest)({ params: schema });
};
exports.validateParams = validateParams;
// Legacy function for backward compatibility (deprecated)
const validateRequestLegacy = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error.name === "ZodError") {
                const errorMessages = (error.issues ?? error.errors ?? []).map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                    code: err.code,
                }));
                return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.BAD_REQUEST, "Validation failed", {
                    errors: errorMessages,
                    message: "Please check your input and try again",
                });
            }
            return response_1.ApiResponse.error(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Validation error", error.message);
        }
    };
};
exports.validateRequestLegacy = validateRequestLegacy;
