import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { magicLink } from "better-auth/plugins";
import { sendMagicLinkEmail } from "./utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

await client.connect();
console.log("✅ MongoDB connected successfully");

const db = client.db(process.env.MONGO_DB_NAME);
export const auth = betterAuth({
  database: mongodbAdapter(db),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        try {
          const result = await sendMagicLinkEmail({ email, url, token });

          if (!result.success) {
            console.error("Failed to send magic link email:", result.error);
            throw new Error("Failed to send magic link email");
          }
        } catch (error) {
          throw error;
        }
      },
      expiresIn: 300,
      disableSignUp: false,
    }),
  ],
  trustedOrigins: [
    "http://localhost:5173",
    "https://furnishly.online",
    "https://www.furnishly.online",
  ],
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        console.log("Before delete callback - user:", user.id);

        try {
          const { UserProfile } = await import("./models/user.model.js");
          await UserProfile.findOneAndDelete({ authUserId: user.id });
        } catch (error) {
          console.error("Error deleting user profile in beforeDelete:", error);
        }
      },
    },
  },

  onCreate: async (user) => {
    console.log("🆕 New user created in Better Auth:", user.id, user.email);
    try {
      const { UserProfile } = await import("./models/user.model.js");
      await UserProfile.createOrUpdateFromAuth(user);
    } catch (error) {
      console.error("❌ Error creating user profile:", error);
    }
  },

  onSignIn: async (user, account) => {
    console.log(
      "🔐 User signed in:",
      user.id,
      user.email,
      "Account:",
      account?.provider
    );

    if (!account && user.email) {
      try {
        const accountsCollection = db.collection("accounts");

        const existingAccount = await accountsCollection.findOne({
          userId: user.id,
          provider: "magic-link",
        });

        if (!existingAccount) {
          await accountsCollection.insertOne({
            userId: user.id,
            type: "magic-link",
            provider: "magic-link",
            providerAccountId: user.email,
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          console.log(
            "✅ Account record created for magic link user:",
            user.email
          );
        } else {
          console.log(
            "ℹ️ Account record already exists for magic link user:",
            user.email
          );
        }
      } catch (error) {
        console.error(
          "❌ Error creating account record for magic link user:",
          error
        );
      }
    }
  },
  debug: true,
});
