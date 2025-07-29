import { app } from "./app.js";
import { connectDB } from "./utils/db.js";
import { validateStripeConfig } from "./utils/stripeConfig.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {

    await connectDB();

    validateStripeConfig();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
