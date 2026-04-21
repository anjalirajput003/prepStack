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
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
  scheduledAt: {
    type: Date,
    default: Date.now,
  },
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
