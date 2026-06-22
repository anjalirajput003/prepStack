import express from "express";

import User from "../models/user.model.js";

const router = express.Router();

//leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const interviewers = await User.find({
      role: "interviewer",
      isBanned: false,
      interviewsTaken: { $gte: 3 },
    })
      .select("-password")
      .sort({
        rating: -1,
        interviewsTaken: -1,
      });

    res.status(200).json({
      interviewers,
    });
  } catch (err) {
    console.log("LEADERBOARD ERROR:", err);

    res.status(500).json({
      message: "Error fetching leaderboard",
    });
  }
});

export default router;
