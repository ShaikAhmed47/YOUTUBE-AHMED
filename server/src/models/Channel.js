const { sql, poolPromise } = require('../db');

module.exports = {
  find: async () => {
    const pool = await poolPromise;
    const query = `
      SELECT id as _id, ownerId, name, handle, description, avatar, banner,
      (SELECT COUNT(*) FROM Subscriptions WHERE channelId = Channels.id) as subscribers
      FROM Channels
      ORDER BY subscribers DESC
    `;
    const res = await pool.request().query(query);
    return res.recordset;
  },
  findOne: async (filter) => {
    const pool = await poolPromise;
    let query = `
      SELECT c.id as _id, c.ownerId, c.name, c.handle, c.description, c.avatar, c.banner,
      (SELECT COUNT(*) FROM Subscriptions WHERE channelId = c.id) as subscribers,
      u.id as 'owner._id', u.name as 'owner.name', u.email as 'owner.email'
      FROM Channels c
      JOIN Users u ON c.ownerId = u.id
    `;
    let conditions = [];
    if (filter.handle) conditions.push(`c.handle = '${filter.handle.replace(/'/g, "''")}'`);
    if (filter.owner) conditions.push(`c.ownerId = ${filter.owner}`);
    
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    
    const res = await pool.request().query(query);
    if (!res.recordset.length) return null;
    const row = res.recordset[0];
    row.owner = { _id: row['owner._id'], name: row['owner.name'], email: row['owner.email'] };
    delete row['owner._id']; delete row['owner.name']; delete row['owner.email'];
    row.populate = () => Promise.resolve(row);
    return row;
  },
  findById: async (id) => {
    const pool = await poolPromise;
    const query = `
      SELECT id as _id, ownerId, name, handle, description, avatar, banner,
      (SELECT COUNT(*) FROM Subscriptions WHERE channelId = Channels.id) as subscribers
      FROM Channels
      WHERE id = ${id}
    `;
    const res = await pool.request().query(query);
    return res.recordset[0] || null;
  },
  create: async (data) => {
    const pool = await poolPromise;
    const res = await pool.request()
      .input('owner', sql.Int, data.owner)
      .input('name', sql.NVarChar, data.name)
      .input('handle', sql.NVarChar, data.handle)
      .input('desc', sql.NVarChar, data.description || '')
      .query(`
        INSERT INTO Channels (ownerId, name, handle, description)
        OUTPUT inserted.id as _id, inserted.ownerId, inserted.name, inserted.handle, inserted.description
        VALUES (@owner, @name, @handle, @desc)
      `);
    return res.recordset[0];
  }
};
