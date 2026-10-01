require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sql, poolPromise } = require("./db");
const User = require("./models/User");
const Channel = require("./models/Channel");
const Video = require("./models/Video");

(async () => {
  const pool = await poolPromise;
  // Clear tables
  await pool.request().query(`
    DELETE FROM Comments;
    DELETE FROM VideoLikes;
    DELETE FROM Subscriptions;
    DELETE FROM Videos;
    DELETE FROM Channels;
    DELETE FROM Users;
  `);

  const passwordHash = await bcrypt.hash("Demo@123", 12);
  const user = await User.create({ name: "StreamTube Demo", email: "demo@streamtube.dev", passwordHash });
  const channel = await Channel.create({ owner: user._id, name: "StreamTube Demo", handle: "streamtube-demo", description: "Demo creator channel" });
  
  await Video.create({ owner: user._id, channel: channel._id, title: "Welcome to StreamTube", description: "A demo video for the platform.", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", tags: ["welcome", "demo"] });
  await Video.create({ owner: user._id, channel: channel._id, title: "Modern Full Stack Development", description: "Building web applications with React, Node and MSSQL.", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", tags: ["react", "node", "mssql"] });
  
  // Set some fake views
  await pool.request().query(`UPDATE Videos SET views = 12500 WHERE title = 'Welcome to StreamTube'`);
  await pool.request().query(`UPDATE Videos SET views = 8300 WHERE title = 'Modern Full Stack Development'`);

  console.log("Seed complete. demo@streamtube.dev / Demo@123");
  process.exit(0);
})();
