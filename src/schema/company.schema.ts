import { z } from "zod";

export const CreateCompanySchema = z.object({
    name: z.string().min(1, "Company name is required"),
    description: z.string().optional(),
    userId: z.string().min(1, "User ID is required")
});

export const UpdateCompanySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional()
});

export const CompanyQuerySchema = z.object({
    page: z.string().optional().transform(v => v ? parseInt(v) : 1),
    limit: z.string().optional().transform(v => v ? parseInt(v) : 10),
    search: z.string().optional()
});


