import { model, Schema, Types } from "mongoose";

const PurchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
}, { timestamps: true });

export const Purchase = model("Purchase", PurchaseSchema);