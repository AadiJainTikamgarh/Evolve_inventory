import mongoose from "mongoose";
import { categories } from "../constants/constants";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(categories),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Categories = mongoose.model("categories", categorySchema);
