const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const UserThreadCommentLikesTableTestHelper = require('../../../../tests/helpers/UserThreadCommentLikesTableTestHelper');
const pool = require('../../databases/postgres/pool');
const UserThreadCommentLikesRepositoryPostgres = require('../UserThreadCommentLikesRepositoryPostgres');

describe('A UserThreadCommentLikesRepositoryPostgres Interface Implementation', () => {
  afterEach(async () => {
    await UserThreadCommentLikesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('An .add Method', () => {
    test('should persist it into a db table', async () => {
      // Arrange
      await UsersTableTestHelper.add({});

      await ThreadsTableTestHelper.add({
        ownerId: 'user-xyz',
      });

      await ThreadCommentsTableTestHelper.add({
        threadId: 'thread-1',
        ownerId: 'user-xyz',
      });

      const mockedIdGen = {};

      mockedIdGen.generate = jest.fn(() => 'ucl1'.padEnd(21, 'z'));

      const userThdCmtLikesRepositoryImpl =
        new UserThreadCommentLikesRepositoryPostgres(pool, mockedIdGen);

      // Action
      await userThdCmtLikesRepositoryImpl.add('user-xyz', 'comment-1');

      // Assert
      await expect(
        UserThreadCommentLikesTableTestHelper.getById(
          'ucl-ucl1'.padEnd(25, 'z'),
        ),
      ).resolves.not.toBeUndefined();

      await expect(
        UserThreadCommentLikesTableTestHelper.getByUserCommentId(
          'user-xyz',
          'comment-1',
        ),
      ).resolves.not.toBeUndefined();

      expect(mockedIdGen.generate).toHaveBeenCalledTimes(1);

      expect(mockedIdGen.generate).toHaveBeenCalledWith(21);
    });
  });

  describe('A .getByThreadId Method', () => {
    test('should return an array of thread comments likes', async () => {
      // Arrange
      await UsersTableTestHelper.add({});

      await UsersTableTestHelper.add({
        id: 'user-abc',
        username: 'foobaz',
      });

      await ThreadsTableTestHelper.add({
        ownerId: 'user-xyz',
      });

      await ThreadCommentsTableTestHelper.add({
        threadId: 'thread-1',
        ownerId: 'user-xyz',
      });

      await ThreadCommentsTableTestHelper.add({
        id: 'comment-2',
        threadId: 'thread-1',
        ownerId: 'user-abc',
      });

      await UserThreadCommentLikesTableTestHelper.add({
        userId: 'user-abc',
        threadCommentId: 'comment-1',
      });

      await UserThreadCommentLikesTableTestHelper.add({
        id: 'ucl-2',
        userId: 'user-xyz',
        threadCommentId: 'comment-2',
      });

      await UserThreadCommentLikesTableTestHelper.add({
        id: 'ucl-3',
        userId: 'user-abc',
        threadCommentId: 'comment-2',
      });

      const userThdCmtLikesRepositoryImpl =
        new UserThreadCommentLikesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userThdCmtLikesRepositoryImpl.getByThreadId('thread-1'),
      ).resolves.toHaveLength(3);
    });
  });

  describe('An .isLiked Method', () => {
    test('should return false when a user is not already liked a comment', async () => {
      // Arrange
      await UsersTableTestHelper.add({});

      await ThreadsTableTestHelper.add({
        ownerId: 'user-xyz',
      });

      await ThreadCommentsTableTestHelper.add({
        threadId: 'thread-1',
        ownerId: 'user-xyz',
      });

      const userThdCmtLikesRepositoryImpl =
        new UserThreadCommentLikesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userThdCmtLikesRepositoryImpl.isLiked('user-xyz', 'comment-1'),
      ).resolves.toBe(false);
    });

    test('should return true when a user is liked a comment', async () => {
      // Arrange
      await UsersTableTestHelper.add({});

      await ThreadsTableTestHelper.add({
        ownerId: 'user-xyz',
      });

      await ThreadCommentsTableTestHelper.add({
        threadId: 'thread-1',
        ownerId: 'user-xyz',
      });

      await UserThreadCommentLikesTableTestHelper.add({
        userId: 'user-xyz',
        threadCommentId: 'comment-1',
      });

      const userThdCmtLikesRepositoryImpl =
        new UserThreadCommentLikesRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userThdCmtLikesRepositoryImpl.isLiked('user-xyz', 'comment-1'),
      ).resolves.toBe(true);
    });
  });

  describe('A .delete Method', () => {
    test('should delete a user comment like', async () => {
      // Arrange
      await UsersTableTestHelper.add({});

      await ThreadsTableTestHelper.add({
        ownerId: 'user-xyz',
      });

      await ThreadCommentsTableTestHelper.add({
        threadId: 'thread-1',
        ownerId: 'user-xyz',
      });

      await UserThreadCommentLikesTableTestHelper.add({
        userId: 'user-xyz',
        threadCommentId: 'comment-1',
      });

      const userThdCmtLikesRepositoryImpl =
        new UserThreadCommentLikesRepositoryPostgres(pool, {});

      // Action
      await userThdCmtLikesRepositoryImpl.delete('user-xyz', 'comment-1');

      // Assert
      await expect(
        UserThreadCommentLikesTableTestHelper.getById('ucl-1'),
      ).resolves.toBeUndefined();
    });
  });
});
