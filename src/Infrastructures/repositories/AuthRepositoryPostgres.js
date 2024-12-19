const AuthRepository = require('../../Domains/auth/AuthRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class AuthRepositoryPostgres extends AuthRepository {
  constructor(pool) {
    super();

    this._pool = pool;
  }

  async addRefreshToken(refreshToken) {
    await this._pool.query('INSERT INTO auth VALUES($1)', [refreshToken]);
  }

  async deleteRefreshToken(refreshToken) {
    await this._pool.query('DELETE FROM auth WHERE token = $1', [refreshToken]);
  }

  async checkRefreshTokenExistence(refreshToken) {
    const queryResult = await this._pool.query(
      'SELECT token FROM auth WHERE token = $1',
      [refreshToken],
    );

    if (queryResult.rows.length === 0) {
      throw new NotFoundError('refresh token is not found');
    }
  }
}

module.exports = AuthRepositoryPostgres;
