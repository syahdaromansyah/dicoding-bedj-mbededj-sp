const ThreadCommentEntity = require('../../Domains/threadComments/entities/ThreadComment');
const ThreadCommentsRepository = require('../../Domains/threadComments/ThreadCommentsRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ThreadCommentsRepositoryPostgres extends ThreadCommentsRepository {
  constructor({ pool, idGen, date }) {
    super();

    this._pool = pool;
    this._idGen = idGen;
    this._date = date;
  }

  async add(ownerId, threadId, payload) {
    const newId = `comment-${this._idGen.generate(21)}`;

    const createdDate = this._date.now();

    const { content } = payload;

    const queryResult = await this._pool.query(
      'INSERT INTO thread_comments (id, content, date, thread_id, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, content, createdDate, threadId, ownerId],
    );

    const addedThreadComment = queryResult.rows[0];

    return new ThreadCommentEntity({
      id: addedThreadComment.id,
      content: addedThreadComment.content,
      threadId: addedThreadComment.thread_id,
      date: addedThreadComment.date.toISOString(),
      isDelete: addedThreadComment.is_delete,
      ownerId: addedThreadComment.owner_id,
    });
  }

  async getManyWithUsernameByThreadId(threadId) {
    const queryResult = await this._pool.query(
      'SELECT tc.id, tc.content, tc.date, tc.is_delete, u.username FROM thread_comments tc INNER JOIN users u ON u.id = tc.owner_id WHERE tc.thread_id = $1 ORDER BY tc.date',
      [threadId],
    );

    const threadComments = queryResult.rows;

    return threadComments.map((tC) => ({
      id: tC.id,
      content: tC.content,
      date: tC.date.toISOString(),
      isDelete: tC.is_delete,
      username: tC.username,
    }));
  }

  async checkExistenceById(id) {
    const queryResult = await this._pool.query(
      'SELECT id FROM thread_comments WHERE id = $1',
      [id],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('thread comment is not found');
    }
  }

  async verifyOwner(ownerId, commentId) {
    const queryResult = await this._pool.query(
      'SELECT id FROM thread_comments WHERE owner_id = $1 AND id = $2',
      [ownerId, commentId],
    );

    if (queryResult.rowCount === 0) {
      throw new AuthorizationError('thread comment owner is invalid');
    }
  }

  async deleteById(id) {
    await this._pool.query(
      'UPDATE thread_comments SET is_delete = TRUE WHERE id = $1',
      [id],
    );
  }
}

module.exports = ThreadCommentsRepositoryPostgres;
