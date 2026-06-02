import mongoose from "mongoose";

const Schema = mongoose.Schema;

const interviewSchema = new Schema({
  interviewerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  intervieweeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "scheduled",
      "rejected",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    trim: true,
  },
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
