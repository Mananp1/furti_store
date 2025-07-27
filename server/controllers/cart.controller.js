import { Cart } from "../models/cart.model.js";

// Helper function to transform cart items for frontend
const transformCartForFrontend = (cart) => {
  const transformedItems = cart.items.map((item) => ({
    _id: item.productId,
    title: item.title,
    price: item.price,
    images: item.images,
    category: item.category,
    material: item.material,
    quantity: item.quantity,
  }));

  return {
    ...cart.toObject(),
    items: transformedItems,
  };
};

// GET /api/cart - Get user's cart
export const getUserCart = async (req, res) => {
  try {
    const { authUserId } = req.user;

    let cart = await Cart.findOne({ authUserId });

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ authUserId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: transformCartForFrontend(cart),
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      error: "Failed to get cart",
      message: error.message,
    });
  }
};

// POST /api/cart/add - Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({
        error: "Product data is required",
      });
    }

    let cart = await Cart.findOne({ authUserId });

    if (!cart) {
      cart = new Cart({ authUserId, items: [] });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
        category: product.category,
        material: product.material,
        quantity: 1,
      });
    }

    await cart.save();

    res.json({
      success: true,
      data: transformCartForFrontend(cart),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      error: "Failed to add to cart",
      message: error.message,
    });
  }
};

// PUT /api/cart/update - Update item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        error: "Product ID and quantity are required",
      });
    }

    const cart = await Cart.findOne({ authUserId });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      return res.status(404).json({
        error: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    res.json({
      success: true,
      data: transformCartForFrontend(cart),
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      error: "Failed to update cart item",
      message: error.message,
    });
  }
};

// DELETE /api/cart/remove/:productId - Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { authUserId } = req.user;
    const { productId } = req.params;

    const cart = await Cart.findOne({ authUserId });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    res.json({
      success: true,
      data: transformCartForFrontend(cart),
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      error: "Failed to remove from cart",
      message: error.message,
    });
  }
};

// DELETE /api/cart/clear - Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const { authUserId } = req.user;

    const cart = await Cart.findOne({ authUserId });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      data: transformCartForFrontend(cart),
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      error: "Failed to clear cart",
      message: error.message,
    });
  }
};
