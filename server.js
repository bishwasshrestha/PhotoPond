"use strict";

import express from "express";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

var corsOptions = {
  origin: "127.0.0.1:5500",
};

app.use(cors(corsOptions)); // To allow resources from different sources/outside domains
app.use(express.static("public"));
app.use(helmet()); // Protect your HTTP headers
app.use("/modules", express.static("node_modules"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/image", imageRoutes);
app.use("/auth", authRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
