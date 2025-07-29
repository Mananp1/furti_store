import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeConfig = {
  currency: "inr",
  paymentMethods: ["card", "upi", "netbanking", "wallet"],
  supportedCurrencies: ["inr", "usd"],
};

export const validateStripeConfig = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("⚠️ STRIPE_WEBHOOK_SECRET not set - webhooks will not work");
  }
};

export const formatAmountForStripe = (amount, currency = "inr") => {
  if (currency === "inr") {
    return Math.round(amount * 100);
  }
  if (currency === "usd") {
    return Math.round(amount * 100);
  }
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount, currency = "inr") => {
  if (currency === "inr") {
    return amount / 100;
  }
  if (currency === "usd") {
    return amount / 100;
  }
  return amount / 100;
};
