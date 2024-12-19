const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadEntity = require('../../../Domains/threads/entities/Thread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../databases/postgres/pool');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');

describe('A ThreadsRepositoryPostgres Interface Implementation', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Negative Tests', () => {
    describe('A .checkExistenceById Method', () => {
      test('should throw an error when thread is not found', async () => {
        // Arrange
        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: {},
          date: {},
        });

        // Action & Assert
        await expect(
          threadsRepositoryPostgres.checkExistenceById('thread-not_found'),
        ).rejects.toThrow(NotFoundError);

        await expect(
          threadsRepositoryPostgres.checkExistenceById('thread-not_found'),
        ).rejects.toThrow('thread is not found');
      });
    });

    describe('A .getById Method', () => {
      test('should throw an error when thread is not found', async () => {
        // Arrange
        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: {},
          date: {},
        });

        // Action & Assert
        await expect(
          threadsRepositoryPostgres.getById('thread-not_found'),
        ).rejects.toThrow(NotFoundError);

        await expect(
          threadsRepositoryPostgres.getById('thread-not_found'),
        ).rejects.toThrow('thread is not found');
      });
    });

    describe('A .getWithUsernameById Method', () => {
      test('should throw an error when thread is not found', async () => {
        // Arrange
        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: {},
          date: {},
        });

        // Action & Assert
        await expect(
          threadsRepositoryPostgres.getWithUsernameById('thread-not_found'),
        ).rejects.toThrow(NotFoundError);

        await expect(
          threadsRepositoryPostgres.getWithUsernameById('thread-not_found'),
        ).rejects.toThrow('thread is not found');
      });
    });
  });

  describe('Positive Tests', () => {
    describe('An .add Method', () => {
      test('should persist a thread into a db table', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        const mockedIdGen = {};

        mockedIdGen.generate = jest.fn(() => 'thd1'.padEnd(21, 'z'));

        const mockedDate = {};

        mockedDate.now = jest.fn(() => new Date(2024, 11, 8, 14, 30, 15));

        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: mockedIdGen,
          date: mockedDate,
        });

        // Action
        await threadsRepositoryPostgres.add('user-xyz', {
          title: 'Title Thread',
          body: 'Body thread',
        });

        // Assert
        await expect(
          ThreadsTableTestHelper.getById('thread-thd1'.padEnd(28, 'z')),
        ).resolves.not.toBeUndefined();

        expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

        expect(mockedIdGen.generate).toHaveBeenCalledWith(21);

        expect(mockedDate.now).toHaveBeenCalledTimes(1);
      });

      test('should return an added thread object', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        const mockedIdGen = {};

        mockedIdGen.generate = jest.fn(() => 'thd1'.padEnd(21, 'z'));

        const mockedDate = {};

        mockedDate.now = jest.fn(() => new Date(2024, 11, 8, 14, 30, 15));

        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: mockedIdGen,
          date: mockedDate,
        });

        // Action
        const addedThread = await threadsRepositoryPostgres.add('user-xyz', {
          title: 'Title Thread',
          body: 'Body thread',
        });

        // Assert
        expect(addedThread).toStrictEqual(
          new ThreadEntity({
            id: 'thread-thd1'.padEnd(28, 'z'),
            title: 'Title Thread',
            body: 'Body thread',
            date: new Date(2024, 11, 8, 14, 30, 15).toISOString(),
            ownerId: 'user-xyz',
          }),
        );

        expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

        expect(mockedIdGen.generate).toHaveBeenCalledWith(21);

        expect(mockedDate.now).toHaveBeenCalledTimes(1);
      });
    });

    describe('A .getById Method', () => {
      test('should return a thread when it is found', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          date: new Date(2024, 11, 8, 14, 30, 15),
          ownerId: 'user-xyz',
        });

        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: {},
          date: {},
        });

        // Action
        const thread = await threadsRepositoryPostgres.getById('thread-1');

        // Action & Assert
        expect(thread).toStrictEqual(
          new ThreadEntity({
            id: 'thread-1',
            title: 'Title Thread',
            body: 'Body thread',
            date: new Date(2024, 11, 8, 14, 30, 15).toISOString(),
            ownerId: 'user-xyz',
          }),
        );
      });
    });

    describe('A .getWithUsernameById Method', () => {
      test('should return a thread with its owner when it is found', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          date: new Date(2024, 11, 8, 14, 30, 15),
          ownerId: 'user-xyz',
        });

        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: {},
          date: {},
        });

        // Action
        const thread =
          await threadsRepositoryPostgres.getWithUsernameById('thread-1');

        // Action & Assert
        expect(thread).toStrictEqual({
          id: 'thread-1',
          title: 'Title Thread',
          body: 'Body thread',
          date: new Date(2024, 11, 8, 14, 30, 15).toISOString(),
          username: 'foobar',
        });
      });
    });

    describe('A .checkExistenceById Method', () => {
      test('should not throw an error when thread is exist', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        const threadsRepositoryPostgres = new ThreadsRepositoryPostgres({
          pool,
          idGen: {},
          date: {},
        });

        // Action & Assert
        await expect(
          threadsRepositoryPostgres.checkExistenceById('thread-1'),
        ).resolves.not.toThrow(NotFoundError);

        await expect(
          threadsRepositoryPostgres.checkExistenceById('thread-1'),
        ).resolves.not.toThrow('thread is not found');

        await expect(
          threadsRepositoryPostgres.checkExistenceById('thread-1'),
        ).resolves.toBeUndefined();
      });
    });
  });
});
