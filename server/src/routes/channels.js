const router = require("express").Router();
const Channel = require("../models/Channel");
const User = require("../models/User");
const Video = require("../models/Video");
const auth = require("../middleware/auth");

router.get("/", async (_, res) => res.json(await Channel.find())); // default find limits/sorts inside query

router.get("/:handle", async (req, res) => {
  const channel = await Channel.findOne({ handle: req.params.handle });
  if (!channel) return res.status(404).json({ message: "Channel not found" });
  const videos = await Video.find({ channel: channel._id }, 'createdAt DESC', 100);
  res.json({ channel, videos });
});

router.post("/", auth, async (req, res) => {
  const { name, handle, description } = req.body;
  if (!name || !handle) return res.status(400).json({ message: "Name and handle are required" });
  try {
    const channel = await Channel.create({ owner: req.user.id, name, handle: handle.replace(/^@/, ""), description });
    res.status(201).json(channel);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.post("/:id/subscribe", auth, async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  const user = await User.findById(req.user.id);
  if (!channel) return res.status(404).json({ message: "Channel not found" });
  const subscribed = user.subscribedChannels.some(id => id.toString() === channel._id.toString());
  
  await User.updateSubscribedChannels(user._id, channel._id, !subscribed);
  
  res.json({ subscribed: !subscribed, subscribers: subscribed ? channel.subscribers - 1 : channel.subscribers + 1 });
});

module.exports = router;
