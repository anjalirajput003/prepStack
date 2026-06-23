import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "no token provided" });
    }
    const token = authHeader.split(" ")[1];

    const userVerified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userVerified;

    next();
  } catch (err) {
    console.log("JWT ERROR: ", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
