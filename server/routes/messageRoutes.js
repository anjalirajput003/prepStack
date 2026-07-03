import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Get chat history between the logged-in user and another specific user
router.get("/messages/:otherUserId", authMiddleware, async (req, res) => {
  try {
    // Your JWT sets req.user.userId
    const currentUserId = req.user.userId;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 }); // Sort chronologically (oldest to newest)

    res.status(200).json(messages);
  } catch (err) {
    console.log("FETCH MESSAGES ERROR:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// 2. EXISTING: Get a list of all users the current user has chatted with
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    }).sort({ createdAt: -1 });

    const contactIds = new Set();
    messages.forEach((msg) => {
      if (String(msg.senderId) !== String(currentUserId)) {
        contactIds.add(String(msg.senderId));
      }
      if (String(msg.receiverId) !== String(currentUserId)) {
        contactIds.add(String(msg.receiverId));
      }
    });

    const contacts = await User.find({
      _id: { $in: Array.from(contactIds) },
    }).select("name email profilePicture role");

    res.status(200).json(contacts);
  } catch (err) {
    console.log("FETCH CONVERSATIONS ERROR:", err);
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

export default router;
