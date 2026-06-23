import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/authMiddleware.js";
import updateLastActive from "../utils/updateLastActive.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, category } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    if (role === "interviewer" && !category) {
      return res.status(400).json({
        message: "Please select a category",
      });
    }

    // const user = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role,
    //   category: role === "interviewer" ? category : "",
    // });

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "interviewer") {
      userData.category = category;
    }

    const user = await User.create(userData);

    res.status(201).json({ message: "User Created Successfully", user });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    await updateLastActive(user._id);


    if (user.isBanned) {
      return res.status(403).json({
        message: "Account banned due to inactivity",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });


    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Error logging in",
      err: err.message,
    });
  }
});

//authenticating user
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
});

export default router;
