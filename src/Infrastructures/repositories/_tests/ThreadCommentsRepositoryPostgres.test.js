const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const ThreadCommentEntity = require('../../../Domains/threadComments/entities/ThreadComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../databases/postgres/pool');
const ThreadCommentsRepositoryPostgres = require('../ThreadCommentsRepositoryPostgres');

describe('A ThreadCommentsRepositoryPostgres Interface Implementation', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Negative Tests', () => {
    describe('A .checkExistenceById Method', () => {
      test('should throw an error when thread comment is not found', async () => {
        // Arrange
        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(() =>
          threadCommentsRepositoryPostgres.checkExistenceById(
            'comment-not_found',
          ),
        ).rejects.toThrow(NotFoundError);

        await expect(() =>
          threadCommentsRepositoryPostgres.checkExistenceById(
            'comment-not_found',
          ),
        ).rejects.toThrow('thread comment is not found');
      });
    });

    describe('A .verifyOwner Method', () => {
      test('should throw an error when thread comment owner is not valid', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-abc',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(() =>
          threadCommentsRepositoryPostgres.verifyOwner('user-abc', 'comment-1'),
        ).rejects.toThrow(AuthorizationError);

        await expect(() =>
          threadCommentsRepositoryPostgres.verifyOwner('user-abc', 'comment-1'),
        ).rejects.toThrow('thread comment owner is invalid');
      });
    });
  });

  describe('Positive Tests', () => {
    describe('An .add Method', () => {
      test('should persist a thread comment into a db table', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        const mockedIdGen = {};

        mockedIdGen.generate = jest.fn(() => 'cmt1'.padEnd(21, 'z'));

        const mockedDate = {};

        mockedDate.now = jest.fn(() => new Date(2024, 11, 8, 14, 30, 15));

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: mockedIdGen,
            date: mockedDate,
          });

        // Action & Assert
        await threadCommentsRepositoryPostgres.add('user-abc', 'thread-1', {
          content: 'foobaz comment',
        });

        await expect(
          ThreadCommentsTableTestHelper.getById('comment-cmt1'.padEnd(29, 'z')),
        ).resolves.not.toBeUndefined();

        expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

        expect(mockedIdGen.generate).toHaveBeenCalledWith(21);

        expect(mockedDate.now).toHaveBeenCalledTimes(1);
      });

      test('should return an added thread comment', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        const mockedIdGen = {};

        mockedIdGen.generate = jest.fn(() => 'cmt1'.padEnd(21, 'z'));

        const mockedDate = {};

        mockedDate.now = jest.fn(() => new Date(2024, 11, 8, 14, 30, 10));

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: mockedIdGen,
            date: mockedDate,
          });

        // Action
        const addedThdCmt = await threadCommentsRepositoryPostgres.add(
          'user-abc',
          'thread-1',
          {
            content: 'foobaz comment',
          },
        );

        // Assert
        expect(addedThdCmt).toStrictEqual(
          new ThreadCommentEntity({
            id: 'comment-cmt1'.padEnd(29, 'z'),
            content: 'foobaz comment',
            date: new Date(2024, 11, 8, 14, 30, 10).toISOString(),
            isDelete: false,
            threadId: 'thread-1',
            ownerId: 'user-abc',
          }),
        );

        expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

        expect(mockedIdGen.generate).toHaveBeenCalledWith(21);

        expect(mockedDate.now).toHaveBeenCalledTimes(1);
      });
    });

    describe('A .getManyWithUsernameByThreadId Method', () => {
      test('should return an array of ascending sorted thread comments with its owner', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
          fullname: 'Foo Baz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          content: 'foobaz first comment',
          date: new Date(2024, 11, 8, 10, 45, 25),
          threadId: 'thread-1',
          ownerId: 'user-abc',
        });

        await ThreadCommentsTableTestHelper.add({
          id: 'comment-2',
          content: 'foobaz second comment',
          date: new Date(2024, 11, 8, 13, 15, 10),
          isDelete: true,
          threadId: 'thread-1',
          ownerId: 'user-abc',
        });

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action
        const threadComments =
          await threadCommentsRepositoryPostgres.getManyWithUsernameByThreadId(
            'thread-1',
          );

        // Assert
        expect(threadComments).toStrictEqual([
          {
            id: 'comment-1',
            content: 'foobaz first comment',
            date: new Date(2024, 11, 8, 10, 45, 25).toISOString(),
            isDelete: false,
            username: 'foobaz',
          },
          {
            id: 'comment-2',
            content: 'foobaz second comment',
            date: new Date(2024, 11, 8, 13, 15, 10).toISOString(),
            isDelete: true,
            username: 'foobaz',
          },
        ]);
      });
    });

    describe('A .checkExistenceById Method', () => {
      test('should not throw an error when thread comment is exist', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-abc',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(
          threadCommentsRepositoryPostgres.checkExistenceById('comment-1'),
        ).resolves.not.toThrow(NotFoundError);

        await expect(
          threadCommentsRepositoryPostgres.checkExistenceById('comment-1'),
        ).resolves.not.toThrow('thread comment is not found');

        await expect(
          threadCommentsRepositoryPostgres.checkExistenceById('comment-1'),
        ).resolves.toBeUndefined();
      });
    });

    describe('A .verifyOwner Method', () => {
      test('should not throw an error when thread comment owner is valid', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-abc',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(
          threadCommentsRepositoryPostgres.verifyOwner('user-xyz', 'comment-1'),
        ).resolves.not.toThrow(AuthorizationError);

        await expect(
          threadCommentsRepositoryPostgres.verifyOwner('user-xyz', 'comment-1'),
        ).resolves.not.toThrow('thread comment owner is invalid');

        await expect(
          threadCommentsRepositoryPostgres.verifyOwner('user-xyz', 'comment-1'),
        ).resolves.toBeUndefined();
      });
    });

    describe('A .deleteById Method', () => {
      test('should soft delete a thread comment correctly', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await UsersTableTestHelper.add({
          id: 'user-abc',
          username: 'foobaz',
        });

        await ThreadsTableTestHelper.add({
          ownerId: 'user-abc',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        const threadCommentsRepositoryPostgres =
          new ThreadCommentsRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await threadCommentsRepositoryPostgres.deleteById('comment-1');

        expect(
          (await ThreadCommentsTableTestHelper.getById('comment-1')).is_delete,
        ).toBe(true);
      });
    });
  });
});
