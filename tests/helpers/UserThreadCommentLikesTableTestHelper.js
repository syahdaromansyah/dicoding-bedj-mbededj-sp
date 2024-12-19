const pool = require('../../src/Infrastructures/databases/postgres/pool');

const UserThreadCommentLikesTableTestHelper = {
  async add({ id = 'ucl-1', userId, threadCommentId }) {
    const queryResult = await pool.query(
      'INSERT INTO user_thread_comment_likes (id, user_id, thread_comment_id) VALUES ($1, $2, $3) RETURNING *',
      [id, userId, threadCommentId],
    );

    return queryResult.rows[0];
  },
  async getById(id) {
    const queryResult = await pool.query(
      'SELECT * FROM user_thread_comment_likes WHERE id = $1',
      [id],
    );

    return queryResult.rows[0];
  },
  async getByUserCommentId(userId, commentId) {
    const queryResult = await pool.query(
      'SELECT * FROM user_thread_comment_likes WHERE user_id = $1 AND thread_comment_id = $2',
      [userId, commentId],
    );

    return queryResult.rows[0];
  },
  async cleanTable() {
    await pool.query('DELETE FROM user_thread_comment_likes WHERE 1 = 1');
  },
};

module.exports = UserThreadCommentLikesTableTestHelper;
