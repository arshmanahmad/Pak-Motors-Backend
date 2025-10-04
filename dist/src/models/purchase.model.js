"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
const mongoose_1 = require("mongoose");
const PurchaseSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    serialNo: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    engineNumber: {
        type: String,
        required: true,
        unique: true
    },
    chasisNumber: {
        type: String,
        required: true,
        unique: true
    },
    registration: {
        type: String,
        required: true,
        unique: true
    },
    isNew: {
        type: Boolean,
        default: true
    },
    horsePower: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    // New car specific fields
    invoiceName: {
        type: String,
        required: false
    },
    invoiceDate: {
        type: Date,
        required: false
    },
    receiveDate: {
        type: Date,
        required: false
    },
    // Checkboxes
    invoiceReceived: {
        type: Boolean,
        default: false
    },
    invoiceDelivered: {
        type: Boolean,
        default: false
    },
    warrantyBook: {
        type: Boolean,
        default: false
    },
    warrantyBookDelivered: {
        type: Boolean,
        default: false
    },
    sphereKey: {
        type: Boolean,
        default: false
    },
    document: {
        type: Boolean,
        default: false
    },
    // Purchase details
    purchaseAmount: {
        type: Number,
        required: true,
        min: 0
    },
    attachedDocuments: [{
            type: String // Array of file paths/URLs
        }],
    purchaseFrom: {
        type: String,
        required: true
    },
    witness: {
        type: String,
        required: true
    },
    note: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better query performance
PurchaseSchema.index({ userId: 1 });
PurchaseSchema.index({ company: 1 });
PurchaseSchema.index({ carModel: 1 });
PurchaseSchema.index({ isNew: 1 });
PurchaseSchema.index({ serialNo: 1 });
PurchaseSchema.index({ engineNumber: 1 });
PurchaseSchema.index({ chasisNumber: 1 });
PurchaseSchema.index({ registration: 1 });
exports.Purchase = (0, mongoose_1.model)("Purchase", PurchaseSchema);
