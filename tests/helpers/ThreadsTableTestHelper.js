const pool = require('../../src/Infrastructures/databases/postgres/pool');

const ThreadsTableTestHelper = {
  async add({
    id = 'thread-1',
    title = 'Title Thread',
    body = 'Body thread',
    date = new Date(),
    ownerId,
  }) {
    const queryResult = await pool.query(
      'INSERT INTO threads (id, title, body, date, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, title, body, date, ownerId],
    );

    return queryResult.rows[0];
  },
  async getById(id) {
    const queryResult = await pool.query(
      'SELECT * FROM threads WHERE id = $1',
      [id],
    );

    return queryResult.rows[0];
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1 = 1');
  },
};

module.exports = ThreadsTableTestHelper;
