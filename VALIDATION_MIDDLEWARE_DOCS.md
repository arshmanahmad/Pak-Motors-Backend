# Validation Middleware Documentation

## Overview
The validation middleware provides a comprehensive, reusable solution for validating HTTP requests in Express.js applications. It supports validation of request body, query parameters, and route parameters using Zod schemas.

## Features
- ✅ **Multi-part validation**: Body, query, and params validation
- ✅ **Zod integration**: Full Zod schema support with detailed error messages
- ✅ **Type safety**: Automatic TypeScript type inference
- ✅ **Error handling**: Structured error responses with field-specific messages
- ✅ **Convenience functions**: Shortcuts for common validation patterns
- ✅ **Middleware pattern**: Clean integration with Express route definitions

## Installation & Setup

The validation middleware is already integrated into the project. No additional installation required.

## Usage

### 1. Basic Validation Middleware

```typescript
import { validateRequest } from "../utils/validateRequest";
import { SomeSchema } from "../schema/some.schema";

// Validate multiple parts of the request
app.post("/api/endpoint", 
  validateRequest({
    body: SomeSchema,
    query: QuerySchema,
    params: ParamsSchema
  }),
  controllerFunction
);
```

### 2. Convenience Functions

```typescript
import { validateBody, validateQuery, validateParams } from "../utils/validateRequest";

// Validate only request body
app.post("/api/users", 
  validateBody(UserSchema),
  createUser
);

// Validate only query parameters
app.get("/api/users", 
  validateQuery(QuerySchema),
  getUsers
);

// Validate only route parameters
app.get("/api/users/:id", 
  validateParams(IdParamsSchema),
  getUserById
);
```

### 3. Route Definition Examples

```typescript
import { Router } from "express";
import { validateRequest, validateBody, validateQuery, validateParams } from "../utils/validateRequest";
import { UserSchema, QuerySchema, IdParamsSchema } from "../schema/user.schema";

const router = Router();

// POST with body validation
router.post("/", 
  validateBody(UserSchema),
  createUser
);

// GET with query validation
router.get("/", 
  validateQuery(QuerySchema),
  getUsers
);

// GET with params validation
router.get("/:id", 
  validateParams(IdParamsSchema),
  getUserById
);

// PUT with both body and params validation
router.put("/:id", 
  validateRequest({
    params: IdParamsSchema,
    body: UpdateUserSchema
  }),
  updateUser
);
```

## Schema Examples

### 1. Common Schemas (`src/schema/common.schema.ts`)

```typescript
import { z } from "zod";

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

// ID params schema
export const IdParamsSchema = z.object({
  id: ObjectIdSchema
});
```

### 2. Domain-Specific Schemas

```typescript
// User schema example
export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

// Purchase schema example
export const PurchaseSchema = z.object({
  serialNo: z.string().min(1, "Serial number is required"),
  company: z.string().min(1, "Company is required"),
  model: z.string().min(1, "Model is required"),
  // ... other fields
});
```

## Error Handling

### Validation Error Response Format

When validation fails, the middleware returns a structured error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "invalid_string"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "code": "too_small"
      }
    ],
    "message": "Please check your input and try again"
  }
}
```

### Error Types

1. **Validation Errors (400)**: Zod schema validation failures
2. **Internal Server Errors (500)**: Unexpected errors during validation

## Controller Integration

### Before (Manual Validation)
```typescript
export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = validateRequest(UserSchema, req.body);
    // ... controller logic
  } catch (error) {
    // ... error handling
  }
};
```

### After (Middleware Validation)
```typescript
export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body; // Data is already validated by middleware
    // ... controller logic
  } catch (error) {
    // ... error handling
  }
};
```

## Best Practices

### 1. Schema Organization
- Keep schemas in dedicated files by domain
- Use descriptive names and error messages
- Leverage Zod's built-in transformations

### 2. Route Definition
- Place validation middleware before authentication middleware
- Use appropriate convenience functions for single-part validation
- Group related validations using `validateRequest`

### 3. Error Handling
- Let the middleware handle validation errors
- Focus controller logic on business rules
- Use consistent error response format

### 4. Type Safety
- Leverage TypeScript inference from Zod schemas
- Use proper typing for request/response objects
- Validate external data at API boundaries

## Migration Guide

### From Manual Validation
1. Remove manual `validateRequest` calls from controllers
2. Add validation middleware to route definitions
3. Update controller code to use validated data directly
4. Remove validation imports from controllers

### Example Migration
```typescript
// Before
router.post("/", createUser);
// Controller: const data = validateRequest(UserSchema, req.body);

// After
router.post("/", validateBody(UserSchema), createUser);
// Controller: const data = req.body; // Already validated
```

## Advanced Usage

### Custom Validation Logic
```typescript
const CustomSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
}).refine((data) => {
  // Custom validation logic
  return data.password !== data.email;
}, {
  message: "Password cannot be the same as email",
  path: ["password"]
});
```

### Conditional Validation
```typescript
const ConditionalSchema = z.object({
  type: z.enum(['new', 'used']),
  invoiceName: z.string().optional()
}).refine((data) => {
  if (data.type === 'new') {
    return data.invoiceName !== undefined;
  }
  return true;
}, {
  message: "Invoice name is required for new items",
  path: ["invoiceName"]
});
```

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure schemas match expected data types
2. **Validation Failures**: Check schema definitions and error messages
3. **Middleware Order**: Place validation before authentication
4. **Schema Imports**: Verify correct schema imports in routes

### Debug Tips

1. Check middleware order in route definitions
2. Verify schema definitions match request structure
3. Test with invalid data to ensure proper error responses
4. Use TypeScript for compile-time validation

## Performance Considerations

- Validation runs before controller logic
- Zod parsing is optimized for performance
- Error responses are structured and consistent
- Middleware can be cached for better performance

This validation middleware provides a robust, type-safe, and maintainable solution for request validation in your Express.js application.
