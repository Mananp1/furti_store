import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    images: { type: [String], default: [] },
    category: { type: String },
    material: { type: String },
    dimensions: { type: String },
    status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  {
    timestamps: true, 
  }
);

export const Product = mongoose.model("Product", productSchema);
