import Notification from "../models/notification.model.js";

// Pass the global 'io' object to this function so it can emit events
const createNotification = async (
  io,
  { recipient, sender, type, title, message, link },
) => {
  try {
    // 1. Save to database
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link,
    });

    // 2. Emit real-time socket event to the specific user's room
    if (io) {
      io.to(recipient.toString()).emit("new-notification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export default createNotification;
