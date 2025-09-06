import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Room join karna
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  // Offer bhejna
  socket.on("offer", (data) => {
    socket.to(data.room).emit("offer", { from: socket.id, sdp: data.sdp });
  });

  // Answer bhejna
  socket.on("answer", (data) => {
    socket.to(data.room).emit("answer", { from: socket.id, sdp: data.sdp });
  });

  // ICE Candidate bhejna
  socket.on("ice-candidate", (data) => {
    socket.to(data.room).emit("ice-candidate", { from: socket.id, candidate: data.candidate });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
