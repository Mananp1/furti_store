import { auth } from "../auth.js";

/**
 * Middleware to authenticate user and attach user info to request
 * This middleware extracts the user from better-auth session
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // Get the session from better-auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    // Attach user info to request object
    req.user = {
      authUserId: session.user.id,
      email: session.user.email,
      session: session,
    };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(401).json({
      error: "Authentication failed",
      message: "Invalid or expired session",
    });
  }
};
