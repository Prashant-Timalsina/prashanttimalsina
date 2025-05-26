import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, Login Again",
    });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.body.userId = decoded.id; // Attach userId to req.body
    req.user = { id: decoded.id, role: decoded.role }; // Attach user object to request
    // console.log("Authenticated User ID:", req.user.id); // Debugging log

    next();
  } catch (error) {
    // console.log("JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token, Login Again",
    });
  }
};

export default authUser;
