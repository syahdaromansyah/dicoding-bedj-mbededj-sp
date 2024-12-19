const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const IdGeneratorImpl = require('../../utilities/IdGeneratorImpl');
const pool = require('../../databases/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('A Users Endpoints', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('An Adding User Scenario', () => {
    describe('A 201 Response Code', () => {
      test('should persist it into a db table', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);

        await expect(
          UsersTableTestHelper.getById(responseJson.data.addedUser.id),
        ).resolves.not.toBeUndefined();
      });

      test('should return an HTTP response correctly', async () => {
        // Arrange
        const server = await createServer(container);

        // > Mocking IdGenerator
        const mockedIdGenerator = jest
          .spyOn(IdGeneratorImpl.prototype, 'generate')
          .mockReturnValueOnce('usr1'.padEnd(30, 'z'));

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobaz',
            password: 'foobazpass',
            fullname: 'Foo Baz',
          },
        });

        // Assert
        expect(response.statusCode).toBe(201);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('success');

        expect(responseJson.data.addedUser.id).toBe(
          'user-usr1'.padEnd(35, 'z'),
        );

        expect(responseJson.data.addedUser.username).toBe('foobaz');
        expect(responseJson.data.addedUser.fullname).toBe('Foo Baz');

        expect(mockedIdGenerator).toHaveBeenCalledTimes(1);

        expect(mockedIdGenerator).toHaveBeenCalledWith(30);

        mockedIdGenerator.mockRestore();
      });
    });

    describe('A 400 Response Code', () => {
      test.each([
        {
          password: 'foobarpass',
          fullname: 'Foo Bar',
        },
        {
          username: 'foobar',
          fullname: 'Foo Bar',
        },
        {
          username: 'foobar',
          password: 'foobarpass',
        },
      ])(
        'should return error response when payload fields are incomplete',
        async (dummyReqPayload) => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: dummyReqPayload,
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'user registration payload fields specification is invalid',
          );
        },
      );

      test.each(['username', 'password', 'fullname'])(
        'should return error response when payload fields data type are invalid',
        async (payloadFieldKey) => {
          // Arrange
          const server = await createServer(container);

          const dummyValidReqPayload = {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          };

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              ...dummyValidReqPayload,
              [payloadFieldKey]: 1,
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'user registration payload fields specification is invalid',
          );
        },
      );

      describe('A username field', () => {
        test('should return error response when it contains whitespace chars', async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'foo bar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'tidak dapat membuat user baru karena username mengandung karakter terlarang',
          );
        });

        test('should return error response when it contains restricted chars', async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'foo@bar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'tidak dapat membuat user baru karena username mengandung karakter terlarang',
          );
        });

        test('should return error response when it contains uppercase letter', async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'FooBar',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'tidak dapat membuat user baru karena username mengandung karakter terlarang',
          );
        });

        test('should return error response when it contains less than 3 chars', async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: 'fo',
              password: 'foobarpass',
              fullname: 'Foo Bar',
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'user registration payload fields specification is invalid',
          );
        });

        test('should return error response when it contains more than 64 chars', async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
              username: `${'foobar45'.repeat(8)}x`,
              password: 'foobarpass',
              fullname: 'Foo Bar',
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'user registration payload fields specification is invalid',
          );
        });
      });

      describe('A fullname Field', () => {
        test.each([
          ' Foo',
          'Foo ',
          ' Foo ',
          ' Foo Bar',
          'Foo Bar ',
          ' Foo Bar ',
        ])(
          'should throw error when it contains whitespace at the start and or the end of a string',
          async (fullname) => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
              method: 'POST',
              url: '/users',
              payload: {
                username: 'foobar',
                password: 'foobarpass',
                fullname,
              },
            });

            // Assert
            expect(response.statusCode).toBe(400);

            const responseJson = JSON.parse(response.payload);

            expect(responseJson.status).toBe('fail');

            expect(responseJson.message).toBe(
              'user registration payload fields specification is invalid',
            );
          },
        );
      });
    });

    describe('A 500 Response Code', () => {
      test('should return error response when server is error', async () => {
        // Arrange
        const server = await createServer({});

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        // Assert
        expect(response.statusCode).toBe(500);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('error');
        expect(responseJson.message).toBe('something went wrong');
      });
    });
  });
});
