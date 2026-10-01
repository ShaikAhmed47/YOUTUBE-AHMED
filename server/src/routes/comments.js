const router = require("express").Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

router.get("/:videoId", async (req, res) => {
  res.json(await Comment.find({ video: req.params.videoId }));
});

router.post("/:videoId", auth, async (req, res) => {
  if (!req.body.text?.trim()) return res.status(400).json({ message: "Comment text is required" });
  let comment = await Comment.create({ video: req.params.videoId, user: req.user.id, text: req.body.text.trim() });
  comment = await comment.populate();
  res.status(201).json(comment);
});

module.exports = router;
