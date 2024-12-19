const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/helpers/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/helpers/ThreadCommentsTableTestHelper');
const IdGeneratorImpl = require('../../utilities/IdGeneratorImpl');
const DatetimeImpl = require('../../utilities/DatetimeImpl');
const pool = require('../../databases/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('A Thread Endpoints', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('An Adding A Thread Scenario', () => {
    describe('A 201 Response Code', () => {
      test('should persist it into a db table', async () => {
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
        const addedThreadRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'A foobaz Thread',
            body: 'A foobaz thread',
          },
        });

        const addedThreadResJson = JSON.parse(addedThreadRes.payload);

        // Assert
        await expect(
          ThreadsTableTestHelper.getById(
            addedThreadResJson.data.addedThread.id,
          ),
        ).resolves.not.toBeUndefined();
      });

      test('should return an HTTP response correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > User registration
        const addedUserRes = await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        const addedUserResJson = JSON.parse(addedUserRes.payload);

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

        // > Mocking IdGenerator
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('111'.repeat(7));

        // Action
        const addedThreadRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${userLoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'A foobaz Thread',
            body: 'A foobaz thread',
          },
        });

        // Assert
        expect(addedThreadRes.statusCode).toBe(201);

        const addedThreadResJson = JSON.parse(addedThreadRes.payload);

        expect(addedThreadResJson.status).toBe('success');

        expect(addedThreadResJson.data.addedThread.id).toBe(
          `thread-${'111'.repeat(7)}`,
        );

        expect(addedThreadResJson.data.addedThread.title).toBe(
          'A foobaz Thread',
        );

        expect(addedThreadResJson.data.addedThread.owner).toBe(
          addedUserResJson.data.addedUser.id,
        );

        expect(mockedIdGenerator).toHaveBeenCalledTimes(1);

        mockedIdGenerator.mockRestore();
      });
    });

    describe('A 400 Response Code', () => {
      test.each([{ body: 'A foobaz thread' }, { title: 'A foobaz Thread' }])(
        'should throw an error when payload fields is incomplete',
        async (dummyPayload) => {
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
          const addedThreadRes = await server.inject({
            method: 'POST',
            url: '/threads',
            headers: {
              authorization: `Bearer ${userLoginResJson.data.accessToken}`,
            },
            payload: dummyPayload,
          });

          // Assert
          expect(addedThreadRes.statusCode).toBe(400);

          const addedThreadResJson = JSON.parse(addedThreadRes.payload);

          expect(addedThreadResJson.status).toBe('fail');

          expect(addedThreadResJson.message).toBe(
            'thread payload fields specification is invalid',
          );
        },
      );

      test.each([
        {
          title: 1,
          body: 'A foobaz thread',
        },
        {
          title: 'A foobaz Thread',
          body: 1,
        },
      ])(
        'should throw an error when payload fields data type is invalid',
        async (dummyPayload) => {
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
          const addedThreadRes = await server.inject({
            method: 'POST',
            url: '/threads',
            headers: {
              authorization: `Bearer ${userLoginResJson.data.accessToken}`,
            },
            payload: dummyPayload,
          });

          // Assert
          expect(addedThreadRes.statusCode).toBe(400);

          const addedThreadResJson = JSON.parse(addedThreadRes.payload);

          expect(addedThreadResJson.status).toBe('fail');

          expect(addedThreadResJson.message).toBe(
            'thread payload fields specification is invalid',
          );
        },
      );

      test.each([
        {
          title: '',
          body: 'A foobaz thread',
        },
        {
          title: 'A foobaz Thread',
          body: '',
        },
        {
          title: ' ',
          body: 'A foobaz thread',
        },
        {
          title: 'A foobaz Thread',
          body: ' ',
        },
      ])(
        'should throw an error when payload fields are empty string',
        async (dummyPayload) => {
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
          const addedThreadRes = await server.inject({
            method: 'POST',
            url: '/threads',
            headers: {
              authorization: `Bearer ${userLoginResJson.data.accessToken}`,
            },
            payload: dummyPayload,
          });

          // Assert
          expect(addedThreadRes.statusCode).toBe(400);

          const addedThreadResJson = JSON.parse(addedThreadRes.payload);

          expect(addedThreadResJson.status).toBe('fail');

          expect(addedThreadResJson.message).toBe(
            'thread payload fields specification is invalid',
          );
        },
      );
    });
  });

  describe('A Getting A Detail Thread Scenario', () => {
    describe('A 200 Response Code', () => {
      test('should return a detail thread', async () => {
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

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'voobaz',
            password: 'voobazpass',
            fullname: 'Voo Baz',
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

        const user4LoginRes = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'voobaz',
            password: 'voobazpass',
          },
        });

        const user4LoginResJson = JSON.parse(user4LoginRes.payload);

        // > Mocking IdGenerator and Datetime
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('thd1'.padEnd(21, 'z'))
          .mockReturnValueOnce('cmt1'.padEnd(21, 'z'))
          .mockReturnValueOnce('cmt2'.padEnd(21, 'z'))
          .mockReturnValueOnce('cmt3'.padEnd(21, 'z'))
          .mockReturnValueOnce('rpy1'.padEnd(21, 'z'))
          .mockReturnValueOnce('rpy2'.padEnd(21, 'z'))
          .mockReturnValueOnce('rpy3'.padEnd(21, 'z'))
          .mockReturnValueOnce('rpy4'.padEnd(21, 'z'));

        const mockedDatetime = jest
          .spyOn(DatetimeImpl.prototype, 'now')
          .mockReturnValueOnce(new Date(2024, 11, 8, 13, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 14, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 15, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 16, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 15, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 16, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 16, 30, 15))
          .mockReturnValueOnce(new Date(2024, 11, 8, 17, 30, 15));

        // > Creating a thread
        const addedThdRes = await server.inject({
          method: 'POST',
          url: '/threads',
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            title: 'A foobar Thread',
            body: 'A foobar thread',
          },
        });

        const addedThdResJson = JSON.parse(addedThdRes.payload);

        // > Creating thread comments
        const addedThdCmt1Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz comment',
          },
        });

        const addedThdCmt1ResJson = JSON.parse(addedThdCmt1Res.payload);

        const addedThdCmt2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'voobar comment',
          },
        });

        const addedThdCmt2ResJson = JSON.parse(addedThdCmt2Res.payload);

        const addedThdCmt3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments`,
          headers: {
            authorization: `Bearer ${user4LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'voobaz comment',
          },
        });

        const addedThdCmt3ResJson = JSON.parse(addedThdCmt3Res.payload);

        // > Creating thread comment replies
        await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt1ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user1LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobar reply',
          },
        });

        const addedThdCmtRpy2Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt1ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'voobar reply',
          },
        });

        const addedThdCmtRpy2ResJson = JSON.parse(addedThdCmtRpy2Res.payload);

        const addedThdCmtRpy3Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'foobaz reply',
          },
        });

        const addedThdCmtRpy3ResJson = JSON.parse(addedThdCmtRpy3Res.payload);

        const addedThdCmtRpy4Res = await server.inject({
          method: 'POST',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt2ResJson.data.addedComment.id}/replies`,
          headers: {
            authorization: `Bearer ${user4LoginResJson.data.accessToken}`,
          },
          payload: {
            content: 'voobaz reply',
          },
        });

        const addedThdCmtRpy4ResJson = JSON.parse(addedThdCmtRpy4Res.payload);

        // > Deleting a thread comment
        await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt3ResJson.data.addedComment.id}`,
          headers: {
            authorization: `Bearer ${user4LoginResJson.data.accessToken}`,
          },
        });

        // > Deleting thread comment replies
        await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt1ResJson.data.addedComment.id}/replies/${addedThdCmtRpy2ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user3LoginResJson.data.accessToken}`,
          },
        });

        await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt1ResJson.data.addedComment.id}/replies/${addedThdCmtRpy3ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user2LoginResJson.data.accessToken}`,
          },
        });

        await server.inject({
          method: 'DELETE',
          url: `/threads/${addedThdResJson.data.addedThread.id}/comments/${addedThdCmt1ResJson.data.addedComment.id}/replies/${addedThdCmtRpy4ResJson.data.addedReply.id}`,
          headers: {
            authorization: `Bearer ${user4LoginResJson.data.accessToken}`,
          },
        });

        // Action
        const detailThreadRes = await server.inject({
          method: 'GET',
          url: `/threads/${addedThdResJson.data.addedThread.id}`,
        });

        // Assert
        expect(detailThreadRes.statusCode).toBe(200);

        const detailThreadResJson = JSON.parse(detailThreadRes.payload);

        expect(detailThreadResJson.status).toBe('success');

        expect(detailThreadResJson.data.thread).toStrictEqual({
          id: 'thread-thd1'.padEnd(28, 'z'),
          title: 'A foobar Thread',
          body: 'A foobar thread',
          date: new Date(2024, 11, 8, 13, 30, 15).toISOString(),
          username: 'foobar',
          comments: [
            {
              id: 'comment-cmt1'.padEnd(29, 'z'),
              content: 'foobaz comment',
              date: new Date(2024, 11, 8, 14, 30, 15).toISOString(),
              username: 'foobaz',
              replies: [
                {
                  id: 'reply-rpy1'.padEnd(27, 'z'),
                  content: 'foobar reply',
                  date: new Date(2024, 11, 8, 15, 30, 15).toISOString(),
                  username: 'foobar',
                },
                {
                  id: 'reply-rpy2'.padEnd(27, 'z'),
                  content: '**balasan telah dihapus**',
                  date: new Date(2024, 11, 8, 16, 30, 15).toISOString(),
                  username: 'voobar',
                },
              ],
            },
            {
              id: 'comment-cmt2'.padEnd(29, 'z'),
              content: 'voobar comment',
              date: new Date(2024, 11, 8, 15, 30, 15).toISOString(),
              username: 'voobar',
              replies: [
                {
                  id: 'reply-rpy3'.padEnd(27, 'z'),
                  content: '**balasan telah dihapus**',
                  date: new Date(2024, 11, 8, 16, 30, 15).toISOString(),
                  username: 'foobaz',
                },
                {
                  id: 'reply-rpy4'.padEnd(27, 'z'),
                  content: '**balasan telah dihapus**',
                  date: new Date(2024, 11, 8, 17, 30, 15).toISOString(),
                  username: 'voobaz',
                },
              ],
            },
            {
              id: 'comment-cmt3'.padEnd(29, 'z'),
              content: '**komentar telah dihapus**',
              date: new Date(2024, 11, 8, 16, 30, 15).toISOString(),
              username: 'voobaz',
              replies: [],
            },
          ],
        });

        expect(mockedIdGenerator).toHaveBeenCalledTimes(8);

        expect(mockedIdGenerator).toHaveBeenCalledWith(21);

        expect(mockedDatetime).toHaveBeenCalledTimes(8);

        mockedDatetime.mockRestore();
        mockedIdGenerator.mockRestore();
      });
    });

    describe('A 404 Response Code', () => {
      test('should return a detail thread', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const detailThreadRes = await server.inject({
          method: 'GET',
          url: `/threads/thread-not_found`,
        });

        // Assert
        expect(detailThreadRes.statusCode).toBe(404);

        const detailThreadResJson = JSON.parse(detailThreadRes.payload);

        expect(detailThreadResJson.status).toBe('fail');
        expect(detailThreadResJson.message).toBe('thread is not found');
      });
    });
  });
});
