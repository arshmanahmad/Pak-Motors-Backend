import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", UserSchema);

// Function to drop the old username index (call this after MongoDB connection)
export const dropUsernameIndex = async () => {
  try {
    await User.collection.dropIndex("username_1");
    console.log("Dropped old username_1 index from users collection");
  } catch (error: any) {
    // Index might not exist, ignore error
    if (error.code !== 27) {
      // 27 = IndexNotFound
      console.warn("Could not drop username_1 index:", error.message);
    }
  }
};
