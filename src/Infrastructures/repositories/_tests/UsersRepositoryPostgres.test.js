const UserRegistrationEntity = require('../../../Domains/users/entities/UserRegistration');
const UserEntity = require('../../../Domains/users/entities/User');
const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../databases/postgres/pool');
const UsersRepositoryPostgres = require('../UsersRepositoryPostgres');

describe('A UsersRepositoryPostgres Repository Implementation', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('An .add Method', () => {
    test('should persist a new user to a db table', async () => {
      // Arrange
      const mockedIdGen = {};

      mockedIdGen.generate = jest.fn(() => 'usr1'.padEnd(30, 'z'));

      const usersRepositoryPostgres = new UsersRepositoryPostgres(
        pool,
        mockedIdGen,
      );

      // Action
      await usersRepositoryPostgres.add(
        new UserRegistrationEntity({
          username: 'foobar',
          password: 'enc_foobarpwd',
          fullname: 'Foo Bar',
        }),
      );

      // Assert
      await expect(
        UsersTableTestHelper.getById('user-usr1'.padEnd(35, 'z')),
      ).resolves.not.toBeUndefined();

      expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

      expect(mockedIdGen.generate).toHaveBeenCalledWith(30);
    });

    test('should return an added user object', async () => {
      // Arrange
      const mockedIdGen = {};

      mockedIdGen.generate = jest.fn(() => 'usr1'.padEnd(30, 'z'));

      const usersRepositoryPostgres = new UsersRepositoryPostgres(
        pool,
        mockedIdGen,
      );

      // Action & Assert
      await expect(
        usersRepositoryPostgres.add(
          new UserRegistrationEntity({
            username: 'foobar',
            password: 'enc_foobarpwd',
            fullname: 'Foo Bar',
          }),
        ),
      ).resolves.toStrictEqual(
        new UserEntity({
          id: 'user-usr1'.padEnd(35, 'z'),
          username: 'foobar',
          password: 'enc_foobarpwd',
          fullname: 'Foo Bar',
        }),
      );

      expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

      expect(mockedIdGen.generate).toHaveBeenCalledWith(30);
    });
  });

  describe('A .getById Method', () => {
    test('should throw an error when user id is not found', async () => {
      // Arrange
      const usersRepositoryPostgres = new UsersRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(() =>
        usersRepositoryPostgres.getById('user-xyz'),
      ).rejects.toThrow(NotFoundError);

      await expect(() =>
        usersRepositoryPostgres.getById('user-xyz'),
      ).rejects.toThrow('user is not found');
    });

    test('should return a user when it is found', async () => {
      // Arrange
      await UsersTableTestHelper.add({
        id: `user-${'xyz'.repeat(10)}`,
        username: 'foobar',
        password: 'enc_foobarpwd',
        fullname: 'Foo Bar',
      });

      const usersRepositoryPostgres = new UsersRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        usersRepositoryPostgres.getById(`user-${'xyz'.repeat(10)}`),
      ).resolves.toStrictEqual(
        new UserEntity({
          id: `user-${'xyz'.repeat(10)}`,
          username: 'foobar',
          password: 'enc_foobarpwd',
          fullname: 'Foo Bar',
        }),
      );
    });
  });

  describe('A .getByUsername Method', () => {
    test('should throw an error when user username is not found', async () => {
      // Arrange
      const usersRepositoryPostgres = new UsersRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(() =>
        usersRepositoryPostgres.getByUsername('foobaz'),
      ).rejects.toThrow(NotFoundError);

      await expect(() =>
        usersRepositoryPostgres.getByUsername('foobaz'),
      ).rejects.toThrow('username is not found');
    });

    test('should return a user when it is found', async () => {
      // Arrange
      await UsersTableTestHelper.add({
        id: `user-${'xyz'.repeat(10)}`,
        username: 'foobar',
        password: 'enc_foobarpwd',
        fullname: 'Foo Bar',
      });

      const usersRepositoryPostgres = new UsersRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        usersRepositoryPostgres.getByUsername('foobar'),
      ).resolves.toStrictEqual(
        new UserEntity({
          id: `user-${'xyz'.repeat(10)}`,
          username: 'foobar',
          password: 'enc_foobarpwd',
          fullname: 'Foo Bar',
        }),
      );
    });
  });

  describe('A .verifyUsernameCanBeUsed Method', () => {
    test('should throw an error when username has been used', async () => {
      // Arrange
      await UsersTableTestHelper.add({
        id: `user-${'xyz'.repeat(10)}`,
        username: 'foobar',
        password: 'enc_foobarpwd',
        fullname: 'Foo Bar',
      });

      const usersRepositoryPostgres = new UsersRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        usersRepositoryPostgres.verifyUsernameCanBeUsed('foobar'),
      ).rejects.toThrow(InvariantError);

      await expect(
        usersRepositoryPostgres.verifyUsernameCanBeUsed('foobar'),
      ).rejects.toThrow('username tidak tersedia');
    });

    test('should not throw error when username is not used', async () => {
      // Arrange
      const usersRepositoryPostgres = new UsersRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        usersRepositoryPostgres.verifyUsernameCanBeUsed('foobaz'),
      ).resolves.not.toThrow(InvariantError);

      await expect(
        usersRepositoryPostgres.verifyUsernameCanBeUsed('foobaz'),
      ).resolves.not.toThrow('username tidak tersedia');

      await expect(
        usersRepositoryPostgres.verifyUsernameCanBeUsed('foobaz'),
      ).resolves.toBeUndefined();
    });
  });
});
