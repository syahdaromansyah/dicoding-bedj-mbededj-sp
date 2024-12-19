const pool = require('../../src/Infrastructures/databases/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async add({
    id = 'reply-1',
    content = 'Reply content',
    date = new Date(),
    isDelete = false,
    threadCommentId,
    ownerId,
  }) {
    const queryResult = await pool.query(
      'INSERT INTO thread_comment_replies (id, content, date, is_delete, thread_comment_id, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, content, date, isDelete, threadCommentId, ownerId],
    );

    return queryResult.rows[0];
  },
  async getById(id) {
    const queryResult = await pool.query(
      'SELECT * FROM thread_comment_replies WHERE id = $1',
      [id],
    );

    return queryResult.rows[0];
  },
  async getManyByThreadCommentId(id) {
    const queryResult = await pool.query(
      'SELECT * FROM thread_comment_replies WHERE thread_comment_id = $1',
      [id],
    );

    return queryResult.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies WHERE 1 = 1');
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;
