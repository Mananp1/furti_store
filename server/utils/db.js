import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const options = {
      dbName: "store_db",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    isConnected = true;

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      isConnected = true;
    });
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
  } catch (error) {
    console.error("❌ Mongoose disconnection error:", error);
  }
};

export const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
  };
};
