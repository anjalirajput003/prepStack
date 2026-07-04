import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // <-- Make sure to import your User model!

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // Build a rich req.user object for all your routes to use
    req.user = {
      userId: currentUser._id, // For routes using const { userId } = req.user
      _id: currentUser._id, // For routes using req.user._id
      name: currentUser.name, // <-- THIS FIXES THE 'UNDEFINED' NOTIFICATIONS!
      email: currentUser.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

export default authMiddleware;
