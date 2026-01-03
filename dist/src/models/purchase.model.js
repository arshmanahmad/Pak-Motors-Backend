"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
const mongoose_1 = require("mongoose");
const PurchaseSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    serialNo: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    carModel: {
        type: String,
        required: true,
    },
    engineNumber: {
        type: String,
        required: true,
    },
    chasisNumber: {
        type: String,
        required: true,
    },
    registration: {
        type: String,
        required: true,
    },
    isNew: {
        type: Boolean,
        default: true,
    },
    horsePower: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    // New car specific fields
    invoiceName: {
        type: String,
        required: false,
    },
    invoiceDate: {
        type: Date,
        required: false,
    },
    receiveDate: {
        type: Date,
        required: false,
    },
    // Checkboxes
    invoiceReceived: {
        type: Boolean,
        default: false,
    },
    invoiceDelivered: {
        type: Boolean,
        default: false,
    },
    warrantyBook: {
        type: Boolean,
        default: false,
    },
    warrantyBookDelivered: {
        type: Boolean,
        default: false,
    },
    sphereKey: {
        type: Boolean,
        default: false,
    },
    document: {
        type: Boolean,
        default: false,
    },
    // Purchase details
    purchaseAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    attachedDocuments: [
        {
            type: String, // Array of file paths/URLs
        },
    ],
    purchaseFrom: {
        type: String,
        required: true,
    },
    witness: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Purchase = (0, mongoose_1.model)("Purchase", PurchaseSchema);
