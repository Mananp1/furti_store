import { Cart } from "../models/cart.model.js";


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


export const getUserCart = async (req, res) => {
  try {
    const { authUserId } = req.user;

    let cart = await Cart.findOne({ authUserId });

    if (!cart) {
      
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


export const clearCartAfterPayment = async (req, res) => {
  try {
    const userId = req.user.authUserId;

    
    const result = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true, upsert: true }
    );



    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        items: result.items,
        totalItems: result.items.length,
      },
    });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
