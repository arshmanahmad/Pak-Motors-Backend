import { model, Schema, Types } from "mongoose";

const PurchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
   
});



export const Purchase = model("Purchase", PurchaseSchema);