"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropUsernameIndex = exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
// Function to drop the old username index (call this after MongoDB connection)
const dropUsernameIndex = async () => {
    try {
        await exports.User.collection.dropIndex("username_1");
        console.log("Dropped old username_1 index from users collection");
    }
    catch (error) {
        // Index might not exist, ignore error
        if (error.code !== 27) {
            // 27 = IndexNotFound
            console.warn("Could not drop username_1 index:", error.message);
        }
    }
};
exports.dropUsernameIndex = dropUsernameIndex;
