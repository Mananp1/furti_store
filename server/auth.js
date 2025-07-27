import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

await client.connect();
console.log("✅ MongoDB connected successfully");

const db = client.db("store_db");
console.log("📦 Using database:", db.databaseName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  trustedOrigins: ["http://localhost:5173"],
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        console.log("Before delete callback - user:", user.id);
        // Delete the user profile from our custom collection
        try {
          const { UserProfile } = await import("./models/user.model.js");
          await UserProfile.findOneAndDelete({ authUserId: user.id });
          console.log("User profile deleted in beforeDelete callback");
        } catch (error) {
          console.error("Error deleting user profile in beforeDelete:", error);
        }
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline", // ensures refresh token
      prompt: "select_account+consent",
    },
  },
  debug: true,
});
