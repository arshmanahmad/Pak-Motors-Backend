import { z } from "zod";

// Common validation schemas for reuse across the application

// MongoDB ObjectId validation
export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

// Pagination schema
export const PaginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
});

// Search schema
export const SearchSchema = z.object({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Common params schema for ID-based routes
export const IdParamsSchema = z.object({
  id: ObjectIdSchema
});

// Combined pagination and search schema
export const PaginationSearchSchema = PaginationSchema.merge(SearchSchema);

// Date range schema
export const DateRangeSchema = z.object({
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

// File upload schema
export const FileUploadSchema = z.object({
  filename: z.string(),
  originalName: z.string(),
  mimetype: z.string(),
  size: z.number().positive(),
  path: z.string()
});

// Common response schemas
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional()
});

export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
    code: z.string()
  })).optional()
});
