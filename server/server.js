import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import http from "http";
import { Server } from "socket.io";

import startInactivityChecker from "./jobs/inactivityChecker.js";
import updateLastActive from "./utils/updateLastActive.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import codeExecutionRoutes from "./routes/codeExecutionRoutes.js";

import socketHandler from "./sockets/socketHandler.js";

dotenv.config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(profileRoutes);
app.use(interviewRoutes);
app.use(reviewRoutes);
app.use(leaderboardRoutes);
app.use(codeExecutionRoutes);

//database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MONGODB CONNECTED");

    startInactivityChecker();
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

//http server using express app
const server = http.createServer(app);

//socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
