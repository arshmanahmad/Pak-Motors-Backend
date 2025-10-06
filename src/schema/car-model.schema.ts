import { z } from "zod";

export const CreateCarModelSchema = z.object({
    name: z.string().min(1, "Model name is required"),
    description: z.string().optional(),
    companyId: z.string().min(1, "Company ID is required"),
    userId: z.string().min(1, "User ID is required")
});

export const UpdateCarModelSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional()
});

export const CarModelQuerySchema = z.object({
    page: z.string().optional().transform(v => v ? parseInt(v) : 1),
    limit: z.string().optional().transform(v => v ? parseInt(v) : 10),
    search: z.string().optional(),
    companyId: z.string().optional()
});


