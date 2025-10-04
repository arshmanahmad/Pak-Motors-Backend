import { Document, Types } from "mongoose";

export interface IPurchase extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  serialNo: string;
  company: string;
  carModel: string;
  engineNumber: string;
  chasisNumber: string;
  registration: string;
  isNew: boolean;
  horsePower: string;
  color: string;
  
  // New car specific fields
  invoiceName?: string;
  invoiceDate?: Date;
  receiveDate?: Date;
  
  // Checkboxes
  invoiceReceived: boolean;
  invoiceDelivered: boolean;
  warrantyBook: boolean;
  warrantyBookDelivered: boolean;
  sphereKey: boolean;
  document: boolean;
  
  // Purchase details
  purchaseAmount: number;
  attachedDocuments?: string[];
  purchaseFrom: string;
  witness: string;
  note?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePurchaseRequest {
  serialNo: string;
  company: string;
  model: string;
  engineNumber: string;
  chasisNumber: string;
  registration: string;
  isNew: boolean;
  horsePower: string;
  color: string;
  invoiceName?: string;
  invoiceDate?: string;
  receiveDate?: string;
  invoiceReceived?: boolean;
  invoiceDelivered?: boolean;
  warrantyBook?: boolean;
  warrantyBookDelivered?: boolean;
  sphereKey?: boolean;
  document?: boolean;
  purchaseAmount: number;
  attachedDocuments?: string[];
  purchaseFrom: string;
  witness: string;
  note?: string;
}

export interface UpdatePurchaseRequest {
  serialNo?: string;
  company?: string;
  model?: string;
  engineNumber?: string;
  chasisNumber?: string;
  registration?: string;
  isNew?: boolean;
  horsePower?: string;
  color?: string;
  invoiceName?: string;
  invoiceDate?: string;
  receiveDate?: string;
  invoiceReceived?: boolean;
  invoiceDelivered?: boolean;
  warrantyBook?: boolean;
  warrantyBookDelivered?: boolean;
  sphereKey?: boolean;
  document?: boolean;
  purchaseAmount?: number;
  attachedDocuments?: string[];
  purchaseFrom?: string;
  witness?: string;
  note?: string;
}

export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  model?: string;
  isNew?: boolean;
}

export interface PurchaseStats {
  totalPurchases: number;
  newCars: number;
  usedCars: number;
  totalAmount: number;
  averageAmount: number;
}

// Dropdown options for frontend
export const HORSE_POWER_OPTIONS = [
  "800cc", "1000cc", "1200cc", "1300cc", "1500cc", "1600cc", 
  "1800cc", "2000cc", "2200cc", "2500cc", "3000cc", "3500cc", "4000cc+"
];

export const COLOR_OPTIONS = [
  "White", "Black", "Silver", "Gray", "Red", "Blue", "Green", 
  "Yellow", "Orange", "Brown", "Gold", "Purple", "Pink", "Other"
];

export const CAR_COMPANIES = [
  "Toyota", "Honda", "Suzuki", "Nissan", "Mitsubishi", "Mazda", 
  "Hyundai", "Kia", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", 
  "Audi", "Volkswagen", "Skoda", "Other"
];
