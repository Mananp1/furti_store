import { auth } from "../auth.js";


export const authenticateUser = async (req, res, next) => {
  try {

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    
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
