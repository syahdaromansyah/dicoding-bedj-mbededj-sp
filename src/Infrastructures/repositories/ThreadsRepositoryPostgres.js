const ThreadEntity = require('../../Domains/threads/entities/Thread');
const ThreadsRepository = require('../../Domains/threads/ThreadsRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadsRepositoryPostgres extends ThreadsRepository {
  constructor({ pool, idGen, date }) {
    super();

    this._pool = pool;
    this._idGen = idGen;
    this._date = date;
  }

  async add(ownerId, payload) {
    const newId = `thread-${this._idGen.generate(21)}`;

    const createdDate = this._date.now();

    const { title, body } = payload;

    const queryResult = await this._pool.query(
      'INSERT INTO threads (id, title, body, date, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, title, body, createdDate, ownerId],
    );

    const addedThread = queryResult.rows[0];

    return new ThreadEntity({
      id: addedThread.id,
      title: addedThread.title,
      body: addedThread.body,
      date: addedThread.date.toISOString(),
      ownerId: addedThread.owner_id,
    });
  }

  async getById(id) {
    const queryResult = await this._pool.query(
      'SELECT * FROM threads WHERE id = $1',
      [id],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('thread is not found');
    }

    const thread = queryResult.rows[0];

    return new ThreadEntity({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date.toISOString(),
      ownerId: thread.owner_id,
    });
  }

  async getWithUsernameById(id) {
    const queryResult = await this._pool.query(
      'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t INNER JOIN users u ON u.id = t.owner_id WHERE t.id = $1',
      [id],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('thread is not found');
    }

    const thread = queryResult.rows[0];

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date.toISOString(),
      username: thread.username,
    };
  }

  async checkExistenceById(id) {
    const queryResult = await this._pool.query(
      'SELECT id FROM threads WHERE id = $1',
      [id],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('thread is not found');
    }
  }
}

module.exports = ThreadsRepositoryPostgres;
