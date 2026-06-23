import express from "express";

import User from "../models/user.model.js";
import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";

const router = express.Router();

//profile route
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting user!", error: err.message });
  }
});

//updating user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      name,
      bio,
      linkedin,
      github,
      experience,
      currentCompany,
      skills,
      category,
      isAvailable,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        linkedin,
        github,
        experience,
        currentCompany,
        skills,
        category,
        isAvailable,
      },
      { new: true },
    );
    res.json({ user });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating profile", error: err.message });
  }
});

//profile picture upload cloudinary
router.post(
  "/profile/upload-picture",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { userId } = req.user;

      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "prepstack-profile-pictures",
      });

      const user = await User.findByIdAndUpdate(
        userId,
        {
          profilePicture: result.secure_url,
        },
        {
          new: true,
        },
      ).select("-password");

      res.status(200).json({
        message: "Profile picture uploaded successfully",
        user,
      });
    } catch (err) {
      console.log("UPLOAD ERROR:", err);

      res.status(500).json({
        message: "Error uploading profile picture",
      });
    }
  },
);

//get list of interviewers based on category
router.get("/interviewers", authMiddleware, async (req, res) => {
  // const { role } = req.params;
  try {
    const { category } = req.query;
    let filter = {
      role: "interviewer",
      isBanned: false,
      // isAvailable: true,
    };
    if (category && category.trim() !== "") {
      filter.category = category;
    }
    const interviewers = await User.find(filter).select("-password");
    res.json(interviewers);
    console.log(interviewers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching interviewers", error: err.message });
  }
});

//get interviewer by id
router.get("/interviewers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const interviewer = await User.findOne({
      _id: id,
      isBanned: false,
    }).select("-password");
    if (!interviewer) {
      return res.status(400).json({ message: "interviewer not found!" });
    }
    res.json(interviewer);
    console.log(interviewer);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching interviewer", error: err.message });
  }
});

//role switch
router.put("/user/switch-role", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.role === "interviewer") {
      user.role = "interviewee";
    } else {
      user.role = "interviewer";
    }
    await user.save();
    res.json({ message: "Successfully switched user", role: user.role });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error switching role", error: err.message });
  }
});

//change password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error changing password",
      error: err.message,
    });
  }
});

export default router;
