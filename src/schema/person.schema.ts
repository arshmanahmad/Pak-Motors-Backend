import { z } from "zod";

export const PersonSchema = z.object({
  name: z.string().optional(),
  fatherName: z.string().optional(),
  cast: z.string().optional(),
  cnic: z.string().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  address: z.string().optional(),
  picture: z.string().optional(), // File path or URL
  signature: z.string().optional(), // File path or URL
  fingerprint: z.string().optional(), // Fingerprint data or file path
  userId: z.string().min(1, "User ID is required"),
});

export const UpdatePersonSchema = PersonSchema.partial().omit({ userId: true });

export const PersonQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
});
