import { z } from "zod";

export const CreateSaleSchema = z.object({
  date: z.string().min(1, "Date is required"),
  buyer: z.object({
    id: z.string().min(1, "Buyer ID is required"),
    name: z.string().min(1, "Buyer name is required"),
  }),
  witness: z.object({
    id: z.string().min(1, "Witness ID is required"),
    name: z.string().min(1, "Witness name is required"),
  }),
  car: z.object({
    id: z.string().min(1, "Car ID is required"),
    serialNo: z.string().min(1, "Serial number is required"),
    company: z.string().min(1, "Company is required"),
    model: z.string().min(1, "Model is required"),
    registration: z.string().min(1, "Registration is required"),
  }),
  extraKeys: z.boolean().default(false),
  documents: z.boolean().default(false),
  numberPlates: z.boolean().default(false),
  amount: z.number().min(0, "Amount must be positive"),
  note: z.string().optional(),
  attachedDocuments: z.array(z.string()).optional(),
  // userId is extracted from JWT token in authenticate middleware
});

export const SaleQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
