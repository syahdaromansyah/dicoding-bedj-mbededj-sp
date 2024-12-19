const UsersTableTestHelper = require('../../../../tests/helpers/UsersTableTestHelper');
const AuthTableTestHelper = require('../../../../tests/helpers/AuthTableTestHelper');
const pool = require('../../databases/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('An Authentications Endpoint', () => {
  afterEach(async () => {
    await AuthTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('A Login User Scenario', () => {
    describe('A 201 Response Code', () => {
      test('should persist refresh token into a db table', async () => {
        // Arrange
        const server = await createServer(container);

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);

        expect(
          (await AuthTableTestHelper.getToken(responseJson.data.refreshToken))
            .token,
        ).toBe(responseJson.data.refreshToken);
      });

      test('should return an HTTP response correctly', async () => {
        // Arrange
        const server = await createServer(container);

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        // Assert
        expect(response.statusCode).toBe(201);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('success');

        expect(typeof responseJson.data.accessToken).toBe('string');
        expect(typeof responseJson.data.refreshToken).toBe('string');
      });
    });

    describe('A 400 Response Code', () => {
      test.each([
        {
          password: 'foobarpass',
        },
        {
          username: 'foobar',
        },
      ])(
        'should return an error response when payload fields are incomplete',
        async (dummyReqPayload) => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: dummyReqPayload,
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'user credential payload fields specification is invalid',
          );
        },
      );

      test.each(['username', 'password'])(
        'should return an error response when payload fields data type are invalid',
        async (payloadFieldKey) => {
          // Arrange
          const server = await createServer(container);

          const dummyValidReqPayload = {
            username: 'foobar',
            password: 'foobarpass',
          };

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/authentications',
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
            'user credential payload fields specification is invalid',
          );
        },
      );

      test('should return an error response when user credential is invalid', async () => {
        // Arrange
        const server = await createServer(container);

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobarwrong',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        // Assert
        expect(response.statusCode).toBe(400);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBe('username or password is invalid');
      });
    });

    describe('A 401 Response Code', () => {
      test('should return an error response when user password is invalid', async () => {
        // Arrange
        const server = await createServer(container);

        await server.inject({
          method: 'POST',
          url: '/users',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
            fullname: 'Foo Bar',
          },
        });

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpasswrong',
          },
        });

        // Assert
        expect(response.statusCode).toBe(401);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('fail');
        expect(responseJson.message).toBe('username or password is invalid');
      });
    });

    describe('A 500 Response Code', () => {
      test('should return an error response when server is error', async () => {
        // Arrange
        const server = await createServer({});

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
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

  describe('An Update Access Token Scenario', () => {
    describe('A 200 Response Code', () => {
      test('should refresh an access token correctly', async () => {
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
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const loginResponseJson = JSON.parse(loginResponse.payload);

        // Action
        const refreshTokenResponse = await server.inject({
          method: 'PUT',
          url: '/authentications',
          payload: {
            refreshToken: loginResponseJson.data.refreshToken,
          },
        });

        // Assert
        expect(refreshTokenResponse.statusCode).toBe(200);

        const refreshTokenResponseJson = JSON.parse(
          refreshTokenResponse.payload,
        );

        expect(refreshTokenResponseJson.status).toBe('success');

        expect(typeof refreshTokenResponseJson.data.accessToken).toBe('string');
      });
    });

    describe('A 400 Response Code', () => {
      test('should return an error response when refresh token field is missing', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/authentications',
          payload: {},
        });

        // Assert
        expect(response.statusCode).toBe(400);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('fail');

        expect(responseJson.message).toBe(
          'refresh token payload field specification is invalid',
        );
      });

      test.each(
        'should return an error response when refresh token field data type is not string',
        async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
              refreshToken: 1,
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe(
            'refresh token payload field specification is invalid',
          );
        },
      );
    });

    describe('A 500 Response Code', () => {
      test('should return an error response when server is error', async () => {
        // Arrange
        const server = await createServer({});

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/authentications',
          payload: {
            refreshToken: 'refresh_token',
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

  describe('A Delete User Refresh Token Scenario', () => {
    describe('A 200 Response Code', () => {
      test('should do a user logout correctly', async () => {
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
        const loginResponse = await server.inject({
          method: 'POST',
          url: '/authentications',
          payload: {
            username: 'foobar',
            password: 'foobarpass',
          },
        });

        const loginResponseJson = JSON.parse(loginResponse.payload);

        await expect(
          AuthTableTestHelper.getToken(loginResponseJson.data.refreshToken),
        ).resolves.not.toBeUndefined();

        // Action
        const userLogoutResponse = await server.inject({
          method: 'DELETE',
          url: '/authentications',
          payload: {
            refreshToken: loginResponseJson.data.refreshToken,
          },
        });

        // Assert
        expect(userLogoutResponse.statusCode).toBe(200);

        const userLogoutResponseJson = JSON.parse(userLogoutResponse.payload);

        expect(userLogoutResponseJson.status).toBe('success');

        expect(userLogoutResponseJson.message).toBe(
          'user logout is successful',
        );

        await expect(
          AuthTableTestHelper.getToken(loginResponseJson.data.refreshToken),
        ).resolves.toBeUndefined();
      });
    });

    describe('A 400 Response Code', () => {
      test('should return an error response when refresh token field is missing', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/authentications',
          payload: {},
        });

        // Assert
        expect(response.statusCode).toBe(400);

        const responseJson = JSON.parse(response.payload);

        expect(responseJson.status).toBe('fail');

        expect(responseJson.message).toBe('user logout is failed');
      });

      test.each(
        'should return an error response when refresh token field data type is not string',
        async () => {
          // Arrange
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: '/authentications',
            payload: {
              refreshToken: null,
            },
          });

          // Assert
          expect(response.statusCode).toBe(400);

          const responseJson = JSON.parse(response.payload);

          expect(responseJson.status).toBe('fail');

          expect(responseJson.message).toBe('user logout is failed');
        },
      );
    });

    describe('A 500 Response Code', () => {
      test('should return an error response when server is error', async () => {
        // Arrange
        const server = await createServer({});

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/authentications',
          payload: {
            refreshToken: 'refresh_token',
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
