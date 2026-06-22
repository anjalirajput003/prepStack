import express from "express";

import Interview from "../models/interview.model.js";
import User from "../models/user.model.js";

import authMiddleware from "../middleware/authMiddleware.js";
import updateLastActive from "../utils/updateLastActive.js";

const router = express.Router();

//interview request
router.post("/interview", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const intervieweeId = userId;
    const { interviewerId, category } = req.body;
    if (!interviewerId || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const interviewExists = await Interview.findOne({
      interviewerId,
      intervieweeId,
      status: "pending",
    });
    if (interviewExists) {
      return res.status(409).json({
        message: "Interview request already sent",
      });
    }
    if (interviewerId === intervieweeId) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    const interview = await Interview.create({
      interviewerId,
      intervieweeId,
      category,
      status: "pending",
    });
    res.status(201).json({ message: "Interview request sent", interview });
  } catch (err) {
    console.log("FULL INTERVIEW ERROR:", err);
    res
      .status(500)
      .json({ message: "Error making interview request", error: err.message });
  }
});

//interview requests an interviewer got
router.get("/interview/received", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    const receivedRequests = await Interview.find({
      interviewerId: userId,
      // status: "pending",
    })
      .populate("intervieweeId", "name email")
      .select("-__v");
    res.status(200).json({
      message: "Received interview requests fetched Successfully",
      requests: receivedRequests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch received requests",
      error: err.message,
    });
  }
});

//interview status update -> accept, reject
router.put("/interview/:id", authMiddleware, async (req, res) => {
  console.log("PUT ROUTE HIT");

  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId } = req.user;

    // console.log("Request ID:", id);
    // console.log("Status:", status);
    // console.log("Logged in user:", userId);

    const allowed = ["accepted", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const interview = await Interview.findById(id);

    console.log("Interview found:", interview);

    if (!interview) {
      return res.status(404).json({
        message: "Interview request not found",
      });
    }

    // console.log("Interviewer ID:", interview.interviewerId);
    // console.log("Type:", typeof interview.interviewerId);

    if (String(interview.interviewerId) !== String(userId)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (interview.status !== "pending") {
      return res.status(400).json({
        message: "Already processed",
      });
    }

    interview.status = status;
    await updateLastActive(req.user.userId);

    await interview.save();

    res.status(200).json({
      message: "Updated successfully",
      interview,
    });
  } catch (err) {
    console.log("FULL BACKEND ERROR:", err);

    res.status(500).json({
      message: "Error updating interview",
    });
  }
});

//interview schedule by interviewer
router.put("/interview/:id/schedule", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; //interview id
    const { scheduledAt } = req.body;
    const { userId } = req.user;

    if (!scheduledAt) {
      return res
        .status(400)
        .json({ message: "Interview date/time is required" });
    }

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview doesn't exist" });
    }

    //only interviewer can schedule interview
    if (String(interview.interviewerId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to schedule this interview" });
    }

    //only accepted interview can be scheduled
    if (interview.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Only accepted interviews can be scheduled" });
    }

    //future date validation
    const scheduledDate = new Date(scheduledAt);

    if (scheduledDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Please choose a future date/time" });
    }

    interview.scheduledAt = scheduledDate;
    interview.status = "scheduled";
    await updateLastActive(req.user.userId);

    await interview.save();

    res
      .status(200)
      .json({ message: "Interview schleduled successfully", interview });
  } catch (err) {
    console.log("SCHEDULING ERROR: ", err);
    res
      .status(500)
      .json({ message: "Error scheduling interview", error: err.message });
  }
});

//interview cancellation
router.put("/interview/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    //checking whether the cancellation request is made by interviewer or interviewee because only these people can request cancellation
    const isInterviewer = String(interview.interviewerId) === String(userId);
    const isInterviewee = String(interview.intervieweeId) === String(userId);

    if (!isInterviewer && !isInterviewee) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this interview" });
    }

    if (
      interview.status === "rejected" ||
      interview.status === "completed" ||
      interview.status === "cancelled"
    ) {
      return res
        .status(400)
        .json({ message: "This interview is already cancelled" });
    }

    interview.status = "cancelled";
    await interview.save();

    res
      .status(200)
      .json({ message: "Interview cancelled successfully", interview });
  } catch (err) {
    console.log("CANCEL ERROR", err);
    res
      .status(500)
      .json({ message: "Error cancelling interview", error: err.message });
  }
});

//interview complete
router.put("/interview/:id/complete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // console.log("INTERVIEWER ID:", String(interview.interviewerId));

    // console.log("LOGGED USER:", String(userId));
    //only interviewer can complete
    if (String(interview.interviewerId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Only interviewers can mark interview as completed" });
    }

    //only scheduled interviews can be completed
    if (interview.status !== "scheduled") {
      return res
        .status(400)
        .json({ message: "Only scheduled interviews can be marked completed" });
    }

    interview.status = "completed";
    await interview.save();

    res
      .status(200)
      .json({ message: "Interview marked as completed", interview });
  } catch (err) {
    console.log("COMPLETE ERROR", err);

    res.status(500).json({ message: "Error completing interview" });
  }
});

//interview history
router.get("/interview/history", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    const history = await Interview.find({
      status: "completed",
      $or: [{ interviewerId: userId }, { intervieweeId: userId }],
    })
      .populate("interviewerId", "name email")
      .populate("intervieweeId", "name email");

    res
      .status(200)
      .json({ message: "Interview history fetched successfully", history });
  } catch (err) {
    console.log("HISTORY ERROR", err);
    res
      .status(500)
      .json({ message: "Error fetching history", error: err.message });
  }
});

//interviews request user sent
router.get("/interview/my", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const requests = await Interview.find({ intervieweeId: userId }).populate(
      "interviewerId",
      "name email category skills",
    );
    res
      .status(200)
      .json({ message: "Interview requests fetched Successfully", requests });
    console.log(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to get requests", error: err.message });
  }
});

export default router;
