"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseSchema = exports.SuccessResponseSchema = exports.FileUploadSchema = exports.DateRangeSchema = exports.PaginationSearchSchema = exports.IdParamsSchema = exports.SearchSchema = exports.PaginationSchema = exports.ObjectIdSchema = void 0;
const zod_1 = require("zod");
// Common validation schemas for reuse across the application
// MongoDB ObjectId validation
exports.ObjectIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");
// Pagination schema
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val) : 10)
});
// Search schema
exports.SearchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc')
});
// Common params schema for ID-based routes
exports.IdParamsSchema = zod_1.z.object({
    id: exports.ObjectIdSchema
});
// Combined pagination and search schema
exports.PaginationSearchSchema = exports.PaginationSchema.merge(exports.SearchSchema);
// Date range schema
exports.DateRangeSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined),
    endDate: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined)
});
// File upload schema
exports.FileUploadSchema = zod_1.z.object({
    filename: zod_1.z.string(),
    originalName: zod_1.z.string(),
    mimetype: zod_1.z.string(),
    size: zod_1.z.number().positive(),
    path: zod_1.z.string()
});
// Common response schemas
exports.SuccessResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: zod_1.z.any().optional()
});
exports.ErrorResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    errors: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        message: zod_1.z.string(),
        code: zod_1.z.string()
    })).optional()
});
