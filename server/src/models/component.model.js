import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String, // URL from CDN(cloudinary)
            required: true
        },
        description: {
            type: String,
            required: true
        },
        quantity_in_stock: {
            type: Number,
            required: true
        },
        remark: {
            type: String
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    },
    { timestamps: true }
);

export const Component = mongoose.model("Component", componentSchema);