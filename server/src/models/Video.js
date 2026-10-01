const { sql, poolPromise } = require('../db');

module.exports = {
  find: async (filter = {}, sort = 'createdAt DESC', limit = 40) => {
    const pool = await poolPromise;
    let query = `
      SELECT v.id as _id, v.ownerId, v.channelId as channel, v.title, v.description, v.videoUrl, v.thumbnailUrl, v.duration, v.views, v.tags, v.createdAt,
      c.name as 'channel_name', c.handle as 'channel_handle', c.avatar as 'channel_avatar',
      (SELECT userId FROM VideoLikes WHERE videoId = v.id FOR JSON PATH) as likes
      FROM Videos v
      JOIN Channels c ON v.channelId = c.id
    `;
    let conditions = [];
    if (filter.channel) conditions.push(`v.channelId = ${filter.channel}`);
    if (filter.$text) {
      const q = filter.$text.$search.replace(/'/g, "''");
      conditions.push(`(v.title LIKE '%${q}%' OR v.description LIKE '%${q}%' OR v.tags LIKE '%${q}%')`);
    }
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    
    query += ` ORDER BY v.${sort} OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`;
    
    const res = await pool.request().query(query);
    return res.recordset.map(row => {
      row.channel = { _id: row.channel, name: row.channel_name, handle: row.channel_handle, avatar: row.channel_avatar };
      delete row.channel_name; delete row.channel_handle; delete row.channel_avatar;
      row.likes = row.likes ? JSON.parse(row.likes).map(x => x.userId) : [];
      return row;
    });
  },
  findById: async (id) => {
    const pool = await poolPromise;
    const query = `
      SELECT v.id as _id, v.ownerId, v.channelId as channel, v.title, v.description, v.videoUrl, v.thumbnailUrl, v.duration, v.views, v.tags, v.createdAt,
      c.name as 'channel_name', c.handle as 'channel_handle', c.avatar as 'channel_avatar',
      (SELECT COUNT(*) FROM Subscriptions WHERE channelId = c.id) as 'channel_subscribers',
      (SELECT userId FROM VideoLikes WHERE videoId = v.id FOR JSON PATH) as likes
      FROM Videos v
      JOIN Channels c ON v.channelId = c.id
      WHERE v.id = ${id}
    `;
    const res = await pool.request().query(query);
    if (!res.recordset.length) return null;
    const row = res.recordset[0];
    row.channel = { _id: row.channel, name: row.channel_name, handle: row.channel_handle, avatar: row.channel_avatar, subscribers: row.channel_subscribers };
    delete row.channel_name; delete row.channel_handle; delete row.channel_avatar; delete row.channel_subscribers;
    row.likes = row.likes ? JSON.parse(row.likes).map(x => x.userId) : [];
    return row;
  },
  findByIdAndUpdate: async (id, update) => {
    const pool = await poolPromise;
    if (update.$inc && update.$inc.views) {
      await pool.request().query(`UPDATE Videos SET views = views + ${update.$inc.views} WHERE id = ${id}`);
    }
    return await module.exports.findById(id);
  },
  updateLikes: async (videoId, userId, like) => {
    const pool = await poolPromise;
    if (like) {
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM VideoLikes WHERE videoId = ${videoId} AND userId = ${userId})
        INSERT INTO VideoLikes (videoId, userId) VALUES (${videoId}, ${userId})
      `);
    } else {
      await pool.request().query(`
        DELETE FROM VideoLikes WHERE videoId = ${videoId} AND userId = ${userId}
      `);
    }
  },
  create: async (data) => {
    const pool = await poolPromise;
    const res = await pool.request()
      .input('owner', sql.Int, data.owner)
      .input('channel', sql.Int, data.channel)
      .input('title', sql.NVarChar, data.title)
      .input('desc', sql.NVarChar, data.description || '')
      .input('tags', sql.NVarChar, data.tags ? data.tags.join(',') : '')
      .input('url', sql.NVarChar, data.videoUrl)
      .query(`
        INSERT INTO Videos (ownerId, channelId, title, description, tags, videoUrl)
        OUTPUT inserted.id as _id, inserted.ownerId, inserted.channelId, inserted.title, inserted.description, inserted.tags, inserted.videoUrl, inserted.createdAt, inserted.views, inserted.duration, inserted.thumbnailUrl
        VALUES (@owner, @channel, @title, @desc, @tags, @url)
      `);
    return res.recordset[0];
  }
};
