import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";

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
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User Created Successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", err });
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

//server start
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
