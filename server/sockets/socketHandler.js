import Message from "../models/message.model.js";
export default function socketHandler(io) {
  const roomTimers = {};
  const roomIntervals = {};

  //socket connection listener
  io.on("connection", (socket) => {
    //When a user logs into the app, they join a personal room using their own User ID
    socket.on("register-user", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} is online and ready for DMs`);
    });

    // Handle sending a Direct Message (Persistent)
    socket.on("send-direct-message", async ({ senderId, receiverId, text }) => {
      try {
        // 1. Save message to MongoDB so it persists
        const newMessage = await Message.create({
          senderId,
          receiverId,
          text,
        });

        // 2. Broadcast it live directly to the receiver's personal room (if they are online)
        socket.to(receiverId).emit("receive-direct-message", newMessage);

        // 3. Send it back to the sender so their UI updates instantly
        socket.emit("message-sent-success", newMessage);
      } catch (err) {
        console.error("Error sending DM:", err);
      }
    });


    socket.on("join-room", (interviewId) => {
      socket.join(interviewId);
      socket.data.interviewId = interviewId;

      const room = io.sockets.adapter.rooms.get(interviewId);

      const participantsCount = room ? room.size : 0;

      if (participantsCount === 2) {
        socket.to(interviewId).emit("user-joined");

        if (!roomTimers[interviewId]) {
          roomTimers[interviewId] = 3600;

          roomIntervals[interviewId] = setInterval(() => {
            roomTimers[interviewId]--;

            io.to(interviewId).emit("timer-update", roomTimers[interviewId]);

            if (roomTimers[interviewId] <= 0) {
              clearInterval(roomIntervals[interviewId]);

              delete roomIntervals[interviewId];
            }
          }, 1000);
        }
      }
    });

    socket.on("disconnect", () => {
      const interviewId = socket.data.interviewId;

      if (!interviewId) return;

      const room = io.sockets.adapter.rooms.get(interviewId);

      const participantsCount = room ? room.size : 0;

      socket.to(interviewId).emit("participant-disconnected");

      if (participantsCount === 0) {
        console.log(`Cleaning timer for room ${interviewId}`);

        clearInterval(roomIntervals[interviewId]);

        delete roomIntervals[interviewId];

        delete roomTimers[interviewId];
      }
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

    socket.on("send-message", ({ interviewId, message }) => {
      console.log("MESSAGE RECEIVED ON SERVER:", message);
      socket.to(interviewId).emit("receive-message", message);
    });

    socket.on("code-change", ({ interviewId, code }) => {
      socket.to(interviewId).emit("receive-code", code);
    });

    socket.on("output-change", ({ interviewId, output }) => {
      socket.to(interviewId).emit("receive-output", output);
    });

    socket.on("end-interview", (interviewId) => {
      socket.to(interviewId).emit("interview-ended");
    });

    socket.on("toggle-mute", ({ interviewId, isMuted }) => {
      socket.to(interviewId).emit("peer-toggled-mute", isMuted);
    });

    socket.on("toggle-camera", ({ interviewId, isCameraOff }) => {
      socket.to(interviewId).emit("peer-toggled-camera", isCameraOff);
    });

    socket.on("toggle-screen-share", ({ interviewId, isSharingScreen }) => {
      socket.to(interviewId).emit("peer-toggled-screen-share", isSharingScreen);
    });
  });
}
