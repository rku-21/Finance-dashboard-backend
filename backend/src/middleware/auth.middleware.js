import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate("roleId");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "account is inactive",
      });
    }

    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({
      message: "invalid or expired token",
    });
  }
};