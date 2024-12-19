const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/helpers/ThreadCommentRepliesTableTestHelper');
const IdGeneratorImpl = require('../../utilities/IdGeneratorImpl');
const pool = require('../../databases/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('A Thread Comment Reply Endpoints', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadCommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('An Adding Scenario', () => {
    describe('A 201 Response Code', () => {
      test('should persist it into a db table', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Adding a thread
        const addedThreadUser1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Title Thread',
            body: 'foobar body thread',
          },
        });

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Adding a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        // Assert
        await expect(
          ThreadCommentRepliesTableTestHelper.getById(
            addedThdCmtRpyU3ResJson.data.addedReply.id,
          ),
        ).resolves.not.toBeUndefined();
      });

      test('should return an HTTP response correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        const addedUser3Res = await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        const addedUser3ResJson = JSON.parse(addedUser3Res.payload);

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Adding a thread
        const addedThreadUser1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Title Thread',
            body: 'foobar body thread',
          },
        });

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Adding a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // > Mocking IdGenerator
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('rpy1'.padEnd(21, 'z'));

        // Action
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'voobar reply',
          },
        });

        // Assert
        expect(addedThdCmtRpyU3Res.statusCode).toBe(201);

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        expect(addedThdCmtRpyU3ResJson.status).toBe('success');

        expect(addedThdCmtRpyU3ResJson.data.addedReply.id).toBe(
          'reply-rpy1'.padEnd(27, 'z'),
        );

        expect(addedThdCmtRpyU3ResJson.data.addedReply.content).toBe(
          'voobar reply',
        );

        expect(addedThdCmtRpyU3ResJson.data.addedReply.owner).toBe(
          addedUser3ResJson.data.addedUser.id,
        );

        expect(mockedIdGenerator).toHaveBeenCalledTimes(1);

        expect(mockedIdGenerator).toHaveBeenCalledWith(21);

        mockedIdGenerator.mockRestore();
      });
    });

    describe('A 400 Response Code', () => {
      test('should throw an error when content field is missing', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Adding a thread
        const addedThreadUser1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Title Thread',
            body: 'foobar body thread',
          },
        });

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Adding a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {},
        });

        // Assert
        expect(addedThdCmtRpyU3Res.statusCode).toBe(400);

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        expect(addedThdCmtRpyU3ResJson.status).toBe('fail');

        expect(addedThdCmtRpyU3ResJson.message).toBe(
          'thread comment reply payload fields specification is invalid',
        );
      });

      test('should throw an error when content field data type is invalid', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Adding a thread
        const addedThreadUser1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Title Thread',
            body: 'foobar body thread',
          },
        });

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Adding a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: null,
          },
        });

        // Assert
        expect(addedThdCmtRpyU3Res.statusCode).toBe(400);

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        expect(addedThdCmtRpyU3ResJson.status).toBe('fail');

        expect(addedThdCmtRpyU3ResJson.message).toBe(
          'thread comment reply payload fields specification is invalid',
        );
      });

      test.each(['', ' ', '  '])(
        'should throw an error when content field data type is invalid',
        async (dummyContentFieldVal) => {
          // Arrange
          const server = await createServer(container);

          // > User registration
          await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'foobar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            },
          });

          await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'foobaz',
              password: 'foobazpass',
              fullname: 'Foo Baz',
            },
          });

          await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'voobar',
              password: 'voobarpass',
              fullname: 'Voo Bar',
            },
          });

          // > User login
          const user1LoginRes = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
              username: 'foobar',
              password: 'foobarpass',
            },
          });

          const user1LoginResJson = JSON.parse(user1LoginRes.payload);

          const user2LoginRes = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
              username: 'foobaz',
              password: 'foobazpass',
            },
          });

          const user2LoginResJson = JSON.parse(user2LoginRes.payload);

          const user3LoginRes = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
              username: 'voobar',
              password: 'voobarpass',
            },
          });

          const user3LoginResJson = JSON.parse(user3LoginRes.payload);

          // > Adding a thread
          const addedThreadUser1Res = await server.inject({
            method: 'POST',
            url: '/threads',
            headers: {
              authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
            },
            payload: {
              title: 'foobar Title Thread',
              body: 'foobar body thread',
            },
          });

          const addedThreadUser1ResJson = JSON.parse(
            addedThreadUser1Res.payload,
          );

          // > Adding a thread comment
          const addedThreadCommentUser2Res = await server.inject({
            method: 'POST',
            url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
            headers: {
              authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
            },
            payload: {
              content: 'foobaz comment',
            },
          });

          const addedThreadCommentUser2ResJson = JSON.parse(
            addedThreadCommentUser2Res.payload,
          );

          // Action
          const addedThdCmtRpyU3Res = await server.inject({
            method: 'POST',
            url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}/replies`,
            headers: {
              authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
            },
            payload: {
              content: dummyContentFieldVal,
            },
          });

          // Assert
          expect(addedThdCmtRpyU3Res.statusCode).toBe(400);

          const addedThdCmtRpyU3ResJson = JSON.parse(
            addedThdCmtRpyU3Res.payload,
          );

          expect(addedThdCmtRpyU3ResJson.status).toBe('fail');

          expect(addedThdCmtRpyU3ResJson.message).toBe(
            'thread comment reply payload fields specification is invalid',
          );
        },
      );
    });

    describe('A 404 Response Code', () => {
      test('should return an error when thread id is not exist', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Adding a thread
        const addedThreadUser1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Title Thread',
            body: 'foobar body thread',
          },
        });

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Adding a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/thread-not_found/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        // Assert
        expect(addedThdCmtRpyU3Res.statusCode).toBe(404);

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        expect(addedThdCmtRpyU3ResJson.status).toBe('fail');

        expect(addedThdCmtRpyU3ResJson.message).toBe('thread is not found');
      });

      test('should return an error when thread comment id is not exist', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Adding a thread
        const addedThreadUser1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Title Thread',
            body: 'foobar body thread',
          },
        });

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // Action
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/comment-not_found/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        // Assert
        expect(addedThdCmtRpyU3Res.statusCode).toBe(404);

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        expect(addedThdCmtRpyU3ResJson.status).toBe('fail');

        expect(addedThdCmtRpyU3ResJson.message).toBe(
          'thread comment is not found',
        );
      });
    });
  });

  describe('A Delete Scenario', () => {
    describe('A 200 Response Code', () => {
      test('should return an HTTP response correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // >User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Creating a thread
        const addedThdU1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Thread',
            body: 'foobar thread body',
          },
        });

        const addedThdU1ResJson = JSON.parse(addedThdU1Res.payload);

        // > Creating a thread comment
        const addedThdCmtU2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThdCmtU2ResJson = JSON.parse(addedThdCmtU2Res.payload);

        // > Creating a thread comment reply
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        // Action
        const delThdCmtRpyU3Res = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies/${addedThdCmtRpyU3ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThdCmtRpyU3Res.statusCode).toBe(200);

        const delThdCmtRpyU3ResJson = JSON.parse(delThdCmtRpyU3Res.payload);

        expect(delThdCmtRpyU3ResJson.status).toBe('success');
      });

      test('should soft delete a thread comment correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Creating a thread
        const addedThdU1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Thread',
            body: 'foobar thread body',
          },
        });

        const addedThdU1ResJson = JSON.parse(addedThdU1Res.payload);

        // > Creating a thread comment
        const addedThdCmtU2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThdCmtU2ResJson = JSON.parse(addedThdCmtU2Res.payload);

        // > Creating a thread comment reply
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        // Action
        await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies/${addedThdCmtRpyU3ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(
          (
            await ThreadCommentRepliesTableTestHelper.getById(
              addedThdCmtRpyU3ResJson.data.addedReply.id,
            )
          ).is_delete,
        ).toBe(true);
      });
    });

    describe('A 403 Response Code', () => {
      test('should return an error response for unauthorized thread comment reply deletion', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Creating a thread
        const addedThdU1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Thread',
            body: 'foobar thread body',
          },
        });

        const addedThdU1ResJson = JSON.parse(addedThdU1Res.payload);

        // > Creating a thread comment
        const addedThdCmtU2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThdCmtU2ResJson = JSON.parse(addedThdCmtU2Res.payload);

        // > Creating a thread comment reply
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        // Action
        const delThdCmtRpyRes = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies/${addedThdCmtRpyU3ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThdCmtRpyRes.statusCode).toBe(403);

        const delThdCmtRpyResJson = JSON.parse(delThdCmtRpyRes.payload);

        expect(delThdCmtRpyResJson.status).toBe('fail');

        expect(delThdCmtRpyResJson.message).toBe(
          'thread comment reply owner is invalid',
        );
      });
    });

    describe('A 404 Response Code', () => {
      test('should return an error response when thread is not exist', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Creating a thread
        const addedThdU1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Thread',
            body: 'foobar thread body',
          },
        });

        const addedThdU1ResJson = JSON.parse(addedThdU1Res.payload);

        // > Creating a thread comment
        const addedThdCmtU2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThdCmtU2ResJson = JSON.parse(addedThdCmtU2Res.payload);

        // > Creating a thread comment reply
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        // Action
        const delThdCmtRpyU3Res = await server.inject({
          method: 'DELETE',
          url: `/threads/thread-not_found/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies/${addedThdCmtRpyU3ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThdCmtRpyU3Res.statusCode).toBe(404);

        const delThdCmtRpyU3ResJson = JSON.parse(delThdCmtRpyU3Res.payload);

        expect(delThdCmtRpyU3ResJson.status).toBe('fail');

        expect(delThdCmtRpyU3ResJson.message).toBe('thread is not found');
      });

      test('should return an error response when thread comment is not exist', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Creating a thread
        const addedThdU1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Thread',
            body: 'foobar thread body',
          },
        });

        const addedThdU1ResJson = JSON.parse(addedThdU1Res.payload);

        // > Creating a thread comment
        const addedThdCmtU2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThdCmtU2ResJson = JSON.parse(addedThdCmtU2Res.payload);

        // > Creating a thread comment reply
        const addedThdCmtRpyU3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'Reply from voobar',
          },
        });

        const addedThdCmtRpyU3ResJson = JSON.parse(addedThdCmtRpyU3Res.payload);

        // Action
        const delThdCmtRpyU3Res = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/comment-not_found/replies/${addedThdCmtRpyU3ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThdCmtRpyU3Res.statusCode).toBe(404);

        const delThdCmtRpyU3ResJson = JSON.parse(delThdCmtRpyU3Res.payload);

        expect(delThdCmtRpyU3ResJson.status).toBe('fail');

        expect(delThdCmtRpyU3ResJson.message).toBe(
          'thread comment is not found',
        );
      });

      test('should return an error response when thread comment reply is not exist', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
            fullname: 'Voo Bar',
          },
        });

        // > User login
        const user1LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginRes.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        const user3LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobar',
            password: 'voobarpass',
          },
        });

        const user3LoginResJson = JSON.parse(user3LoginRes.payload);

        // > Creating a thread
        const addedThdU1Res = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'foobar Thread',
            body: 'foobar thread body',
          },
        });

        const addedThdU1ResJson = JSON.parse(addedThdU1Res.payload);

        // > Creating a thread comment
        const addedThdCmtU2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThdCmtU2ResJson = JSON.parse(addedThdCmtU2Res.payload);

        // Action
        const delThdCmtRpyU3Res = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdU1ResJson.data.addedThread.id}/comments/${addedThdCmtU2ResJson.data.addedComment.id}/replies/$reply-not_found`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThdCmtRpyU3Res.statusCode).toBe(404);

        const delThdCmtRpyU3ResJson = JSON.parse(delThdCmtRpyU3Res.payload);

        expect(delThdCmtRpyU3ResJson.status).toBe('fail');

        expect(delThdCmtRpyU3ResJson.message).toBe(
          'thread comment reply is not found',
        );
      });
    });
  });
});
