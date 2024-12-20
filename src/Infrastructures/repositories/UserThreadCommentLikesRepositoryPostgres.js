const UserThreadCommentLikesRepository = require('../../Domains/userThreadCommentLikes/UserThreadCommentLikesRepository');

class UserThreadCommentLikesRepositoryPostgres extends UserThreadCommentLikesRepository {
  constructor(pool, idGen) {
    super();

    this._pool = pool;
    this._idGen = idGen;
  }

  async add(userId, commentId) {
    const newId = `ucl-${this._idGen.generate(21)}`;

    await this._pool.query(
      'INSERT INTO user_thread_comment_likes VALUES ($1, $2, $3)',
      [newId, userId, commentId],
    );
  }

  async getByThreadId(threadId) {
    const queryResult = await this._pool.query(
      'SELECT utcl.thread_comment_id FROM user_thread_comment_likes utcl INNER JOIN thread_comments tc ON tc.id = utcl.thread_comment_id WHERE tc.thread_id = $1',
      [threadId],
    );

    return queryResult.rows.map((r) => ({
      threadCommentId: r.thread_comment_id,
    }));
  }

  async isLiked(userId, commentId) {
    const queryResult = await this._pool.query(
      'SELECT * FROM user_thread_comment_likes WHERE user_id = $1 AND thread_comment_id = $2',
      [userId, commentId],
    );

    return queryResult.rowCount === 1;
  }

  async delete(userId, commentId) {
    await this._pool.query(
      'DELETE FROM user_thread_comment_likes WHERE user_id = $1 AND thread_comment_id = $2',
      [userId, commentId],
    );
  }
}

module.exports = UserThreadCommentLikesRepositoryPostgres;
