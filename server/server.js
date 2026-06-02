import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import Interview from "./models/interview.model.js";
import http from "http";
import { Server } from "socket.io";
import { log } from "console";

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

//signup route
app.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      skills,
      category,
      rating,
      interviewsTaken,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      skills,
      category,
      rating,
      interviewsTaken,
    });

    res.status(201).json({ message: "User Created Successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

//login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email);

    //1. user finding
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    //2. password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //3. generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log("token received:", token);

    //4. login Successfully
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", err: err.message });
  }
});

//profile route
app.get("/profile", authMiddleware, async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);
  // console.log(user);
  res.json({ user });
});

//username update
app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
    res.json({ user });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating profile", error: err.message });
  }
});

//get list of interviewers based on category
app.get("/interviewers", authMiddleware, async (req, res) => {
  // const { role } = req.params;
  try {
    const { category } = req.query;
    let filter = { role: "interviewer" };
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
app.get("/interviewers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const interviewer = await User.findById(id).select("-password");
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

//interview request
app.post("/interview", authMiddleware, async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error making interview request", error: err.message });
  }
});

//interview requests an interviewer got
app.get("/interview/received", authMiddleware, async (req, res) => {
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
app.put("/interview/:id", authMiddleware, async (req, res) => {
  console.log("PUT ROUTE HIT");

  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId } = req.user;

    console.log("Request ID:", id);
    console.log("Status:", status);
    console.log("Logged in user:", userId);

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

    console.log("Interviewer ID:", interview.interviewerId);
    console.log("Type:", typeof interview.interviewerId);

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
app.put("/interview/:id/schedule", authMiddleware, async (req, res) => {
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
app.put("/interview/:id/cancel", authMiddleware, async (req, res) => {
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
app.put("/interview/:id/complete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

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
app.get("/interview/history", authMiddleware, async (req, res) => {
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

//rating
app.put("/interview/:id/review", authMiddleware, async (req, res) => {
  try {
    console.log("NEW REVIEW ROUTE RUNNING");
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

//interviews request user sent
app.get("/interview/my", authMiddleware, async (req, res) => {
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

//authenticating user
app.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
});

//role switch
app.put("/user/switch-role", authMiddleware, async (req, res) => {
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

//get current user
app.get("/user/me", authMiddleware, async (req, res) => {
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

//http server using express app
const server = http.createServer(app);

//socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//socket connection listener
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("join-room", (interviewId) => {
    socket.join(interviewId);

    console.log(`${socket.id} joined room ${interviewId}`);

    socket.to(interviewId).emit("user-joined");
  });

  //offer and answer from one browser to another
  socket.on("offer", ({ interviewId, offer }) => {
    socket.to(interviewId).emit("receive-offer", offer);
  });

  socket.on("answer", ({ interviewId, answer }) => {
    socket.to(interviewId).emit("receive-answer", answer);
  });

  socket.on("ice-candidate", ({ interviewId, candidate }) => {
    socket.to(interviewId).emit("receive-ice-candidate", candidate);
  });
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
