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


export const Company = model("Company", CompanySchema);


