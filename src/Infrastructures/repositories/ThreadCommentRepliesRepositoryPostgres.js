const ThreadCommentReplyEntity = require('../../Domains/threadCommentReplies/entities/ThreadCommentReply');
const ThreadCommentRepliesRepository = require('../../Domains/threadCommentReplies/ThreadCommentRepliesRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ThreadCommentRepliesRepositoryPostgres extends ThreadCommentRepliesRepository {
  constructor({ pool, idGen, date }) {
    super();

    this._pool = pool;
    this._idGen = idGen;
    this._date = date;
  }

  async add(ownerId, threadCommentId, payload) {
    const newId = `reply-${this._idGen.generate(21)}`;

    const createdDate = this._date.now();

    const queryResult = await this._pool.query(
      'INSERT INTO thread_comment_replies (id, content, date, thread_comment_id, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, payload.content, createdDate, threadCommentId, ownerId],
    );

    const addedThdCmtRpy = queryResult.rows[0];

    return new ThreadCommentReplyEntity({
      id: addedThdCmtRpy.id,
      content: addedThdCmtRpy.content,
      threadCommentId: addedThdCmtRpy.thread_comment_id,
      date: addedThdCmtRpy.date.toISOString(),
      isDelete: addedThdCmtRpy.is_delete,
      ownerId: addedThdCmtRpy.owner_id,
    });
  }

  async getManyWithUsernameByThreadId(threadId) {
    const queryResult = await this._pool.query(
      'SELECT tcr.id, tcr.content, tcr.date, tcr.is_delete, tcr.thread_comment_id, u.username FROM thread_comment_replies tcr INNER JOIN users u ON u.id = tcr.owner_id INNER JOIN thread_comments tc ON tc.id = tcr.thread_comment_id WHERE tc.thread_id = $1 ORDER BY tcr.date',
      [threadId],
    );

    const threadCommentReplies = queryResult.rows;

    return threadCommentReplies.map((tCR) => ({
      id: tCR.id,
      content: tCR.content,
      date: tCR.date.toISOString(),
      isDelete: tCR.is_delete,
      replyCommentId: tCR.thread_comment_id,
      username: tCR.username,
    }));
  }

  async checkExistenceById(id) {
    const queryResult = await this._pool.query(
      'SELECT id FROM thread_comment_replies WHERE id = $1',
      [id],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('thread comment reply is not found');
    }
  }

  async verifyOwner(ownerId, replyId) {
    const queryResult = await this._pool.query(
      'SELECT id FROM thread_comment_replies WHERE owner_id = $1 AND id = $2',
      [ownerId, replyId],
    );

    if (queryResult.rowCount === 0) {
      throw new AuthorizationError('thread comment reply owner is invalid');
    }
  }

  async deleteById(id) {
    await this._pool.query(
      'UPDATE thread_comment_replies SET is_delete = TRUE WHERE id = $1',
      [id],
    );
  }
}

module.exports = ThreadCommentRepliesRepositoryPostgres;
