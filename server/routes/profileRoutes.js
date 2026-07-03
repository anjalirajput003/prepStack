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

router.put("/profile/edit", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    // Extract all the possible text fields from the request body
    const {
      name,
      bio,
      linkedin,
      github,
      category,
      experience,
      currentCompany,
      skills,
    } = req.body;

    // Build the update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (github !== undefined) updateData.github = github;

    // Interviewer specific fields
    if (category) updateData.category = category;
    if (experience !== undefined) updateData.experience = experience;
    if (currentCompany !== undefined)
      updateData.currentCompany = currentCompany;
    if (skills) updateData.skills = skills; // Expecting the array we sent from the frontend

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("EDIT PROFILE ERROR:", err);
    res.status(500).json({
      message: "Error updating profile details",
    });
  }
});

//change-password
router.put(
  "/profile/change-password",
  authMiddleware, // Your existing authentication middleware
  async (req, res) => {
    try {
      const { userId } = req.user;
      const { currentPassword, newPassword } = req.body;

      // 1. Fetch the user from the database
      // We explicitly select the password field in case your model excludes it by default
      const user = await User.findById(userId).select("+password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 2. Verify the current password matches what is in the database
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      // 3. Hash the new password for security
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // 4. Save the new hashed password to the user document
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({
        message: "Password updated successfully!",
      });
    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err);
      res.status(500).json({
        message: "An error occurred while changing your password",
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

// Toggle Availability
router.put("/profile/availability", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Flip the current status
    user.isAvailable = !user.isAvailable;
    await user.save();

    res.json({ 
      message: "Availability updated", 
      isAvailable: user.isAvailable 
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling availability", error: err.message });
  }
});

// Search All Users Route
router.get("/users/search", authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    // Search for users where the name matches the query (case-insensitive)
    const users = await User.find({
      name: { $regex: query, $options: "i" }
    })
      .select("name profilePicture role") // Only grab what we need for the UI
      .limit(8); // Limit to top 8 results so the dropdown doesn't get huge

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
});

export default router;
