const pool = require('../../src/Infrastructures/databases/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async add({
    id = 'comment-1',
    content = 'Comment content',
    date = new Date(),
    isDelete = false,
    threadId,
    ownerId,
  }) {
    const queryResult = await pool.query(
      'INSERT INTO thread_comments (id, content, date, thread_id, is_delete, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, content, date, threadId, isDelete, ownerId],
    );

    return queryResult.rows[0];
  },
  async getById(id) {
    const queryResult = await pool.query(
      'SELECT * FROM thread_comments WHERE id = $1',
      [id],
    );

    return queryResult.rows[0];
  },
  async getManyByThreadId(id) {
    const queryResult = await pool.query(
      'SELECT * FROM thread_comments WHERE thread_id = $1',
      [id],
    );

    return queryResult.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1 = 1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
