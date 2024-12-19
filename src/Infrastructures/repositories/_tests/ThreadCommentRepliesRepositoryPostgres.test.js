const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/helpers/ThreadCommentRepliesTableTestHelper');
const ThreadCommentReplyEntity = require('../../../Domains/threadCommentReplies/entities/ThreadCommentReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../databases/postgres/pool');
const ThreadCommentRepliesRepositoryPostgres = require('../ThreadCommentRepliesRepositoryPostgres');

describe('A ThreadCommentRepliesRepositoryPostgres Interface Impl', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadCommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Negative Tests', () => {
    describe('A .checkExistenceById Method', () => {
      test('should throw an error when thread comment reply is not exist', async () => {
        // Arrange
        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(
          threadCommentRepliesRepositoryPostgres.checkExistenceById(
            'reply-not_found',
          ),
        ).rejects.toThrow(NotFoundError);

        await expect(
          threadCommentRepliesRepositoryPostgres.checkExistenceById(
            'reply-not_found',
          ),
        ).rejects.toThrow('thread comment reply is not found');
      });
    });

    describe('A .verifyOwner Method', () => {
      test('should throw an error when verifying an invalid thread comment reply owner id', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(
          threadCommentRepliesRepositoryPostgres.verifyOwner(
            'user-abc',
            'reply-1',
          ),
        ).rejects.toThrow(AuthorizationError);

        await expect(
          threadCommentRepliesRepositoryPostgres.verifyOwner(
            'user-abc',
            'reply-1',
          ),
        ).rejects.toThrow('thread comment reply owner is invalid');
      });
    });
  });

  describe('Positive Tests', () => {
    describe('An .add Method', () => {
      test('should persist a thread comment reply into a db table', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          ownerId: 'user-xyz',
          threadId: 'thread-1',
        });

        const mockedIdGen = {};

        mockedIdGen.generate = jest.fn(() => 'rpy1'.padEnd(21, 'z'));

        const mockedDate = {};

        mockedDate.now = jest.fn(() => new Date(2024, 11, 8, 14, 30, 15));

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: mockedIdGen,
            date: mockedDate,
          });

        // Action
        await threadCommentRepliesRepositoryPostgres.add(
          'user-xyz',
          'comment-1',
          {
            content: 'foobar reply',
          },
        );

        // Assert
        await expect(
          ThreadCommentRepliesTableTestHelper.getById(
            'reply-rpy1'.padEnd(27, 'z'),
          ),
        ).resolves.not.toBeUndefined();

        expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

        expect(mockedIdGen.generate).toHaveBeenCalledWith(21);

        expect(mockedDate.now).toHaveBeenCalledTimes(1);
      });

      test('should return an added thread comment reply object', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          ownerId: 'user-xyz',
          threadId: 'thread-1',
        });

        const mockedIdGen = {};

        mockedIdGen.generate = jest.fn(() => '1');

        const mockedDate = {};

        mockedDate.now = jest.fn(() => new Date(2024, 11, 8, 14, 30, 15));

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: mockedIdGen,
            date: mockedDate,
          });

        // Action
        const addedThdCmtRpy = await threadCommentRepliesRepositoryPostgres.add(
          'user-xyz',
          'comment-1',
          {
            content: 'foobar reply',
          },
        );

        // Assert
        expect(addedThdCmtRpy).toStrictEqual(
          new ThreadCommentReplyEntity({
            id: 'reply-1',
            content: 'foobar reply',
            date: new Date(2024, 11, 8, 14, 30, 15).toISOString(),
            isDelete: false,
            threadCommentId: 'comment-1',
            ownerId: 'user-xyz',
          }),
        );

        expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

        expect(mockedIdGen.generate).toHaveBeenCalledWith(21);

        expect(mockedDate.now).toHaveBeenCalledTimes(1);
      });
    });

    describe('A .getManyWithUsernameByThreadId Method', () => {
      test('should return an array of ascending sorted thread comment replies with its owner', async () => {
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

        await ThreadsTableTestHelper.add({
          id: 'thread-2',
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-abc',
        });

        await ThreadCommentsTableTestHelper.add({
          id: 'comment-2',
          threadId: 'thread-2',
          ownerId: 'user-abc',
        });

        await ThreadCommentRepliesTableTestHelper.add({
          content: 'Reply from foobar',
          date: new Date(2024, 11, 8, 11, 15, 30),
          threadCommentId: 'comment-1',
          ownerId: 'user-xyz',
        });

        await ThreadCommentRepliesTableTestHelper.add({
          id: 'reply-2',
          content: 'Reply from foobar',
          date: new Date(2024, 11, 8, 12, 15, 30),
          isDelete: true,
          threadCommentId: 'comment-2',
          ownerId: 'user-xyz',
        });

        await ThreadCommentRepliesTableTestHelper.add({
          id: 'reply-3',
          content: 'Reply from foobaz',
          date: new Date(2024, 11, 8, 13, 15, 30),
          isDelete: true,
          threadCommentId: 'comment-1',
          ownerId: 'user-abc',
        });

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action
        const threadCommentReplies =
          await threadCommentRepliesRepositoryPostgres.getManyWithUsernameByThreadId(
            'thread-1',
          );

        // Assert
        expect(threadCommentReplies).toStrictEqual([
          {
            id: 'reply-1',
            content: 'Reply from foobar',
            date: new Date(2024, 11, 8, 11, 15, 30).toISOString(),
            isDelete: false,
            replyCommentId: 'comment-1',
            username: 'foobar',
          },
          {
            id: 'reply-3',
            content: 'Reply from foobaz',
            date: new Date(2024, 11, 8, 13, 15, 30).toISOString(),
            isDelete: true,
            replyCommentId: 'comment-1',
            username: 'foobaz',
          },
        ]);
      });
    });

    describe('A .checkExistenceById Method', () => {
      test('should not throw an error when thread comment reply is exist', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        await ThreadCommentRepliesTableTestHelper.add({
          threadCommentId: 'comment-1',
          ownerId: 'user-xyz',
        });

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(
          threadCommentRepliesRepositoryPostgres.checkExistenceById('reply-1'),
        ).resolves.not.toThrow(NotFoundError);

        await expect(
          threadCommentRepliesRepositoryPostgres.checkExistenceById('reply-1'),
        ).resolves.not.toThrow('thread comment reply is not found');

        await expect(
          threadCommentRepliesRepositoryPostgres.checkExistenceById('reply-1'),
        ).resolves.toBeUndefined();
      });
    });

    describe('A .verifyOwner Method', () => {
      test('should not throw an error when verifying a valid thread comment reply owner id', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        await ThreadCommentRepliesTableTestHelper.add({
          threadCommentId: 'comment-1',
          ownerId: 'user-xyz',
        });

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action & Assert
        await expect(
          threadCommentRepliesRepositoryPostgres.verifyOwner(
            'user-xyz',
            'reply-1',
          ),
        ).resolves.not.toThrow(AuthorizationError);

        await expect(
          threadCommentRepliesRepositoryPostgres.verifyOwner(
            'user-xyz',
            'reply-1',
          ),
        ).resolves.not.toThrow('thread comment owner is invalid');

        await expect(
          threadCommentRepliesRepositoryPostgres.verifyOwner(
            'user-xyz',
            'reply-1',
          ),
        ).resolves.toBeUndefined();
      });
    });

    describe('A .deleteById Method', () => {
      test('should do a soft delete to a thread comment reply', async () => {
        // Arrange
        await UsersTableTestHelper.add({});

        await ThreadsTableTestHelper.add({
          ownerId: 'user-xyz',
        });

        await ThreadCommentsTableTestHelper.add({
          threadId: 'thread-1',
          ownerId: 'user-xyz',
        });

        await ThreadCommentRepliesTableTestHelper.add({
          threadCommentId: 'comment-1',
          ownerId: 'user-xyz',
        });

        const threadCommentRepliesRepositoryPostgres =
          new ThreadCommentRepliesRepositoryPostgres({
            pool,
            idGen: {},
            date: {},
          });

        // Action
        await threadCommentRepliesRepositoryPostgres.deleteById('reply-1');

        // Assert
        expect(
          (await ThreadCommentRepliesTableTestHelper.getById('reply-1'))
            .is_delete,
        ).toBe(true);
      });
    });
  });
});
