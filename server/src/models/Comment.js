const { sql, poolPromise } = require('../db');

module.exports = {
  find: async (filter = {}) => {
    const pool = await poolPromise;
    let query = `
      SELECT c.id as _id, c.videoId as video, c.authorId as 'user', c.text, c.createdAt,
      u.name as 'user_name', u.avatar as 'user_avatar'
      FROM Comments c
      JOIN Users u ON c.authorId = u.id
    `;
    let conditions = [];
    if (filter.video) conditions.push(`c.videoId = ${filter.video}`);
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    
    query += ` ORDER BY c.createdAt DESC`;
    
    const res = await pool.request().query(query);
    return res.recordset.map(row => {
      row.user = { _id: row.user, name: row.user_name, avatar: row.user_avatar };
      delete row.user_name; delete row.user_avatar;
      return row;
    });
  },
  create: async (data) => {
    const pool = await poolPromise;
    const res = await pool.request()
      .input('video', sql.Int, data.video)
      .input('author', sql.Int, data.user)
      .input('text', sql.NVarChar, data.text)
      .query(`
        INSERT INTO Comments (videoId, authorId, text)
        OUTPUT inserted.id as _id, inserted.videoId as video, inserted.authorId as 'user', inserted.text, inserted.createdAt
        VALUES (@video, @author, @text)
      `);
    const row = res.recordset[0];
    row.populate = async () => {
      const uRes = await pool.request().query(`SELECT name, avatar FROM Users WHERE id = ${row.user}`);
      if(uRes.recordset.length) {
         row.user = { _id: row.user, name: uRes.recordset[0].name, avatar: uRes.recordset[0].avatar };
      }
      return row;
    };
    return row;
  }
};
