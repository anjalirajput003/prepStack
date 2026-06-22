// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import User from "./models/user.model.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import authMiddleware from "./middleware/authMiddleware.js";
// import Interview from "./models/interview.model.js";
// import http from "http";
// import { Server } from "socket.io";
// import { log } from "console";
// import { Sandbox } from "@e2b/code-interpreter";
// import startInactivityChecker from "./jobs/inactivityChecker.js";
// import updateLastActive from "./utils/updateLastActive.js";
// import cloudinary from "./config/cloudinary.js";
// import upload from "./middleware/uploadMiddleware.js";
// import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import interviewRoutes from "./routes/interviewRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import leaderboardRoutes from "./routes/leaderboardRoutes.js";
// import codeExecutionRoutes from "./routes/codeExecutionRoutes.js";
// import socketHandler from "./sockets/socketHandler.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import http from "http";
import { Server } from "socket.io";

import startInactivityChecker from "./jobs/inactivityChecker.js";
import updateLastActive from "./utils/updateLastActive.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import codeExecutionRoutes from "./routes/codeExecutionRoutes.js";

import socketHandler from "./sockets/socketHandler.js";

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(profileRoutes);
app.use(interviewRoutes);
app.use(reviewRoutes);
app.use(leaderboardRoutes);
app.use(codeExecutionRoutes);

//database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MONGODB CONNECTED");

    startInactivityChecker();
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

//signup route
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, role, skills, category } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const existingUser = await User.findOne({
//       email,
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email already registered",
//       });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       skills,
//       category,
//     });

//     res.status(201).json({ message: "User Created Successfully", user });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error creating user", error: err.message });
//   }
// });

// //login route
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // console.log(email);

//     //1. user finding
//     const user = await User.findOne({ email });
//     // console.log(user);
//     if (!user) {
//       return res.status(400).json({ message: "User not found!" });
//     }

//     //2. password compare
//     const isMatch = await bcrypt.compare(password, user.password);
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

//profile route
// app.get("/profile", authMiddleware, async (req, res) => {
//   const { userId } = req.user;
//   const user = await User.findById(userId);
//   // console.log(user);
//   res.json({ user });
// });

//get current user
//profile route
// app.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }
//     res.json(user);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error getting user!", error: err.message });
//   }
// });

// //updating user profile
// app.put("/profile", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const {
//       name,
//       bio,
//       linkedin,
//       github,
//       experience,
//       currentCompany,
//       skills,
//       category,
//       isAvailable,
//     } = req.body;
//     const user = await User.findByIdAndUpdate(
//       userId,
//       {
//         name,
//         bio,
//         linkedin,
//         github,
//         experience,
//         currentCompany,
//         skills,
//         category,
//         isAvailable,
//       },
//       { new: true },
//     );
//     res.json({ user });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Error updating profile", error: err.message });
//   }
// });

// //profile picture upload cloudinary
// app.post(
//   "/profile/upload-picture",
//   authMiddleware,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { userId } = req.user;

//       if (!req.file) {
//         return res.status(400).json({
//           message: "No image uploaded",
//         });
//       }

//       const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

//       const result = await cloudinary.uploader.upload(base64Image, {
//         folder: "prepstack-profile-pictures",
//       });

//       const user = await User.findByIdAndUpdate(
//         userId,
//         {
//           profilePicture: result.secure_url,
//         },
//         {
//           new: true,
//         },
//       ).select("-password");

//       res.status(200).json({
//         message: "Profile picture uploaded successfully",
//         user,
//       });
//     } catch (err) {
//       console.log("UPLOAD ERROR:", err);

//       res.status(500).json({
//         message: "Error uploading profile picture",
//       });
//     }
//   },
// );

// //get list of interviewers based on category
// app.get("/interviewers", authMiddleware, async (req, res) => {
//   // const { role } = req.params;
//   try {
//     const { category } = req.query;
//     let filter = {
//       role: "interviewer",
//       isBanned: false,
//       // isAvailable: true,
//     };
//     if (category && category.trim() !== "") {
//       filter.category = category;
//     }
//     const interviewers = await User.find(filter).select("-password");
//     res.json(interviewers);
//     console.log(interviewers);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching interviewers", error: err.message });
//   }
// });

// //get interviewer by id
// app.get("/interviewers/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const interviewer = await User.findOne({
//       _id: id,
//       isBanned: false,
//     }).select("-password");
//     if (!interviewer) {
//       return res.status(400).json({ message: "interviewer not found!" });
//     }
//     res.json(interviewer);
//     console.log(interviewer);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching interviewer", error: err.message });
//   }
// });

// //interview request
// app.post("/interview", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const intervieweeId = userId;
//     const { interviewerId, category } = req.body;
//     if (!interviewerId || !category) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const interviewExists = await Interview.findOne({
//       interviewerId,
//       intervieweeId,
//       status: "pending",
//     });
//     if (interviewExists) {
//       return res.status(409).json({
//         message: "Interview request already sent",
//       });
//     }
//     if (interviewerId === intervieweeId) {
//       return res
//         .status(400)
//         .json({ message: "Cannot send request to yourself" });
//     }

//     const interview = await Interview.create({
//       interviewerId,
//       intervieweeId,
//       category,
//       status: "pending",
//     });
//     res.status(201).json({ message: "Interview request sent", interview });
//   } catch (err) {
//     console.log("FULL INTERVIEW ERROR:", err);
//     res
//       .status(500)
//       .json({ message: "Error making interview request", error: err.message });
//   }
// });

// //interview requests an interviewer got
// app.get("/interview/received", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;

//     const receivedRequests = await Interview.find({
//       interviewerId: userId,
//       // status: "pending",
//     })
//       .populate("intervieweeId", "name email")
//       .select("-__v");
//     res.status(200).json({
//       message: "Received interview requests fetched Successfully",
//       requests: receivedRequests,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Unable to fetch received requests",
//       error: err.message,
//     });
//   }
// });

// //interview status update -> accept, reject
// app.put("/interview/:id", authMiddleware, async (req, res) => {
//   console.log("PUT ROUTE HIT");

//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const { userId } = req.user;

//     // console.log("Request ID:", id);
//     // console.log("Status:", status);
//     // console.log("Logged in user:", userId);

//     const allowed = ["accepted", "rejected"];

//     if (!allowed.includes(status)) {
//       return res.status(400).json({
//         message: "Invalid status",
//       });
//     }

//     const interview = await Interview.findById(id);

//     console.log("Interview found:", interview);

//     if (!interview) {
//       return res.status(404).json({
//         message: "Interview request not found",
//       });
//     }

//     // console.log("Interviewer ID:", interview.interviewerId);
//     // console.log("Type:", typeof interview.interviewerId);

//     if (String(interview.interviewerId) !== String(userId)) {
//       return res.status(403).json({
//         message: "Not authorized",
//       });
//     }

//     if (interview.status !== "pending") {
//       return res.status(400).json({
//         message: "Already processed",
//       });
//     }

//     interview.status = status;
//     await updateLastActive(req.user.userId);

//     await interview.save();

//     res.status(200).json({
//       message: "Updated successfully",
//       interview,
//     });
//   } catch (err) {
//     console.log("FULL BACKEND ERROR:", err);

//     res.status(500).json({
//       message: "Error updating interview",
//     });
//   }
// });

// //interview schedule by interviewer
// app.put("/interview/:id/schedule", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params; //interview id
//     const { scheduledAt } = req.body;
//     const { userId } = req.user;

//     if (!scheduledAt) {
//       return res
//         .status(400)
//         .json({ message: "Interview date/time is required" });
//     }

//     const interview = await Interview.findById(id);

//     if (!interview) {
//       return res.status(404).json({ message: "Interview doesn't exist" });
//     }

//     //only interviewer can schedule interview
//     if (String(interview.interviewerId) !== String(userId)) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to schedule this interview" });
//     }

//     //only accepted interview can be scheduled
//     if (interview.status !== "accepted") {
//       return res
//         .status(400)
//         .json({ message: "Only accepted interviews can be scheduled" });
//     }

//     //future date validation
//     const scheduledDate = new Date(scheduledAt);

//     if (scheduledDate <= new Date()) {
//       return res
//         .status(400)
//         .json({ message: "Please choose a future date/time" });
//     }

//     interview.scheduledAt = scheduledDate;
//     interview.status = "scheduled";
//     await updateLastActive(req.user.userId);

//     await interview.save();

//     res
//       .status(200)
//       .json({ message: "Interview schleduled successfully", interview });
//   } catch (err) {
//     console.log("SCHEDULING ERROR: ", err);
//     res
//       .status(500)
//       .json({ message: "Error scheduling interview", error: err.message });
//   }
// });

// //interview cancellation
// app.put("/interview/:id/cancel", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.user;
//     const interview = await Interview.findById(id);

//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     //checking whether the cancellation request is made by interviewer or interviewee because only these people can request cancellation
//     const isInterviewer = String(interview.interviewerId) === String(userId);
//     const isInterviewee = String(interview.intervieweeId) === String(userId);

//     if (!isInterviewer && !isInterviewee) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to cancel this interview" });
//     }

//     if (
//       interview.status === "rejected" ||
//       interview.status === "completed" ||
//       interview.status === "cancelled"
//     ) {
//       return res
//         .status(400)
//         .json({ message: "This interview is already cancelled" });
//     }

//     interview.status = "cancelled";
//     await interview.save();

//     res
//       .status(200)
//       .json({ message: "Interview cancelled successfully", interview });
//   } catch (err) {
//     console.log("CANCEL ERROR", err);
//     res
//       .status(500)
//       .json({ message: "Error cancelling interview", error: err.message });
//   }
// });

// //interview complete
// app.put("/interview/:id/complete", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.user;

//     const interview = await Interview.findById(id);

//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     // console.log("INTERVIEWER ID:", String(interview.interviewerId));

//     // console.log("LOGGED USER:", String(userId));
//     //only interviewer can complete
//     if (String(interview.interviewerId) !== String(userId)) {
//       return res
//         .status(403)
//         .json({ message: "Only interviewers can mark interview as completed" });
//     }

//     //only scheduled interviews can be completed
//     if (interview.status !== "scheduled") {
//       return res
//         .status(400)
//         .json({ message: "Only scheduled interviews can be marked completed" });
//     }

//     interview.status = "completed";
//     await interview.save();

//     res
//       .status(200)
//       .json({ message: "Interview marked as completed", interview });
//   } catch (err) {
//     console.log("COMPLETE ERROR", err);

//     res.status(500).json({ message: "Error completing interview" });
//   }
// });

// //interview history
// app.get("/interview/history", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;

//     const history = await Interview.find({
//       status: "completed",
//       $or: [{ interviewerId: userId }, { intervieweeId: userId }],
//     })
//       .populate("interviewerId", "name email")
//       .populate("intervieweeId", "name email");

//     res
//       .status(200)
//       .json({ message: "Interview history fetched successfully", history });
//   } catch (err) {
//     console.log("HISTORY ERROR", err);
//     res
//       .status(500)
//       .json({ message: "Error fetching history", error: err.message });
//   }
// });

// //rating & review
// app.put("/interview/:id/review", authMiddleware, async (req, res) => {
//   try {
//     // console.log("NEW REVIEW ROUTE RUNNING");
//     const { id } = req.params;
//     const { userId } = req.user;
//     const { rating, feedback } = req.body;

//     const interview = await Interview.findById(id);

//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     //only interviewee can review
//     if (String(interview.intervieweeId) !== String(userId)) {
//       return res
//         .status(403)
//         .json({ message: "Only interviewee can submit review" });
//     }

//     //only completed interviews can be reviewed
//     if (interview.status !== "completed") {
//       return res
//         .status(400)
//         .json({ message: "Only completed interviews can be reviewed" });
//     }

//     //prevent duplicate reviews
//     if (interview.rating) {
//       return res.status(400).json({ message: "Review already submitted" });
//     }

//     //rating validation
//     if (!rating || rating < 1 || rating > 5) {
//       return res
//         .status(400)
//         .json({ message: "Rating must be between 1 and 5" });
//     }

//     interview.rating = rating;
//     interview.feedback = feedback || "";
//     await interview.save();

//     const interviewer = await User.findById(interview.interviewerId);

//     if (!interviewer) {
//       return res.status(404).json({
//         message: "Interviewer not found",
//       });
//     }

//     // console.log("Fetched interviewer:", interviewer.select("-password"));

//     const totalScore = interviewer.rating * interviewer.interviewsTaken;
//     const newAvg = (totalScore + rating) / (interviewer.interviewsTaken + 1);

//     interviewer.rating = newAvg;
//     interviewer.interviewsTaken += 1;

//     await interviewer.save();

//     res
//       .status(200)
//       .json({ message: "Review submitted successfully", interview });
//   } catch (err) {
//     console.log("REVIEW ERROR", err);

//     res.status(500).json({ message: "Error submitting review" });
//   }
// });

// //showing feedback on interviewers profiles
// app.get("/interviewers/:id/reviews", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const reviews = await Interview.find({
//       interviewerId: id,
//       rating: { $exists: true },
//     })
//       .populate("intervieweeId", "name")
//       .select("rating feedback intervieweeId");

//     res.status(200).json({
//       reviews,
//     });
//   } catch (err) {
//     console.log("REVIEWS ERROR:", err);

//     res.status(500).json({
//       message: "Error fetching reviews",
//     });
//   }
// });

//interviews request user sent
// app.get("/interview/my", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const requests = await Interview.find({ intervieweeId: userId }).populate(
//       "interviewerId",
//       "name email category skills",
//     );
//     res
//       .status(200)
//       .json({ message: "Interview requests fetched Successfully", requests });
//     console.log(requests);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Unable to get requests", error: err.message });
//   }
// });

// //authenticating user
// app.get("/me", authMiddleware, (req, res) => {
//   res.status(200).json({
//     message: "Authenticated",
//     user: req.user,
//   });
// });

// //role switch
// app.put("/user/switch-role", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.user;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     if (user.role === "interviewer") {
//       user.role = "interviewee";
//     } else {
//       user.role = "interviewer";
//     }
//     await user.save();
//     res.json({ message: "Successfully switched user", role: user.role });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error switching role", error: err.message });
//   }
// });

// //code execution on output console
// app.post("/execute", async (req, res) => {
//   let sandbox;

//   try {
//     const { sourceCode, language } = req.body;

//     // console.log("SOURCE CODE:");
//     // console.log(sourceCode);

//     // console.log("LANGUAGE:");
//     // console.log(language);

//     sandbox = await Sandbox.create({
//       apiKey: process.env.E2B_API_KEY,
//     });

//     // console.log("LANGUAGE:", language);
//     const execution = await sandbox.runCode(sourceCode, {
//       language,
//     });

//     console.log("EXECUTION RESULT:", JSON.stringify(execution, null, 2));

//     const stdout = execution.logs?.stdout?.join("") || "";

//     const stderr = execution.logs?.stderr?.join("") || "";

//     const runtimeError = execution.error
//       ? `${execution.error.name}: ${execution.error.value}`
//       : "";

//     const output = runtimeError || stderr || stdout || "No output";

//     res.status(200).json({
//       output,
//     });
//   } catch (err) {
//     console.log("EXECUTION ERROR:", err);

//     let output = "Execution failed";

//     if (err.name === "TimeoutError") {
//       output =
//         "Execution timed out. Your code exceeded the maximum execution time.";
//     }

//     res.status(500).json({
//       output,
//     });
//   } finally {
//     try {
//       if (sandbox) {
//         await sandbox.kill();
//       }
//     } catch (killError) {
//       console.log("SANDBOX CLEANUP ERROR:", killError);
//     }
//   }
// });

// //leaderboard
// app.get("/leaderboard", async (req, res) => {
//   try {
//     const interviewers = await User.find({
//       role: "interviewer",
//       isBanned: false,
//       interviewsTaken: { $gte: 3 },
//     })
//       .select("-password")
//       .sort({
//         rating: -1,
//         interviewsTaken: -1,
//       });

//     res.status(200).json({
//       interviewers,
//     });
//   } catch (err) {
//     console.log("LEADERBOARD ERROR:", err);

//     res.status(500).json({
//       message: "Error fetching leaderboard",
//     });
//   }
// });

//http server using express app
const server = http.createServer(app);

// const roomTimers = {};
// const roomIntervals = {};

//socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

//socket connection listener
// io.on("connection", (socket) => {
//   // console.log("New socket connected:", socket.id);

//   socket.on("join-room", (interviewId) => {
//     socket.join(interviewId);
//     socket.data.interviewId = interviewId;

//     console.log(`${socket.id} joined room ${interviewId}`);

//     const room = io.sockets.adapter.rooms.get(interviewId);
//     console.log("Room members:", [...room]);

//     const participantsCount = room ? room.size : 0;

//     console.log(`Participants in ${interviewId}:`, participantsCount);

//     if (participantsCount === 2) {
//       socket.to(interviewId).emit("user-joined");

//       if (!roomTimers[interviewId]) {
//         roomTimers[interviewId] = 3600;

//         roomIntervals[interviewId] = setInterval(() => {
//           roomTimers[interviewId]--;

//           io.to(interviewId).emit("timer-update", roomTimers[interviewId]);

//           if (roomTimers[interviewId] <= 0) {
//             clearInterval(roomIntervals[interviewId]);

//             delete roomIntervals[interviewId];
//           }
//         }, 1000);
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     const interviewId = socket.data.interviewId;

//     if (!interviewId) return;

//     const room = io.sockets.adapter.rooms.get(interviewId);

//     const participantsCount = room ? room.size : 0;

//     // console.log(`Participants remaining in ${interviewId}:`, participantsCount);
//     socket.to(interviewId).emit("participant-disconnected");

//     if (participantsCount === 0) {
//       console.log(`Cleaning timer for room ${interviewId}`);

//       clearInterval(roomIntervals[interviewId]);

//       delete roomIntervals[interviewId];

//       delete roomTimers[interviewId];
//     }
//   });
//   //offer and answer from one browser to another
//   socket.on("offer", ({ interviewId, offer }) => {
//     socket.to(interviewId).emit("receive-offer", offer);
//   });

//   socket.on("answer", ({ interviewId, answer }) => {
//     socket.to(interviewId).emit("receive-answer", answer);
//   });

//   socket.on("ice-candidate", ({ interviewId, candidate }) => {
//     socket.to(interviewId).emit("receive-ice-candidate", candidate);
//   });

//   socket.on("send-message", ({ interviewId, message }) => {
//     console.log("MESSAGE RECEIVED ON SERVER:", message);
//     socket.to(interviewId).emit("receive-message", message);
//   });

//   socket.on("code-change", ({ interviewId, code }) => {
//     socket.to(interviewId).emit("receive-code", code);
//   });

//   socket.on("output-change", ({ interviewId, output }) => {
//     socket.to(interviewId).emit("receive-output", output);
//   });

//   socket.on("end-interview", (interviewId) => {
//     socket.to(interviewId).emit("interview-ended");
//   });
// });

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
