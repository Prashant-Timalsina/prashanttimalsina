import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; // Expecting "Bearer token"

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Not authorized, login again",
      });
    }

    // Verify Token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Ensure it's an admin or superadmin
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Not authorized, access denied",
      });
    }

    // Attach user info to request for further use
    req.user = {
      email: decodedToken.email,
      role: decodedToken.role,
      userId: decodedToken.userId || null, // Superadmin doesn't have a DB userId
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      msg: "Not authorized, token invalid",
    });
  }
};

export default adminAuth;
