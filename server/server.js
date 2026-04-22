import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import Interview from "./models/interview.model.js";

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
      expiresIn: "14d",
    });

    //4. login Successfully
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", err: err.message });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById(userId);
  // console.log(user);
  res.json({ user });
});

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
app.get("/interviewers", async (req, res) => {
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
app.post("/interview/request", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const intervieweeId = userId;
    const { interviewerId, category } = req.body;
    await Interview.create({
      interviewerId,
      intervieweeId,
      category,
    });
    res.status(201).json({ message: "Interview request sent", interview });
  } catch (err) {
    res
      .status(401)
      .json({ message: "Error making interview request", error: err.message });
  }
});

app.get("/interview/requests", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    const requests = await Interview.find({
      interviewerId: userId,
      status: "pending",
    })
      .populate("intervieweeId", "name email")
      .select("-__v");
    res.json(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: err.message });
  }
});

app.put("/interview/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["accepted", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }
    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updatedInterview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.status(201).json({ message: `Interview ${status}`, updatedInterview });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating interview ", error: err.message });
  }
});

//interview history
app.get("/interview/history", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.find(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    let interviews;

    if (user.role === "interviewer") {
      interviews = await Interview.find({ interviewerId: userId }) //are they equal if yes then do next line
        .populate("intervieweeId", "name email")
        .sort({ scheduledAt: -1 }); //sort by latest first
    } else {
      interviews = await Interview.find({ intervieweeId: userId })
        .populate("interviewerId", "name email skills")
        .sort({ scheduledAt: -1 });
    }
    res.json(interviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching history", error: err.message });
  }
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

//server start
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
