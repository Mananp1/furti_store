import { Wishlist } from "../models/wishlist.model.js";

const transformWishlistForFrontend = (wishlist) => {
  const transformedItems = wishlist.items.map((item) => ({
    _id: item.productId,
    title: item.title,
    price: item.price,
    images: item.images,
    category: item.category,
    material: item.material,
  }));

  return {
    ...wishlist.toObject(),
    items: transformedItems,
  };
};

export const getUserWishlist = async (req, res) => {
  try {
    const { authUserId } = req.user;

    let wishlist = await Wishlist.findOne({ authUserId });

    if (!wishlist) {
      wishlist = new Wishlist({ authUserId, items: [] });
      await wishlist.save();
    }

    res.json({
      success: true,
      data: transformWishlistForFrontend(wishlist),
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      error: "Failed to get wishlist",
      message: error.message,
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({
        error: "Product data is required",
      });
    }

    let wishlist = await Wishlist.findOne({ authUserId });

    if (!wishlist) {
      wishlist = new Wishlist({ authUserId, items: [] });
    }

    const existingItem = wishlist.items.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      return res.status(400).json({
        error: "Product already in wishlist",
      });
    }

    wishlist.items.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      images: product.images,
      category: product.category,
      material: product.material,
    });

    await wishlist.save();

    res.json({
      success: true,
      data: transformWishlistForFrontend(wishlist),
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      error: "Failed to add to wishlist",
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ authUserId });

    if (!wishlist) {
      return res.status(404).json({
        error: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId
    );
    await wishlist.save();

    res.json({
      success: true,
      data: transformWishlistForFrontend(wishlist),
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      error: "Failed to remove from wishlist",
      message: error.message,
    });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const { authUserId } = req.user;

    const wishlist = await Wishlist.findOne({ authUserId });

    if (!wishlist) {
      return res.status(404).json({
        error: "Wishlist not found",
      });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({
      success: true,
      data: transformWishlistForFrontend(wishlist),
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({
      error: "Failed to clear wishlist",
      message: error.message,
    });
  }
};
