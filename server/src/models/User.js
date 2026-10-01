const { sql, poolPromise } = require('../db');

module.exports = {
  find: async (filter = {}) => {
    const pool = await poolPromise;
    let query = `
      SELECT u.id as _id, u.name, u.email, u.passwordHash, u.avatar,
      (SELECT channelId FROM Subscriptions WHERE userId = u.id FOR JSON PATH) as subscribedChannels
      FROM Users u
    `;
    let conditions = [];
    if (filter.email) conditions.push(`u.email = '${filter.email.replace(/'/g, "''")}'`);
    if (filter._id) conditions.push(`u.id = ${filter._id}`);
    
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    
    const res = await pool.request().query(query);
    return res.recordset.map(row => {
      row.subscribedChannels = row.subscribedChannels ? JSON.parse(row.subscribedChannels).map(x => x.channelId) : [];
      return row;
    });
  },
  findOne: async (filter) => {
    const rows = await module.exports.find(filter);
    return rows[0] || null;
  },
  findById: async (id) => {
    return await module.exports.findOne({ _id: id });
  },
  create: async (data) => {
    const pool = await poolPromise;
    const res = await pool.request()
      .input('name', sql.NVarChar, data.name)
      .input('email', sql.NVarChar, data.email)
      .input('passwordHash', sql.NVarChar, data.passwordHash)
      .query(`
        INSERT INTO Users (name, email, passwordHash)
        OUTPUT inserted.id as _id, inserted.name, inserted.email, inserted.passwordHash, inserted.avatar
        VALUES (@name, @email, @passwordHash)
      `);
    const user = res.recordset[0];
    user.subscribedChannels = [];
    return user;
  },
  updateSubscribedChannels: async (userId, channelId, subscribe) => {
    const pool = await poolPromise;
    if (subscribe) {
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM Subscriptions WHERE userId = ${userId} AND channelId = ${channelId})
        INSERT INTO Subscriptions (userId, channelId) VALUES (${userId}, ${channelId})
      `);
    } else {
      await pool.request().query(`
        DELETE FROM Subscriptions WHERE userId = ${userId} AND channelId = ${channelId}
      `);
    }
  }
};
