const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const Video = require("../models/Video");
const Channel = require("../models/Channel");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`)
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = q ? { $text: { $search: q } } : {};
  const sort = q ? 'views DESC' : 'createdAt DESC';
  const videos = await Video.find(filter, sort, 40);
  res.json(videos);
});

router.get("/trending", async (_, res) => {
  const videos = await Video.find({}, 'views DESC, createdAt DESC', 20);
  res.json(videos);
});

router.get("/:id", async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  if (!video) return res.status(404).json({ message: "Video not found" });
  res.json(video);
});

router.post("/:id/like", auth, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  const exists = video.likes.some(id => id.toString() === req.user.id.toString());
  await Video.updateLikes(req.params.id, req.user.id, !exists);
  res.json({ liked: !exists, likes: exists ? video.likes.length - 1 : video.likes.length + 1 });
});

router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Video file is required" });
    let channel = await Channel.findOne({ owner: req.user.id });
    if (!channel) channel = await Channel.create({ owner: req.user.id, name: `${req.user.name}'s Channel`, handle: `${req.user.name}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, "") });
    const video = await Video.create({
      owner: req.user.id, channel: channel._id,
      title: req.body.title || req.file.originalname,
      description: req.body.description || "",
      tags: (req.body.tags || "").split(",").map(s => s.trim()).filter(Boolean),
      videoUrl: `/uploads/${req.file.filename}`
    });
    res.status(201).json(video);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
