import express from "express";
import Notification from "../models/notification.model.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    }).sort({ createdAt: -1 }); // Newest first
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: err.message });
  }
});

// Mark a single notification as read
router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// Mark all notifications as read
router.put("/notifications/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, read: false },
      { read: true },
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

export default router;
