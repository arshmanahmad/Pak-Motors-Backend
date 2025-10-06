import { model, Schema } from "mongoose";

const CompanySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

CompanySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Company = model("Company", CompanySchema);


