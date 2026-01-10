import mongoose from "mongoose";
import { componentStatus, componentCategory } from "../constants/constants";

const propsSchema = new mongoose.Schema({
  quantity_in_stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      componentStatus.WORKING,
      componentStatus.NOT_WORKING,
      componentStatus.IN_USE,
    ],
    default: componentStatus.WORKING,
  },
});

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String, // URL from CDN(cloudinary)
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    props: {
      type: [propsSchema],
      required: true,
      default: [],
    },
    remark: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(componentCategory),
    },
    total_quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

componentSchema.pre("save", function (next) {
  if (this.isModified("props")) {
    this.total_quantity = this.props.reduce(
      (acc, prop) => acc + prop.quantity_in_stock,
      0
    );
  }
  next();
});

componentSchema.pre("deleteOne", function (next) {
  this.model("logs").deleteMany({ component: this._id }, next);
  this.model("requests").deleteMany({ component: this._id }, next);
  next();
});

export const Components = mongoose.model("components", componentSchema);
