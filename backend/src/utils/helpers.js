import jwt from "jsonwebtoken";

export const generateToken = (userId, roleId) => {
  return jwt.sign(
    { userId, roleId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};