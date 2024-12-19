const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const IdGeneratorImpl = require('../../utilities/IdGeneratorImpl');
const pool = require('../../databases/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('A Thread Comment Endpoints', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
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
        const addedThreadCommentRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThreadCommentResJson = JSON.parse(
          addedThreadCommentRes.payload,
        );

        // Assert
        await expect(
          ThreadCommentsTableTestHelper.getById(
            addedThreadCommentResJson.data.addedComment.id,
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

        const addedUser2Res = await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        const addedUser2ResJson = JSON.parse(addedUser2Res.payload);

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

        // > Mocking IdGenerator
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('cmt1'.padEnd(21, 'z'));

        // Action
        const addedThreadCommentRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        // Assert
        expect(addedThreadCommentRes.statusCode).toBe(201);

        const addedThreadCommentResJson = JSON.parse(
          addedThreadCommentRes.payload,
        );

        expect(addedThreadCommentResJson.status).toBe('success');

        expect(addedThreadCommentResJson.data.addedComment.id).toBe(
          'comment-cmt1'.padEnd(29, 'z'),
        );

        expect(addedThreadCommentResJson.data.addedComment.content).toBe(
          'foobaz comment',
        );

        expect(addedThreadCommentResJson.data.addedComment.owner).toBe(
          addedUser2ResJson.data.addedUser.id,
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

        const addedThreadU1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // Action
        const addedThreadCommentRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadU1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {},
        });

        // Assert
        expect(addedThreadCommentRes.statusCode).toBe(400);

        const addedThreadCommentResJson = JSON.parse(
          addedThreadCommentRes.payload,
        );

        expect(addedThreadCommentResJson.status).toBe('fail');

        expect(addedThreadCommentResJson.message).toBe(
          'thread comment payload fields specification is invalid',
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
        const addedThreadCommentRes = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 1,
          },
        });

        // Assert
        expect(addedThreadCommentRes.statusCode).toBe(400);

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentRes.payload,
        );

        expect(addedThreadCommentUser2ResJson.status).toBe('fail');

        expect(addedThreadCommentUser2ResJson.message).toBe(
          'thread comment payload fields specification is invalid',
        );
      });

      test.each(['', ' ', '  '])(
        'should throw an error when content field is empty string',
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

          // > User login
          const user1LoginResponse = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
              username: 'foobar',
              password: 'foobarpass',
            },
          });

          const user1LoginResJson = JSON.parse(user1LoginResponse.payload);

          const user2LoginRes = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
              username: 'foobaz',
              password: 'foobazpass',
            },
          });

          const user2LoginResJson = JSON.parse(user2LoginRes.payload);

          // > Adding a thread
          const addedThreadUser1Res = await server.inject({
            method: 'POST',
            url: '/threads',
            headers: {
              authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
            },
            payload: {
              title: 'Foo Bar Title Thread',
              body: 'Foo Bar Body Thread',
            },
          });

          const addedThreadUser1ResJson = JSON.parse(
            addedThreadUser1Res.payload,
          );

          // Action
          const addedThreadCommentRes = await server.inject({
            method: 'POST',
            url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
            headers: {
              authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
            },
            payload: {
              content: dummyContentFieldVal,
            },
          });

          // Assert
          expect(addedThreadCommentRes.statusCode).toBe(400);

          const addedThreadCommentResJson = JSON.parse(
            addedThreadCommentRes.payload,
          );

          expect(addedThreadCommentResJson.status).toBe('fail');

          expect(addedThreadCommentResJson.message).toBe(
            'thread comment payload fields specification is invalid',
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
        const addedThreadCommentRes = await server.inject({
          method: 'POST',
          url: `/threads/not-found/comments`,
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        // Assert
        expect(addedThreadCommentRes.statusCode).toBe(404);

        const addedThreadCommentResJson = JSON.parse(
          addedThreadCommentRes.payload,
        );

        expect(addedThreadCommentResJson.status).toBe('fail');
        expect(addedThreadCommentResJson.message).toBe('thread is not found');
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

        // > Creating a thread
        const addedThreadUser1Res = await server.inject({
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

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Creating a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        const delThreadCommentUser2Res = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThreadCommentUser2Res.statusCode).toBe(200);

        const delThreadCommentUser2ResJson = JSON.parse(
          delThreadCommentUser2Res.payload,
        );

        expect(delThreadCommentUser2ResJson.status).toBe('success');
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

        // > User login
        const user1LoginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const user1LoginResJson = JSON.parse(user1LoginResponse.payload);

        const user2LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
          },
        });

        const user2LoginResJson = JSON.parse(user2LoginRes.payload);

        // > Creating a thread
        const addedThreadUser1Res = await server.inject({
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

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Creating a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(
          (
            await ThreadCommentsTableTestHelper.getById(
              addedThreadCommentUser2ResJson.data.addedComment.id,
            )
          ).is_delete,
        ).toBe(true);
      });
    });

    describe('A 403 Response Code', () => {
      test('should return an error response for unauthorized a thread comment deletion', async () => {
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

        // > Creating a thread
        const addedThreadUser1Res = await server.inject({
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

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // > Creating a thread comment
        const addedThreadCommentUser2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment content',
          },
        });

        const addedThreadCommentUser2ResJson = JSON.parse(
          addedThreadCommentUser2Res.payload,
        );

        // Action
        const delThreadCommentUser2Res = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/${addedThreadCommentUser2ResJson.data.addedComment.id}`,
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThreadCommentUser2Res.statusCode).toBe(403);

        const delThreadCommentUser2ResJson = JSON.parse(
          delThreadCommentUser2Res.payload,
        );

        expect(delThreadCommentUser2ResJson.status).toBe('fail');

        expect(delThreadCommentUser2ResJson.message).toBe(
          'thread comment owner is invalid',
        );
      });
    });

    describe('A 404 Response Code', () => {
      test('should return an error response when thread id is not exist', async () => {
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

        // Action
        const delThreadCommentUser2Res = await server.inject({
          method: 'DELETE',
          url: `/threads/thread-not_found/comments/comment-1`,
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThreadCommentUser2Res.statusCode).toBe(404);

        const delThreadCommentUser2ResJson = JSON.parse(
          delThreadCommentUser2Res.payload,
        );

        expect(delThreadCommentUser2ResJson.status).toBe('fail');

        expect(delThreadCommentUser2ResJson.message).toBe(
          'thread is not found',
        );
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

        // > Creating a thread
        const addedThreadUser1Res = await server.inject({
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

        const addedThreadUser1ResJson = JSON.parse(addedThreadUser1Res.payload);

        // Action
        const delThreadCommentUser2Res = await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThreadUser1ResJson.data.addedThread.id}/comments/comment-not_found`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
        });

        // Assert
        expect(delThreadCommentUser2Res.statusCode).toBe(404);

        const delThreadCommentUser2ResJson = JSON.parse(
          delThreadCommentUser2Res.payload,
        );

        expect(delThreadCommentUser2ResJson.status).toBe('fail');

        expect(delThreadCommentUser2ResJson.message).toBe(
          'thread comment is not found',
        );
      });
    });
  });
});
