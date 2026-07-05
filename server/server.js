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
import notificatioRoutes from "./routes/notificationRoutes.js";

import socketHandler from "./sockets/socketHandler.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();



app.get("/", (req, res) => {
  res.send("PrepStack Backend Running");
});

const allowedOrigins = [
  "https://prep-stack-two.vercel.app",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(profileRoutes);
app.use(interviewRoutes);
app.use(reviewRoutes);
app.use(leaderboardRoutes);
app.use(codeExecutionRoutes);
app.use(messageRoutes);
app.use(notificatioRoutes);

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


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
