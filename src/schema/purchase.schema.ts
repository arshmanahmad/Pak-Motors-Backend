import { z } from "zod";

export const PurchaseSchema = z.object({
  serialNo: z.string().min(1, "Serial number is required"),
  company: z.string().min(1, "Company is required"),
  carModel: z.string().min(1, "Model is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
  chasisNumber: z.string().min(1, "Chasis number is required"),
  registration: z.string().min(1, "Registration number is required"),
  isNew: z.boolean().default(true),
  horsePower: z.string().min(1, "Horse power is required"),
  color: z.string().min(1, "Color is required"),
  
  // New car specific fields
  invoiceName: z.string().optional(),
  invoiceDate: z.string().optional(),
  receiveDate: z.string().optional(),
  
  // Checkboxes
  invoiceReceived: z.boolean().default(false),
  invoiceDelivered: z.boolean().default(false),
  warrantyBook: z.boolean().default(false),
  warrantyBookDelivered: z.boolean().default(false),
  sphereKey: z.boolean().default(false),
  document: z.boolean().default(false),
  
  // Purchase details
  purchaseAmount: z.number().min(0, "Purchase amount must be positive"),
  attachedDocuments: z.array(z.string()).optional(), // Array of file paths/URLs
  purchaseFrom: z.string().min(1, "Purchase from is required"),
  witness: z.string().min(1, "Witness is required"),
  note: z.string().optional(),
  
  // System fields
  userId: z.string().min(1, "User ID is required")
});

export const UpdatePurchaseSchema = PurchaseSchema.partial().omit({ userId: true });

export const PurchaseQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional(),
  company: z.string().optional(),
  carModel: z.string().optional(),
  isNew: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
});
