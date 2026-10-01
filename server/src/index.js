const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./db"); // initializes DB connection

const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videos");
const channelRoutes = require("./routes/channels");
const commentRoutes = require("./routes/comments");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "streamtube-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`API running on http://localhost:${port}`));
