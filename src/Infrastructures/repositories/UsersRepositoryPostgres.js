const UserEntity = require('../../Domains/users/entities/User');
const UsersRepository = require('../../Domains/users/UsersRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class UsersRepositoryPostgres extends UsersRepository {
  constructor(pool, idGen) {
    super();

    this._pool = pool;
    this._idGen = idGen;
  }

  async add({ username, password, fullname }) {
    const userId = `user-${this._idGen.generate(30)}`;

    const queryResult = await this._pool.query(
      'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING *',
      [userId, username, password, fullname],
    );

    return new UserEntity({
      ...queryResult.rows[0],
    });
  }

  async getById(id) {
    const queryResult = await this._pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('user is not found');
    }

    return new UserEntity({
      ...queryResult.rows[0],
    });
  }

  async getByUsername(username) {
    const queryResult = await this._pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );

    if (queryResult.rowCount === 0) {
      throw new NotFoundError('username is not found');
    }

    return new UserEntity({
      ...queryResult.rows[0],
    });
  }

  async verifyUsernameCanBeUsed(username) {
    const queryResult = await this._pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username],
    );

    if (queryResult.rowCount === 1) {
      throw new InvariantError('username tidak tersedia');
    }
  }
}

module.exports = UsersRepositoryPostgres;
