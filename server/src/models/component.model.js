import mongoose from "mongoose";
import { componentStatus, componentCategory } from "../constants/constants.js";

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

componentSchema.pre("save", function () {
  this.total_quantity = 0;
  console.log(this.props);
  for (let i = 0; i < this.props.length; i++) {
    console.log(this.props[i].quantity_in_stock);
    this.total_quantity += this.props[i].quantity_in_stock;
  }
});

componentSchema.post("deleteOne", function () {
  console.log(this._id);
  this.model("logs").deleteMany({ component: this._id });
  this.model("requests").deleteMany({ component: this._id });
});

export const Components = mongoose.model("components", componentSchema);
