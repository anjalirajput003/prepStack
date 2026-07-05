import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/authMiddleware.js";
import updateLastActive from "../utils/updateLastActive.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
    
    // Check if password matches before proceeding!
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await updateLastActive(user._id);

    if (user.isBanned) {
      return res.status(403).json({
        message: "Account banned due to inactivity",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });


    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({
        message: "Logged in successfully",
        user: { _id: user._id, name: user.name },
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

//logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });
  res.status(200).json({ message: "Logged out successfully" });
});


// --- FORGOT PASSWORD ROUTE ---
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account with that email address exists." });
    }

    // 1. Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Set token and expiration (1 hour from now) on the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // 3. Configure Nodemailer
    // NOTE: For Gmail, you must generate an "App Password" in your Google Account settings
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g., "your.email@gmail.com"
        pass: process.env.EMAIL_PASS, // e.g., your 16-character App Password
      },
    });

    // 4. Create the reset link
    const resetURL = `https://prep-stack-two.vercel.app/reset-password/${resetToken}`;

    // 5. Send the email
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "PrepStack Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetURL}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent successfully!" });

  } catch (err) {
    console.log("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
});


// --- RESET PASSWORD ROUTE ---
router.put("/reset-password/:token", async (req, res) => {
  try {
    // 1. Find user by token AND ensure it hasn't expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    // 2. Hash the new password
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update the user document and clear the reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset. You can now log in." });

  } catch (err) {
    console.log("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
});

export default router; // EXPORT MUST BE AT THE VERY BOTTOM
