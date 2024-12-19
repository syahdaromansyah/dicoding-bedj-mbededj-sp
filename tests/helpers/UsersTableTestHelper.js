const pool = require('../../src/Infrastructures/databases/postgres/pool');

const UsersTableTestHelper = {
  async add({
    id = 'user-xyz',
    username = 'foobar',
    password = 'foobarpass',
    fullname = 'Foo Bar',
  }) {
    await pool.query('INSERT INTO users VALUES($1, $2, $3, $4)', [
      id,
      username,
      password,
      fullname,
    ]);
  },
  async getById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    return result.rows[0];
  },
  async getByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);

    return result.rows[0];
  },
  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1 = 1');
  },
};

module.exports = UsersTableTestHelper;
