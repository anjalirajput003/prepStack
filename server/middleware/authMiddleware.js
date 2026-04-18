import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.verify(token, process.env.JWT_SECRET);

  res.status(200).json({ message: "Welcome to Dashboard!" });
  next();
};

export default authMiddleware;
