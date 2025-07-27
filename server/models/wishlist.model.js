import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema = new mongoose.Schema(
  {
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [wishlistItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field when items change
wishlistSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
