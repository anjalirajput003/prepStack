export default function socketHandler(io) {
const roomTimers = {};
const roomIntervals = {};

//socket connection listener
io.on("connection", (socket) => {

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
});
}
