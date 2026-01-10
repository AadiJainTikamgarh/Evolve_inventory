import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        
    },
    { timestamps: true, _id: false }
);

export const Wishlists = mongoose.model("wishlists", wishlistSchema);