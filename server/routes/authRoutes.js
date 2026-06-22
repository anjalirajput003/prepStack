import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/authMiddleware.js";
import updateLastActive from "../utils/updateLastActive.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, skills, category } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      skills,
      category,
    });

    res.status(201).json({ message: "User Created Successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

//login route
// router.post("/login", async (req, res) => {
//   try {
//     console.log("LOGIN ROUTE HIT");
//     const { email, password } = req.body;
//     // console.log(email);
//     console.log("EMAIL:", email);

//     //1. user finding
//     const user = await User.findOne({ email });
//     console.log("USER FOUND:", !!user);
//     // console.log(user);
//     if (!user) {
//       return res.status(400).json({ message: "User not found!" });
//     }

//     //2. password compare
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("PASSWORD MATCH:", isMatch);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     await updateLastActive(user._id);
//     if (user.isBanned) {
//       return res.status(403).json({
//         message: "Account banned due to inactivity",
//       });
//     }
//     //3. generate token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });
//     console.log("token received:", token);

//     //4. login Successfully
//     res.json({ message: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Error logging in", err: err.message });
//   }
// });

router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN ROUTE HIT");

    const { email, password } = req.body;

    console.log("EMAIL:", email);

    const user = await User.findOne({ email });

    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    await updateLastActive(user._id);

    console.log("UPDATED LAST ACTIVE");

    if (user.isBanned) {
      return res.status(403).json({
        message: "Account banned due to inactivity",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("TOKEN CREATED");

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
