import { model, Schema } from "mongoose";

const PersonSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    fatherName: {
      type: String,
      required: false,
    },
    cast: {
      type: String,
      required: false,
    },
    cnic: {
      type: String,
      required: false,
    },
    phone1: {
      type: String,
      required: false,
    },
    phone2: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    picture: {
      type: String, // File path or URL
      required: false,
    },
    signature: {
      type: String, // File path or URL
      required: false,
    },
    fingerprint: {
      type: String, // Fingerprint data or file path
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Person = model("Person", PersonSchema);
