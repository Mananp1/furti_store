import { stripe, formatAmountForStripe } from "../utils/stripeConfig.js";
import Payment from "../models/payment.model.js";
import { Cart } from "../models/cart.model.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const {
      amount,
      currency = "inr",
      items,
      shippingAddress,
      customerDetails,
      deliveryOption = "regular",
    } = req.body;
    const userId = req.user.authUserId;

    if (!amount || amount <= 0) {
      console.error("❌ Invalid amount:", amount);
      return res.status(400).json({
        success: false,
        message: "Invalid amount provided",
        error: "Amount must be greater than 0",
      });
    }

    if (!items || items.length === 0) {
      console.error("❌ No items provided");
      return res.status(400).json({
        success: false,
        message: "No items provided",
        error: "At least one item is required",
      });
    }

    const getShippingCost = (option, total) => {
      if (option === "regular") {
        if (total >= 3000) return 0;
        if (total >= 2000) return 99;
        return 199;
      } else {
        if (total >= 3000) return 199;
        if (total >= 2000) return 299;
        return 399;
      }
    };

    const shippingCost = getShippingCost(deliveryOption, amount);
    const calculatedAmount = amount + shippingCost;

    const stripeAmount = formatAmountForStripe(calculatedAmount, currency);

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ Stripe secret key not configured");
      return res.status(500).json({
        success: false,
        message: "Payment service not configured",
        error: "Stripe configuration missing",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: currency,
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: formatAmountForStripe(item.price, currency),
          },
          quantity: item.quantity,
        })),

        ...(shippingCost > 0
          ? [
              {
                price_data: {
                  currency: currency,
                  product_data: {
                    name: `${
                      deliveryOption === "express" ? "Express" : "Regular"
                    } Delivery`,
                  },
                  unit_amount: formatAmountForStripe(shippingCost, currency),
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      mode: "payment",
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/checkout?canceled=true`,
      metadata: {
        userId: userId,
        orderType: "stripe",
        deliveryOption: deliveryOption,
        defaultStreet: shippingAddress?.street || "",
        defaultCity: shippingAddress?.city || "",
        defaultState: shippingAddress?.state || "",
        defaultZipCode: shippingAddress?.zipCode || "",
        defaultCountry: shippingAddress?.country || "India",
      },
      customer_email: customerDetails?.email,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    const payment = new Payment({
      userId,
      amount: calculatedAmount,
      currency,
      paymentMethod: "stripe",
      stripePaymentIntentId: session.payment_intent,
      stripeClientSecret: session.client_secret,
      items,
      shippingAddress,
      customerDetails: {
        ...customerDetails,
        phone: customerDetails.phone || "",
      },
      status: "pending",
      metadata: {
        sessionId: session.id,
        userId: userId,
        orderType: "stripe",
        deliveryOption: deliveryOption,
        shippingCost: shippingCost,
      },
    });

    await payment.save();

    res.status(200).json({
      success: true,
      sessionId: session.id,
      orderId: payment.orderId,
      paymentIntentId: session.payment_intent,
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error);

    if (error.type === "StripeCardError") {
      return res.status(400).json({
        success: false,
        message: "Card error",
        error: error.message,
      });
    } else if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        error: error.message,
      });
    } else if (error.type === "StripeAPIError") {
      return res.status(500).json({
        success: false,
        message: "Payment service error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

export const createCashOnDeliveryOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      customerDetails,
      deliveryOption = "regular",
    } = req.body;
    const userId = req.user.authUserId;

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const getShippingCost = (option, total) => {
      if (option === "regular") {
        if (total >= 3000) return 0;
        if (total >= 2000) return 99;
        return 199;
      } else {
        if (total >= 3000) return 199;
        if (total >= 2000) return 299;
        return 399;
      }
    };

    const shippingCost = getShippingCost(deliveryOption, subtotal);
    const totalAmount = subtotal + shippingCost;

    const payment = new Payment({
      userId,
      amount: totalAmount,
      currency: "inr",
      paymentMethod: "cash_on_delivery",
      items,
      shippingAddress,
      customerDetails: {
        ...customerDetails,
        phone: customerDetails.phone || "",
      },
      status: "pending",
      metadata: {
        deliveryOption: deliveryOption,
        shippingCost: shippingCost,
        subtotal: subtotal,
      },
    });

    await payment.save();

    res.status(200).json({
      success: true,
      orderId: payment.orderId,
      amount: totalAmount,
      shippingCost: shippingCost,
      deliveryOption: deliveryOption,
    });
  } catch (error) {
    console.error("❌ Error creating COD order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create cash on delivery order",
      error: error.message,
    });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const payment = await Payment.findOne({
      orderId: orderId,
      stripePaymentIntentId: paymentIntentId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.status = "completed";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      orderId: payment.orderId,
    });
  } catch (error) {
    console.error("❌ Error confirming payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing orderId or status",
        received: { orderId, status },
      });
    }

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
        orderId,
      });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      orderId: payment.orderId,
      status: payment.status,
    });
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("❌ Error fetching pending payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending payments",
      error: error.message,
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.authUserId;
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Payment.countDocuments({ userId });

    res.status(200).json({
      success: true,
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("❌ Error getting payment history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment history",
      error: error.message,
    });
  }
};

export const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.authUserId;

    const payment = await Payment.findOne({ orderId, userId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("❌ Error getting payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment details",
      error: error.message,
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      try {
        const payment = await Payment.findOne({
          stripePaymentIntentId: session.payment_intent,
        });

        if (payment) {
          payment.status = "completed";

          if (session.shipping?.address) {
            payment.shippingAddress = {
              street:
                session.shipping.address.line1 ||
                payment.shippingAddress.street,
              city:
                session.shipping.address.city || payment.shippingAddress.city,
              state:
                session.shipping.address.state || payment.shippingAddress.state,
              zipCode:
                session.shipping.address.postal_code ||
                payment.shippingAddress.zipCode,
              country:
                session.shipping.address.country ||
                payment.shippingAddress.country,
            };
          }

          await payment.save();
          console.log(`✅ Payment completed for order: ${payment.orderId}`);

          // Clear cart after successful payment
          try {
            const cart = await Cart.findOne({ authUserId: payment.userId });
            if (cart) {
              cart.items = [];
              await cart.save();
              console.log(`✅ Cart cleared for user: ${payment.userId}`);
            }
          } catch (cartError) {
            console.error("❌ Error clearing cart:", cartError);
          }
        } else {
          console.log(
            "❌ No payment record found for payment intent:",
            session.payment_intent
          );

          // Try to find by session ID
          const paymentBySession = await Payment.findOne({
            "metadata.sessionId": session.id,
          });
          if (paymentBySession) {
            paymentBySession.status = "completed";
            paymentBySession.stripePaymentIntentId = session.payment_intent;

            if (session.shipping?.address) {
              paymentBySession.shippingAddress = {
                street:
                  session.shipping.address.line1 ||
                  paymentBySession.shippingAddress.street,
                city:
                  session.shipping.address.city ||
                  paymentBySession.shippingAddress.city,
                state:
                  session.shipping.address.state ||
                  paymentBySession.shippingAddress.state,
                zipCode:
                  session.shipping.address.postal_code ||
                  paymentBySession.shippingAddress.zipCode,
                country:
                  session.shipping.address.country ||
                  paymentBySession.shippingAddress.country,
              };
            }

            await paymentBySession.save();
            console.log(
              `✅ Payment completed for order: ${paymentBySession.orderId}`
            );

            // Clear cart after successful payment
            try {
              const cart = await Cart.findOne({
                authUserId: paymentBySession.userId,
              });
              if (cart) {
                cart.items = [];
                await cart.save();
                console.log(
                  `✅ Cart cleared for user: ${paymentBySession.userId}`
                );
              }
            } catch (cartError) {
              console.error("❌ Error clearing cart:", cartError);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error updating payment status:", error);
      }
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);

      try {
        const payment = await Payment.findOne({
          stripePaymentIntentId: paymentIntent.id,
        });

        if (payment) {
          payment.status = "completed";
          await payment.save();
          console.log(
            `✅ Payment status updated to completed for order: ${payment.orderId}`
          );
        } else {
          console.log(
            `ℹ️ No payment record found for payment intent: ${paymentIntent.id}`
          );
        }
      } catch (error) {
        console.error("❌ Error updating payment status:", error);
      }
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object;
      console.log(`❌ Payment intent failed: ${failedPaymentIntent.id}`);

      try {
        const payment = await Payment.findOne({
          stripePaymentIntentId: failedPaymentIntent.id,
        });

        if (payment) {
          payment.status = "failed";
          await payment.save();
          console.log(
            `❌ Payment status updated to failed for order: ${payment.orderId}`
          );
        }
      } catch (error) {
        console.error("❌ Error updating payment status:", error);
      }
      break;

    case "charge.succeeded":
      const charge = event.data.object;
      console.log(`✅ Charge succeeded: ${charge.id}`);
      // Charge succeeded events are handled by payment_intent.succeeded
      break;

    case "charge.updated":
      const updatedCharge = event.data.object;
      console.log(`📝 Charge updated: ${updatedCharge.id}`);
      // Charge updates are informational
      break;

    case "payment_intent.created":
      const createdPaymentIntent = event.data.object;
      console.log(`🆕 Payment intent created: ${createdPaymentIntent.id}`);
      // Payment intent creation is handled by our createPaymentIntent function
      break;

    case "payment_intent.requires_action":
      const actionRequiredPaymentIntent = event.data.object;
      console.log(
        `⚠️ Payment intent requires action: ${actionRequiredPaymentIntent.id}`
      );
      // This is normal for 3D Secure payments
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
