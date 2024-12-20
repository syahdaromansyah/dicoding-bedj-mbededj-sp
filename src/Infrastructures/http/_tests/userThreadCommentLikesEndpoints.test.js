const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const UserThreadCommentLikesTableTestHelper = require('../../../../tests/helpers/UserThreadCommentLikesTableTestHelper');
const IdGeneratorImpl = require('../../utilities/IdGeneratorImpl');
const pool = require('../../databases/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('A User Likes Thread Comment Endpoints', () => {
  afterEach(async () => {
    await UserThreadCommentLikesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('A User Likes Thread Comment Scenario', () => {
    describe('A 200 Response Code', () => {
      test('should persist it into a db table', async () => {
        // Arrange
        const server = await createServer(container);

        // > Mocking IdGenerator
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('usr1'.padEnd(30, 'z'))
          .mockReturnValue(1);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        // > User login
        const userLoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const userLoginResJson = JSON.parse(userLoginRes.payload);

        // > Creating a thread
        const addedThreadRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobaz Thread',
            body: 'foobaz thread',
          },
        });

        const addedThreadResJson = JSON.parse(addedThreadRes.payload);

        // Creating a thread comment
        const addedThdCmtRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThdCmtResJson = JSON.parse(addedThdCmtRes.payload);

        // Action
        await server.inject({
          method: 'PUT',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/${addedThdCmtResJson.data.addedComment.id}/likes`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
        });

        // Assert
        await expect(
          UserThreadCommentLikesTableTestHelper.getById('ucl-1'),
        ).resolves.not.toBeUndefined();

        await expect(
          UserThreadCommentLikesTableTestHelper.getByUserCommentId(
            'user-usr1'.padEnd(35, 'z'),
            'comment-1',
          ),
        ).resolves.not.toBeUndefined();

        expect(mockedIdGenerator).toHaveBeenCalledTimes(4);

        expect(mockedIdGenerator).toHaveBeenCalledWith(30);
        expect(mockedIdGenerator).toHaveBeenCalledWith(21);

        mockedIdGenerator.mockRestore();
      });

      test('should return an HTTP response body correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        // > User login
        const userLoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const userLoginResJson = JSON.parse(userLoginRes.payload);

        // > Creating a thread
        const addedThreadRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobaz Thread',
            body: 'foobaz thread',
          },
        });

        const addedThreadResJson = JSON.parse(addedThreadRes.payload);

        // Creating a thread comment
        const addedThdCmtRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThdCmtResJson = JSON.parse(addedThdCmtRes.payload);

        // Action
        const addedUserThdCmtLikeRes = await server.inject({
          method: 'PUT',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/${addedThdCmtResJson.data.addedComment.id}/likes`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(addedUserThdCmtLikeRes.statusCode).toBe(200);

        const addedUserThdCmtLikeResJson = JSON.parse(
          addedUserThdCmtLikeRes.payload,
        );

        expect(addedUserThdCmtLikeResJson.status).toBe('success');
      });
    });
  });

  describe('A User Cancel Likes Thread Comment Scenario', () => {
    describe('A 200 Response Code', () => {
      test('should delete it from a db table', async () => {
        // Arrange
        const server = await createServer(container);

        // > Mocking IdGenerator
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('usr1'.padEnd(30, 'z'))
          .mockReturnValue(1);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        // > User login
        const userLoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const userLoginResJson = JSON.parse(userLoginRes.payload);

        // > Creating a thread
        const addedThreadRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobaz Thread',
            body: 'foobaz thread',
          },
        });

        const addedThreadResJson = JSON.parse(addedThreadRes.payload);

        // Creating a thread comment
        const addedThdCmtRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThdCmtResJson = JSON.parse(addedThdCmtRes.payload);

        // > User is likes a thread comment
        await server.inject({
          method: 'PUT',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/${addedThdCmtResJson.data.addedComment.id}/likes`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
        });

        // Action
        await server.inject({
          method: 'PUT',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/${addedThdCmtResJson.data.addedComment.id}/likes`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
        });

        // Assert
        await expect(
          UserThreadCommentLikesTableTestHelper.getById('ucl-1'),
        ).resolves.toBeUndefined();

        await expect(
          UserThreadCommentLikesTableTestHelper.getByUserCommentId(
            'user-usr1'.padEnd(35, 'z'),
            'comment-1',
          ),
        ).resolves.toBeUndefined();

        expect(mockedIdGenerator).toHaveBeenCalledTimes(4);

        expect(mockedIdGenerator).toHaveBeenCalledWith(30);
        expect(mockedIdGenerator).toHaveBeenCalledWith(21);

        mockedIdGenerator.mockRestore();
      });

      test('should return an HTTP response body correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        // > User login
        const userLoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const userLoginResJson = JSON.parse(userLoginRes.payload);

        // > Creating a thread
        const addedThreadRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobaz Thread',
            body: 'foobaz thread',
          },
        });

        const addedThreadResJson = JSON.parse(addedThreadRes.payload);

        // Creating a thread comment
        const addedThdCmtRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThdCmtResJson = JSON.parse(addedThdCmtRes.payload);

        // > User is likes a thread comment
        await server.inject({
          method: 'PUT',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/${addedThdCmtResJson.data.addedComment.id}/likes`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
        });

        // Action
        const delUserThdCmtLikeRes = await server.inject({
          method: 'PUT',
          url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/${addedThdCmtResJson.data.addedComment.id}/likes`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delUserThdCmtLikeRes.statusCode).toBe(200);

        const delUserThdCmtLikeResJson = JSON.parse(
          delUserThdCmtLikeRes.payload,
        );

        expect(delUserThdCmtLikeResJson.status).toBe('success');
      });
    });
  });

  describe('A 404 Response Code', () => {
    test('should return an error response when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // > User registration
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'foobaz',
          password: 'foobazpass',
          fullname: 'Foo Baz',
        },
      });

      // > User login
      const userLoginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'foobaz',
          password: 'foobazpass',
        },
      });

      const userLoginResJson = JSON.parse(userLoginRes.payload);

      // Action
      const addedUserThdCmtLikeRes = await server.inject({
        method: 'PUT',
        url: `/threads/thread-not_found/comments/comment-not_found/likes`,
        headers: {
          authorization: `Bearer ${userLoginResJson.data.accessToken}`,
        },
      });

      // Assert
      expect(addedUserThdCmtLikeRes.statusCode).toBe(404);
    });

    test('should return an error response when thread comment is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // > User registration
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'foobaz',
          password: 'foobazpass',
          fullname: 'Foo Baz',
        },
      });

      // > User login
      const userLoginRes = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'foobaz',
          password: 'foobazpass',
        },
      });

      const userLoginResJson = JSON.parse(userLoginRes.payload);

      // > Creating a thread
      const addedThreadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          authorization: `Bearer ${userLoginResJson.data.accessToken}`,
        },
        payload: {
          title: 'foobaz Thread',
          body: 'foobaz thread',
        },
      });

      const addedThreadResJson = JSON.parse(addedThreadRes.payload);

      // Action
      const addedUserThdCmtLikeRes = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThreadResJson.data.addedThread.id}/comments/comment-not_found/likes`,
        headers: {
          authorization: `Bearer ${userLoginResJson.data.accessToken}`,
        },
      });

      // Assert
      expect(addedUserThdCmtLikeRes.statusCode).toBe(404);
    });
  });
});
