const pool = require('../../src/Infrastructures/databases/postgres/pool');

const AuthTableTestHelper = {
  async addToken(token) {
    await pool.query('INSERT INTO auth VALUES($1)', [token]);
  },
  async getToken(token) {
    const queryResult = await pool.query(
      'SELECT token FROM auth WHERE token = $1',
      [token],
    );

    return queryResult.rows[0];
  },
  async cleanTable() {
    await pool.query('DELETE FROM auth WHERE 1 = 1');
  },
};

module.exports = AuthTableTestHelper;
