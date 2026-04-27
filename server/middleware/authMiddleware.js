import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // const user = req.body;
  try {
    const authHeader = req.headers.authorization;
    console.log("Header: ", authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "no token provided" });
    }
    const token = authHeader.split(" ")[1];

    console.log("Token: ", token);

    const userVerified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userVerified;
    console.log("userVerified:", userVerified);

    next();
  } catch (err) {
    console.log("JWT ERROR: ", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
