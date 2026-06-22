import express from "express";

import Interview from "../models/interview.model.js";
import User from "../models/user.model.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//rating & review
router.put("/interview/:id/review", authMiddleware, async (req, res) => {
  try {
    // console.log("NEW REVIEW ROUTE RUNNING");
    const { id } = req.params;
    const { userId } = req.user;
    const { rating, feedback } = req.body;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    //only interviewee can review
    if (String(interview.intervieweeId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Only interviewee can submit review" });
    }

    //only completed interviews can be reviewed
    if (interview.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Only completed interviews can be reviewed" });
    }

    //prevent duplicate reviews
    if (interview.rating) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    //rating validation
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    interview.rating = rating;
    interview.feedback = feedback || "";
    await interview.save();

    const interviewer = await User.findById(interview.interviewerId);

    if (!interviewer) {
      return res.status(404).json({
        message: "Interviewer not found",
      });
    }

    // console.log("Fetched interviewer:", interviewer.select("-password"));

    const totalScore = interviewer.rating * interviewer.interviewsTaken;
    const newAvg = (totalScore + rating) / (interviewer.interviewsTaken + 1);

    interviewer.rating = newAvg;
    interviewer.interviewsTaken += 1;

    await interviewer.save();

    res
      .status(200)
      .json({ message: "Review submitted successfully", interview });
  } catch (err) {
    console.log("REVIEW ERROR", err);

    res.status(500).json({ message: "Error submitting review" });
  }
});

//showing feedback on interviewers profiles
router.get("/interviewers/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Interview.find({
      interviewerId: id,
      rating: { $exists: true },
    })
      .populate("intervieweeId", "name")
      .select("rating feedback intervieweeId");

    res.status(200).json({
      reviews,
    });
  } catch (err) {
    console.log("REVIEWS ERROR:", err);

    res.status(500).json({
      message: "Error fetching reviews",
    });
  }
});

export default router;
