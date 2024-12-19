const AuthTableTestHelper = require('../../../../tests/helpers/AuthTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../databases/postgres/pool');
const AuthRepositoryPostgres = require('../AuthRepositoryPostgres');

describe('An AuthRepositoryPostgres Repository Implementation', () => {
  afterEach(async () => {
    await AuthTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Negative Tests', () => {
    describe('A .checkRefreshTokenExistence Method', () => {
      test('should throw an error when a refresh token is not found', async () => {
        // Arrange
        const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

        // Action & Assert
        await expect(() =>
          authRepositoryPostgres.checkRefreshTokenExistence('refresh_token'),
        ).rejects.toThrow(NotFoundError);

        await expect(() =>
          authRepositoryPostgres.checkRefreshTokenExistence('refresh_token'),
        ).rejects.toThrow('refresh token is not found');
      });
    });
  });

  describe('Positive Tests', () => {
    describe('An .addRefreshToken Method', () => {
      test('should persist a refresh token to a database table', async () => {
        // Arrange
        const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

        // Action
        await authRepositoryPostgres.addRefreshToken('refresh_token');

        // Assert
        expect(
          (await AuthTableTestHelper.getToken('refresh_token')).token,
        ).toBe('refresh_token');
      });
    });

    describe('A .deleteRefreshToken Method', () => {
      test('should delete a refresh token from a database table', async () => {
        // Arrange
        await AuthTableTestHelper.addToken('refresh_token');

        const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

        // Action
        await authRepositoryPostgres.deleteRefreshToken('refresh_token');

        // Assert
        await expect(
          AuthTableTestHelper.getToken('refresh_token'),
        ).resolves.toBeUndefined();
      });
    });

    describe('A .checkRefreshTokenExistence Method', () => {
      test('should not throw an error when a refresh token is found', async () => {
        // Arrange
        await AuthTableTestHelper.addToken('refresh_token');

        const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

        // Action & Assert
        await expect(
          authRepositoryPostgres.checkRefreshTokenExistence('refresh_token'),
        ).resolves.not.toThrow(NotFoundError);

        await expect(
          authRepositoryPostgres.checkRefreshTokenExistence('refresh_token'),
        ).resolves.not.toThrow('refresh token is not found');

        await expect(
          authRepositoryPostgres.checkRefreshTokenExistence('refresh_token'),
        ).resolves.toBeUndefined();
      });
    });
  });
});
