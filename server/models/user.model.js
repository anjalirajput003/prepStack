import mongoose from "mongoose";
  
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["interviewer", "interviewee"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  skills: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    enum: [
      "HR",
      "Tech",
      "Finance",
      "Marketing",
      "Healthcare",
      "Non-Tech",
      "Others",
    ],
  },
  rating: {
    type: Number,
    default: 0,
  },
  interviewsTaken: {
    type: Number,
    default: 0,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },

  warningCount: {
    type: Number,
    default: 0,
  },

  isBanned: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: "",
  },

  bio: {
    type: String,
    default: "",
  },

  experience: {
    type: Number,
    default: 0,
  },

  linkedin: {
    type: String,
    default: "",
  },

  github: {
    type: String,
    default: "",
  },

  currentCompany: {
    type: String,
    default: "",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
