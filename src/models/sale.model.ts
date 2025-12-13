import { model, Schema } from "mongoose";

const SaleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    buyer: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    witness: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    car: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Purchase",
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
      model: {
        type: String,
        required: true,
      },
      registration: {
        type: String,
        required: true,
      },
    },
    extraKeys: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Boolean,
      default: false,
    },
    numberPlates: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      required: false,
    },
    attachedDocuments: [
      {
        type: String, // Array of file paths/URLs
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Sale = model("Sale", SaleSchema);
